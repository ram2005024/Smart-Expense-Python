from fastapi import APIRouter
from typing import List
from app.utils.anomaly import anomaly_detection
router=APIRouter()


@router.post("/expense/anomaly_detection")
def expense_anomaly_detection(data:List[dict]):
    # Call the anomaly detection to detect the expense anomaly
    result=anomaly_detection(data)
    return result