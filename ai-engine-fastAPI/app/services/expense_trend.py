import datetime
from fastapi import APIRouter,Body
from typing import List
from collections import defaultdict
router=APIRouter()
from pydantic import BaseModel
class Expense(BaseModel):
    category:str
    amount:int
    created_at:str
class Expense_Trend(BaseModel):
    expense:List[Expense]
    start_date:str
@router.post("/expense/trend_analyse")
def get_expense_trend(payload:Expense_Trend=Body(...)):
    # Get the data of a certain date
    data=payload.expense
    start_date=datetime.date.fromisoformat(payload.start_date)
    expense_data=defaultdict(float)
    for exp in data:
        expense_data[exp.created_at]+=exp.amount
    
    # Get the expense of date in chronological order :---> order in which they are created
    expense_values=[]
    for i in range(14):
        currentday=start_date+datetime.timedelta(days=i)
        key=currentday.isoformat()
        expense_values.append(expense_data[key])
   
    previous_expense=expense_values[:7]
    last_expense=expense_values[7:]
    try:
        trend=((sum(previous_expense)-sum(last_expense))/sum(previous_expense))*100
        return {'trend_comment':f"You last 7 days expense is leading by {int(abs(trend))}% than the previous 7 days expenses.Please control it ASAP!" if trend <0 else f"You last 7 days expense is behind  {int(abs(trend))}% than the previous 7 days expenses.Go Job👏🎉",
                'trend':"decreasing" if trend >0 else "increasing",
                'prev':sum(previous_expense),
                'trend_percentage':int(abs(trend)),
                'last':sum(last_expense)}
    except ZeroDivisionError:
        return {
            "error":"Zero division error as previous 7 days expense is null"
        }