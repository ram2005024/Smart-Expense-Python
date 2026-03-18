import datetime
from fastapi import APIRouter,Body,Query
from typing import List
from collections import defaultdict
import pandas as pd
from app.db import engine
router=APIRouter()

@router.post("/expense/expense_insight")
def expense_insight(data: List[dict] = Body(...)):
    totalExpense=0
    for expense in data:
        totalExpense+=expense['expense_amount']
# Top category and amount
    expenseCategory=defaultdict(float)
    # Find the expense amount in each category
    for expense in data:
        expenseCategory[expense['expense_category']]+=expense['expense_amount']
    
    # Find the maximum category and amount
    top_category=max(expenseCategory,key=expenseCategory.get)
    top_category_amount=expenseCategory[top_category]
    
    # Find the budget whose expense in maxm
    top_budgets=[exp['budget'] for exp in data if exp['expense_category']==top_category]
    top_budget=max(top_budgets,key=lambda x : x['budget_amount'])
    # Find the highest expense
    
    top_expense=max(data,key=lambda x:x['expense_amount'])
    highest_expense=top_expense['expense_amount']
    highest_expense_on=top_expense['expense_category']

    # Ai Insights
    insights=[
        f"You have more expense on {highest_expense_on} which you created in {top_expense['created_at']} under the budget {top_expense['budget']['budget_name']} which is estimated {top_expense['budget']['budget_amount']}",
        f"You are spending a lot in {top_category} alloted {top_category_amount} please take care about this",
        f"You had maximum income on {top_expense['expense_name']} with Rs{highest_expense}",
        f"Please review the budget and expense wisely on {top_category}"
    ]

    return {
        "top_expense":top_expense,
        "top_category":top_category,
        "total_expense":totalExpense,
        "top_budget":top_budget,
        "insights":insights,
        "highest_expense":highest_expense,
        "highest_expense_on":highest_expense_on,
    }
    
    
# Expense insight for total spend
@router.get("/expense/analytics/total_spent")
def total_expense_analytic(
    month:int=Query(...,ge=1,le=12,description="Month value from 1-12"),
    year:int=Query(...,description="Year value "),
    user_id:str=Query(...,description="Requesting user id"),
):
    # Get the expense data from the database
    df=pd.read_sql(f"SELECT expense_amount, created_at FROM expense_expense where user_id=%s",engine,params=(user_id,))
    change=0
    this_month_total=0
    total_expense_count=0
    if not df.empty:
        # Compare with previous month

        this_month=df[(df["created_at"].dt.month==month) & (df["created_at"].dt.year==year)]
        
        if month==1:
            previous_month=12
            previous_year=year-1
        else:
            previous_month=month-1
            previous_year=year
        last_month=df[(df["created_at"].dt.month==previous_month) & (df["created_at"].dt.year==previous_year)]
        this_month_total=this_month["expense_amount"].sum()
        last_month_total=last_month["expense_amount"].sum()
        
        # Find the change in percentage
        change=((this_month_total-last_month_total)/last_month_total * 100) if last_month_total>0 else 0
        total_expense_count=this_month.shape[0]
    return {
        "change":round(change,1),
        "total_spent":round(this_month_total,2),
        "trend":"up" if change>0 else "down" if change <0 else "stable",
        "user_id":user_id,
        "total_expense":total_expense_count
        
    }

@router.get("/expense/reimbrush/analyse")
def analyse_reimbrushed(month:int=Query(...,ge=1,le=12,description="Month value from 1-12"),
    year:int=Query(...,description="Year value "),
    user_id:str=Query(...,description="Requesting user id"),):
    # Get all the expense of the user
    df=pd.read_sql("SELECT * from expense_expense where user_id=%s",engine,params=(user_id,))
    # Get all the expense of the user for supplied month
    df["created_at"]=pd.to_datetime(df["created_at"])
    df=df[(df["created_at"].dt.month==month) & (df["created_at"].dt.year==year)]
        # Get the total reimbrushed amount
    reimbrushed_df=df[df["status"]=="REIMBRUSHED"]
    total_reimbrushed=reimbrushed_df["expense_amount"].sum()
    # Get how many transactions are reimbrushed
    total_reimbrushed_transactions=reimbrushed_df.shape[0] or 0
    # Find the trend
    trend="stable"
    if total_reimbrushed_transactions > total_reimbrushed_transactions//2:
        recent_avg=reimbrushed_df.head(total_reimbrushed_transactions//2)["expense_amount"].mean()
        last_avg=reimbrushed_df.tail(total_reimbrushed_transactions//2)["expense_amount"].mean()
        if recent_avg > last_avg:
            trend="up"
        else:
            trend="down"
    
    return {
        "reimbrushed_amount":round(total_reimbrushed,2),
        "trend":trend,
        "transactions":total_reimbrushed_transactions
    }
@router.get("/expense/pending/analyse")
def analyse_pending(month:int=Query(...,ge=1,le=12,description="Month value from 1-12"),
    year:int=Query(...,description="Year value "),
    user_id:str=Query(...,description="Requesting user id"),):
    # Get all the expense of the user
    df=pd.read_sql("SELECT * from expense_expense where user_id=%s",engine,params=(user_id,))
    if df.empty:
        return None
    # Get all the expense of the user for supplied month
    df["created_at"]=pd.to_datetime(df["created_at"])
    df=df[(df["created_at"].dt.month==month) & (df["created_at"].dt.year==year)]
    # Get all the expense which are pending
    pending_df=df[df["status"]=='PENDING']
    # Find the pending amount
    pending_total=pending_df["expense_amount"].sum()
    pending_expenses_number=pending_df.shape[0]
    
    # Find the trend of the expense which are pending vs other months
    # Get how many transactions are reimbrushed
    total_pending_transactions=pending_df.shape[0] or 0
    # Find the trend
    trend="stable"
    if total_pending_transactions > total_pending_transactions//2:
        recent_avg=pending_df.head(total_pending_transactions//2)["expense_amount"].mean()
        last_avg=pending_df.tail(total_pending_transactions//2)["expense_amount"].mean()
        if recent_avg > last_avg:
            trend="up"
        else:
            trend="down"

    # Find the average approval time of the pending expense
    
    # Get all the expense that was reimburshed
    average_pending_approval_days=None
    reimburshed_df=pd.read_sql("SELECT * FROM expense_expense where user_id=%s AND status=%s",engine,params=(user_id,"REIMBRUSHED"))
    if not reimburshed_df.empty:
        # Add the field to find the day count when the expense was reimburshed
        reimburshed_df['count_reimbrushed']=(
            (pd.to_datetime(reimburshed_df["updated_at"])-pd.to_datetime(reimburshed_df["created_at"])).dt.days
        )
        # Calculate the average pending approval days
        average_pending_approval_days=reimburshed_df['count_reimbrushed'].mean()

    # Find the oldest pending expense
    # Make a pending days field for each expense and filter out the maxm;;
    if not pending_df.empty:
        pending_df["created_at"]=pd.to_datetime(pending_df["created_at"])
        pending_df["oldest_days"]=(
        pd.Timestamp.now(tz="UTC")-pending_df["created_at"]
        ).dt.days
        oldest_pending_from=pending_df["oldest_days"].max()
    else:
        oldest_pending_from=0
  
    # Find the aproval rate of the pending expense
    # First determine since from 1month ago how much expense was reimburshed and how much were declined 
    last_month=pd.to_datetime("today",utc=True)-pd.DateOffset(months=1) 
    recent_expenses=df[pd.to_datetime(df["created_at"])>=last_month]
    reimburshed_expense_since_last_month=recent_expenses[recent_expenses["status"]=="REIMBRUSHED"].shape[0]
    declined_expense_since_last_month=recent_expenses[recent_expenses["status"]=="DECLINED"].shape[0]
    approval_rate=reimburshed_expense_since_last_month/(reimburshed_expense_since_last_month+declined_expense_since_last_month)*100 if reimburshed_expense_since_last_month+declined_expense_since_last_month>0 else 0

    # Calculate the reimburshment day for each pending expense

    
    
    return {
        "average_approval_days":round(average_pending_approval_days ) if average_pending_approval_days is not None else 0,
        "pending_total":round(pending_total,2),
        "pending_expenses_number":pending_expenses_number,
        "oldest_pending_from":int(oldest_pending_from) ,
        "approval_rate":round(approval_rate,1),
        "trend":trend
    }

@router.get("/expense/decline/analyse")
def analyse_reimbrushed(month:int=Query(...,ge=1,le=12,description="Month value from 1-12"),
    year:int=Query(...,description="Year value "),
    user_id:str=Query(...,description="Requesting user id")):
    # Get all the expense of the user
    df=pd.read_sql("SELECT * from expense_expense where user_id=%s",engine,params=(user_id,))
    # Get all the expense of the user for supplied month
    df["created_at"]=pd.to_datetime(df["created_at"])
    df=df[(df["created_at"].dt.month==month) & (df["created_at"].dt.year==year)]
    # Get the total declined amount
    declined_df=df[df["status"]=="DECLINED"]
    total_declined=declined_df["expense_amount"].sum()
    # Get how many transactions are reimbrushed
    total_declined_transactions=declined_df.shape[0] or 0
    # Find the trend
    trend="stable"
    if total_declined_transactions > total_declined_transactions//2:
        recent_avg=declined_df.head(total_declined_transactions//2)["expense_amount"].mean()
        last_avg=declined_df.tail(total_declined_transactions//2)["expense_amount"].mean()
        if recent_avg > last_avg:
            trend="up"
        else:
            trend="down"
    
    return {
        "declined_amount":round(total_declined,1),
        "trend":trend,
        "transactions":total_declined_transactions
    }