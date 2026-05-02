from datetime import datetime
from typing import Optional

from pydantic import BaseModel

from app.models.enums import ReportCategory, ReportStatus, VarnaDistrict


class ReportBase(BaseModel):
    title: str
    description: str
    category: ReportCategory
    district: VarnaDistrict
    address: str
    latitude: float
    longitude: float


class ReportCreate(ReportBase):
    image_url: Optional[str] = None


class ReportUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    category: Optional[ReportCategory] = None
    district: Optional[VarnaDistrict] = None
    address: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    image_url: Optional[str] = None
    admin_note: Optional[str] = None
    status: Optional[ReportStatus] = None


class ReportRead(ReportBase):
    id: int
    status: ReportStatus
    image_url: Optional[str] = None
    admin_note: Optional[str] = None
    created_by_id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True