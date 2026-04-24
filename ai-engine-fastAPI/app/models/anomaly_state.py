from sqlalchemy import Column, BigInteger, String, Boolean, ForeignKey, DateTime
from app.db import Base
from datetime import datetime, timezone


class AnomalyState(Base):
    __tablename__ = "ai_anomalystate"

    id = Column(BigInteger, primary_key=True, autoincrement=True)
    reference_id = Column(String(100), nullable=False)
    mark_safe = Column(Boolean, default=False)
    user_id = Column(BigInteger, ForeignKey("authentication_customuser.id"))
    created_at = Column(DateTime, default=lambda: datetime.now(timezone.utc))
