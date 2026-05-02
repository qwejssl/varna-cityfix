from typing import List

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from app.db.session import get_db
from app.dependencies.auth import get_current_user
from app.models.enums import ReportStatus
from app.models.report import Report
from app.models.user import User
from app.schemas.report import ReportCreate, ReportRead, ReportUpdate

router = APIRouter(prefix="/reports", tags=["reports"])


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
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(Report).filter(Report.id == report_id).first()
    if not report:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Report not found",
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

    if report.created_by_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can edit only your own reports",
        )

    if report.status not in {ReportStatus.NEW, ReportStatus.UNDER_REVIEW}:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Report cannot be edited in its current status",
        )

    update_data = report_in.model_dump(exclude_unset=True)
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

    if report.created_by_id != current_user.id:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You can delete only your own reports",
        )

    db.delete(report)
    db.commit()