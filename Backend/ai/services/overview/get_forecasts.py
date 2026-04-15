from expense.selectors.budget_selector import get_budget_of_user, get_budget_total_spent
import datetime
from django.utils import timezone


def get_forcast(user):
    forecasts = []
    # Moving average forecast
    budget = get_budget_of_user(user)
    currentDate = datetime.date.today()

    for b in budget:
        if b.is_active:
            remaining = (b.valid_until - currentDate).days
            moving_average = get_moving_average(b.budget_expenses.all(), 7)
            predicted_spent = b.budget_amount + moving_average * remaining
            risk = "Low"
            trend = get_trend(b.budget_expenses.all(), 7)
            if b.budget_amount <= predicted_spent:
                risk = "High"

            forecasts.append(
                build_response(
                    "Average Spend Prediction",
                    f"Budget {b.budget_name} has predicted spent of Rs.{round(predicted_spent)} compared to last 7 days expense pattern",
                    risk,
                    b.budget_amount,
                    remaining if remaining > 0 else 0,
                    trend,
                    predicted_spent,
                )
            )
    return forecasts


# Helpers---------------------------
# ---------Get the moving average of the expense----------
def get_moving_average(expense, window=7):
    day_expense = {}
    for e in expense:
        day = e.created_at.date()
        day_expense[day] = day_expense.get(day, 0) + e.expense_amount
    keys = sorted(day_expense.keys())
    values = [day_expense[key] for key in keys]
    if len(values) == 0:
        return 0
    # Extract the average of last 7 days or window length
    # If less
    if len(values) < window:
        return sum(values) / len(values)
    # If more
    average = sum(values[-window:]) / window
    return average


# Get the trend analysis for the expenses of the budgets
def get_trend(expenses, window=7):
    # Get the trend if the number of expense is more
    day_expense = {}
    for e in expenses:
        day = e.created_at.date()
        day_expense[day] = day_expense.get(day, 0) + e.expense_amount
    keys = sorted(day_expense.keys())
    values = [day_expense[key] for key in keys]
    if len(values) < window * 2:
        return "Stable"
    previous_average = sum(values[-window * 2 : window]) / window
    current_average = sum(values[-window:]) / window
    if previous_average >= current_average:
        return ("Increasing",)
    else:
        return "Decreasing"


# Build the response
def build_response(
    ftype, fmessage, risk, amount, time_remaining=None, trend=None, prediction=None
):
    return {
        "ftype": ftype,
        "fmessage": fmessage,
        "risk": risk,
        "amount": amount,
        "time_remaining": time_remaining,
        "trend": trend,
        "prediction": round(prediction),
    }
