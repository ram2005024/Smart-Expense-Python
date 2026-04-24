from datetime import datetime
from fastapi import APIRouter
from typing import List
import pandas
from pydantic import BaseModel
from app.utils.anomaly_model import AnomalyDetection
from sqlalchemy.orm import Session
from fastapi import Depends
from app.dependencies import get_db

router = APIRouter()


class Expense(BaseModel):
    id: str
    expense_name: str
    expense_category: str
    created_at: datetime
    expense_amount: float


class AnomalyRequest(BaseModel):
    user_id: str
    data: List[Expense]


@router.post("/expense/anomaly_detection")
def expense_anomaly_detection(request: AnomalyRequest, db: Session = Depends(get_db)):
    # Call the anomaly detection to detect the expense anomaly
    df = pandas.DataFrame([item.model_dump() for item in request.data])
    results = {
        "duplication": AnomalyDetection.get_duplication(df, request.user_id, db),
        "spike": AnomalyDetection.get_spike(df, request.user_id, db),
        "recurring": AnomalyDetection.get_recurring_anomaly(df, request.user_id, db),
        "temporal": AnomalyDetection.get_timing_anomaly(df, request.user_id, db),
    }
    return results
