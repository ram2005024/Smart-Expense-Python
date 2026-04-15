from fastapi import APIRouter
from typing import List
import pandas
from app.utils.anomaly_model import AnomalyDetection

router = APIRouter()


@router.post("/expense/anomaly_detection")
def expense_anomaly_detection(data: List[dict]):
    # Call the anomaly detection to detect the expense anomaly
    df = pandas.DataFrame(data)
    results = {
        "duplication": AnomalyDetection.get_duplication(df),
        "spike": AnomalyDetection.get_spike(df),
        "recurring": AnomalyDetection.get_recurring_anomaly(df),
        "temporal": AnomalyDetection.get_timing_anomaly(df),
    }
    return results
