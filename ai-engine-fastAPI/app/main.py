from fastapi import FastAPI
from .services import budget_insights,expense_insights,expense_trend

app=FastAPI()

# Include routers in main

app.include_router(budget_insights.router,prefix="/ai",tags=['Budget-Insights'])
app.include_router(expense_insights.router,prefix="/ai",tags=["Expense-Insight"])
app.include_router(expense_trend.router,prefix="/ai",tags=["Expense-Trend-Analyse"])