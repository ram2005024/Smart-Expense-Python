from sqlalchemy import Column, Integer, Float, Boolean, DateTime, ForeignKey
from sqlalchemy.dialects.postgresql import JSON
from app.db import Base


class Overview(Base):
    __tablename__ = "ai_overview_model"

    id = Column(Integer, primary_key=True, index=True)
    anomalies = Column(JSON, nullable=True)
    forecasts = Column(JSON, nullable=True)
    total_spent = Column(JSON, nullable=True)
    total_saving = Column(JSON, nullable=True)
    health_score = Column(JSON, nullable=True)
    budget_count_list = Column(JSON, nullable=True)
    warnings = Column(JSON, nullable=True)
    tips = Column(JSON, nullable=True)
    spend_trend = Column(JSON, nullable=True)
    is_refreshed = Column(Boolean, default=False)
    updated_on = Column(DateTime)
    user_id = Column(Integer, ForeignKey("auth_user.id"), unique=True)
    prediction_count = Column(Integer, nullable=True)
    data_points = Column(Float, default=0)
    accuracy_percentage = Column(Integer, nullable=True)
