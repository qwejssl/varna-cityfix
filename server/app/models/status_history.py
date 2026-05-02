from datetime import datetime

from sqlalchemy import DateTime, Enum, ForeignKey, Text
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.db.session import Base
from app.models.enums import ReportStatus


class StatusHistory(Base):
    __tablename__ = "status_history"

    id: Mapped[int] = mapped_column(primary_key=True, index=True)

    report_id: Mapped[int] = mapped_column(ForeignKey("reports.id"), nullable=False)
    changed_by_id: Mapped[int] = mapped_column(ForeignKey("users.id"), nullable=False)

    old_status: Mapped[ReportStatus] = mapped_column(Enum(ReportStatus), nullable=False)
    new_status: Mapped[ReportStatus] = mapped_column(Enum(ReportStatus), nullable=False)

    comment: Mapped[str | None] = mapped_column(Text, nullable=True)
    changed_at: Mapped[datetime] = mapped_column(DateTime, default=datetime.utcnow, nullable=False)

    report = relationship("Report", back_populates="status_history")
    changed_by = relationship("User", back_populates="status_updates")