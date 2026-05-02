from pathlib import Path
from typing import List
from uuid import uuid4

from fastapi import APIRouter, Depends, File, HTTPException, UploadFile, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.enums import ReportStatus, UserRole
from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportCreate, ReportRead, ReportUpdate

BASE_DIR = Path(__file__).resolve().parents[3]
UPLOAD_DIR = BASE_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

router = APIRouter(prefix="/reports", tags=["reports"])

ALLOWED_IMAGE_TYPES = {"image/jpeg", "image/png", "image/webp"}
MAX_FILE_SIZE = 5 * 1024 * 1024


@router.get("/", response_model=List[ReportRead])
def list_reports(db: Session = Depends(get_db)):
    return db.query(Report).order_by(Report.created_at.desc()).all()


@router.get("/my", response_model=List[ReportRead])
def my_reports(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    return (
        db.query(Report)
        .filter(Report.created_by_id == current_user.id)
        .order_by(Report.created_at.desc())
        .all()
    )


@router.get("/{report_id}", response_model=ReportRead)
def get_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    if (
        current_user.role != UserRole.ADMIN
        and report.created_by_id != current_user.id
    ):
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can view only your own reports",
        )

    return report


@router.post("/", response_model=ReportRead, status_code=status.HTTP_201_CREATED)
def create_report(
    report_in: ReportCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = Report(
        **report_in.model_dump(),
        status=ReportStatus.NEW,
        created_by_id=current_user.id,
    )
    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.post("/upload-image")
async def upload_report_image(
    file: UploadFile = File(...),
    current_user: User = Depends(get_current_user),
):
    if file.content_type not in ALLOWED_IMAGE_TYPES:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Only JPG, PNG and WEBP images are allowed",
        )

    contents = await file.read()

    if len(contents) > MAX_FILE_SIZE:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Image is too large. Maximum size is 5 MB",
        )

    extension = Path(file.filename or "").suffix.lower()
    if extension not in {".jpg", ".jpeg", ".png", ".webp"}:
        extension = ".jpg"

    filename = f"{uuid4().hex}{extension}"
    file_path = UPLOAD_DIR / filename

    try:
        file_path.write_bytes(contents)
    except Exception as exc:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Failed to save image: {exc}",
        )

    if not file_path.exists():
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Image was not saved. Expected path: {file_path}",
        )

    return {
        "image_url": f"http://127.0.0.1:8000/uploads/{filename}",
        "uploaded_by": current_user.id,
    }


@router.put("/{report_id}", response_model=ReportRead)
def update_report(
    report_id: int,
    report_in: ReportUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    is_admin = current_user.role == UserRole.ADMIN
    is_owner = report.created_by_id == current_user.id

    if not is_admin and not is_owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can edit only your own reports",
        )

    if not is_admin and report.status not in {
        ReportStatus.NEW,
        ReportStatus.UNDER_REVIEW,
    }:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report cannot be edited in its current status",
        )

    update_data = report_in.model_dump(exclude_unset=True)

    if not is_admin:
        update_data.pop("status", None)
        update_data.pop("admin_note", None)

    for field, value in update_data.items():
        setattr(report, field, value)

    db.add(report)
    db.commit()
    db.refresh(report)
    return report


@router.delete("/{report_id}", status_code=status.HTTP_204_NO_CONTENT)
def delete_report(
    report_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
        )

    is_admin = current_user.role == UserRole.ADMIN
    is_owner = report.created_by_id == current_user.id

    if not is_admin and not is_owner:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can delete only your own reports",
        )

    db.delete(report)
    db.commit()