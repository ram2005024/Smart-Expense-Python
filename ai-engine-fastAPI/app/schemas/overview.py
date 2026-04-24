from pydantic import BaseModel
from typing import Optional, Any


class OverviewSchema(BaseModel):
    anomalies: Optional[Any]
    forecasts: Optional[Any]
    total_spent: Optional[Any]
    total_saving: Optional[Any]
    health_score: Optional[Any]
    budget_count_list: Optional[Any]
    warnings: Optional[Any]
    tips: Optional[Any]
    spend_trend: Optional[Any]
    is_refreshed: bool
    prediction_count: Optional[int]
    data_points: Optional[float]
    accuracy_percentage: Optional[int]

    class Config:
        orm_mode = True
