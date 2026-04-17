from fastapi import FastAPI
from .services import (
    budget_insights,
    expense_insights,
    expense_trend,
    expense_anomaly,
)
from sqlalchemy import create_engine

DATABASE_URL = "postgresql://myuser:9crqoovg9@localhost:5432/smart_expenses"
engine = create_engine(DATABASE_URL)

app = FastAPI()

# Include routers in main

app.include_router(budget_insights.router, prefix="/ai", tags=["Budget-Insights"])
app.include_router(expense_insights.router, prefix="/ai", tags=["Expense-Insight"])
app.include_router(expense_trend.router, prefix="/ai", tags=["Expense-Trend-Analyse"])
app.include_router(
    expense_anomaly.router, prefix="/ai", tags=["Expense-Anomaly-Detection"]
)
