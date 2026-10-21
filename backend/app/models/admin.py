from datetime import datetime
from sqlalchemy import Column, Integer, String, Text, DateTime
from backend.app.core.database import Base

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(Integer, default=1)
    action = Column(String(50), nullable=False) # e.g. "DATASET_VERIFIED", "CORRECTION_PROPOSED"
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(50), nullable=False)
    details_json = Column(Text, default="{}")
    timestamp = Column(DateTime, default=datetime.utcnow)


class DatasetVersion(Base):
    __tablename__ = "dataset_versions"

    id = Column(Integer, primary_key=True, autoincrement=True)
    name = Column(String(100), nullable=False) # "Tanzil Uthmani Canonical Text"
    version_tag = Column(String(50), nullable=False) # "v1.0.2"
    sha256_checksum = Column(String(64), nullable=False)
    verified_at = Column(DateTime, default=datetime.utcnow)
    verified_by = Column(String(100), default="Antigravity Senior Architect")


class ContentCorrectionReport(Base):
    __tablename__ = "content_correction_reports"

    id = Column(Integer, primary_key=True, autoincrement=True)
    entity_type = Column(String(50), nullable=False) # "translation", "tafsir", "morphology"
    entity_id = Column(String(50), nullable=False)
    reported_by = Column(String(100), nullable=False)
    issue_description = Column(Text, nullable=False)
    proposed_correction = Column(Text, nullable=False)
    status = Column(String(50), default="pending_review") # "pending_review", "approved", "rejected"
    created_at = Column(DateTime, default=datetime.utcnow)
