from fastapi import APIRouter
import time
from typing import List
from app.schemas import BudgetSpend
from datetime import timedelta,datetime
router=APIRouter()

@router.post("/budget/budget_insights")
def budget_insight(data:dict):
    budget_amount=data['budget_amount']
    expense_amount=data['expense_amount']
    # Find the remaining day for expense for this budget
    budget_time=data['budget_time']
    created_at=datetime.strptime(data['created_at'], "%Y-%m-%dT%H:%M:%S.%fZ")
    saved_amount=None
    
    if budget_time=='WEEKLY':
        finishing_time=created_at + timedelta(days=7)
       
    elif budget_time=='DAY':
        finishing_time=created_at + timedelta(days=1)
        
    elif budget_time=='MONTHLY':
        finishing_time=created_at + timedelta(days=30)
        
    elif budget_time=='SEMI YEARLY':
        finishing_time=created_at + timedelta(days=180)
        
    else :
        finishing_time=created_at + timedelta(days=365)
    remaining_time=finishing_time.timestamp()-time.time() 
        # Usage percentage
    usage_percentage=int((expense_amount/budget_amount) *100)
    # Remaining time
    days=int(remaining_time//(24 *3600))
    hours=int((remaining_time % (24 * 3600))// 3600)
    mins=int(remaining_time % 3600 //60)
    # Give ai insight 
    if usage_percentage >=100 and remaining_time:
        insight="You have finished all the budget amount already"
        status="full"
    elif usage_percentage <50 and usage_percentage >10  and remaining_time:
        insight="You are fine using the budget but take care  in un-necessary expense"
        status="low"
    elif usage_percentage>50 and usage_percentage<75 and remaining_time:
        insight="You have used more that 50% of budget but take care  in un-necessary expense"
        status="half"
    elif usage_percentage > 75 and usage_percentage<90 and expense_amount < budget_amount and remaining_time:
        insight="You are close to the budget amount.Please take care about it"
        status="quarter"
    elif usage_percentage >= 90  and expense_amount < budget_amount and remaining_time:
        insight="You are too close to the budget amount.Please take care about it and control expense "
        status="quarter"
    elif usage_percentage==0 and remaining_time:
        insight="Ready to startup with this budget let's go!"
        status="nothing"
    elif usage_percentage>0 and usage_percentage<10  and remaining_time:
        insight=f"Start the expense for this budget ,as you have {days} days {hours} hours {mins} mins left"
        status="less"
    else:
        status="pink"
        saved_amount=budget_amount-expense_amount
        insight=f"Congratulations🎉🎉 you have saved the budget amount by Rs{saved_amount}"
    # Give the active status
    # Format the time and provide as 

    #Give the budget usage status 
    ai_insight={
        "status":status,
        "insight":insight,
        "remaining_time":f"{days} days {hours} hours {mins} mins left",
        "finishing_time":finishing_time.time(),  
        "usage_percentage":f"{usage_percentage}%",
        "expense_amount":expense_amount,
        "budget_amount":budget_amount,
        "remaining_amount":budget_amount-expense_amount,
       ** ({"saved_amount":saved_amount} if saved_amount is not None else {})
       
    }
    return ai_insight

@router.post("/budget/budgetSpend")
def budget_spend(formatted_values:List[BudgetSpend]):
   result={}
   for exp in formatted_values:
       if exp.month not in result:
           result[exp.month]=0
       amt=exp.expense_amount
       result[exp.month]=round(result.get(exp.month,0)+amt,2)
   return result