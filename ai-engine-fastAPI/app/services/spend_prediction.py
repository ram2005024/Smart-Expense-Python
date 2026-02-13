from fastapi import APIRouter,Body
from typing import List
router=APIRouter()

@router.post("/budget/expense_prediction")
def get_budget_expense_prediction(data:List[dict]=Body(...)):
    return data