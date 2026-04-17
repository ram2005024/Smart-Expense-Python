import calendar
from collections import defaultdict
from datetime import datetime
from expense.selectors.budget_selector import get_budget_of_user
from django.utils import timezone


def get_next_month_spend_prediction(user):
    current_month_expense = get_current_month_expense(user)
    today = timezone.now().date()
    day_passed = today.day
    avg_expense_per_day = current_month_expense / day_passed if day_passed > 0 else 0
    # Next month year and day
    next_month_year = today.year + 1 if today.month == 12 else today.year
    next_month = 1 if today.month == 12 else today.month + 1
    next_month_range = calendar.monthrange(year=next_month_year, month=next_month)[1]
    next_month_average = avg_expense_per_day * next_month_range
    if next_month_range:
        return {
            "type": "next_month_prediction",
            "message": f"Based on current pace of spent your predicted expense on next month will be Rs.{round(next_month_average,2)}",
        }


# Function to get the current month expense
def get_current_month_expense(user):
    Budgets = get_budget_of_user(user)
    today = timezone.now().date()
    current_date = datetime.strftime(today, "%Y-%m")
    expense_dict = defaultdict(float)
    current_month_expense = 0
    for b in Budgets.filter(is_active=True):
        expenses = b.budget_expenses.all()
        for e in expenses:
            created_at = datetime.strftime(e.created_at, "%Y-%m")
            expense_dict[created_at] += e.expense_amount or 0
    for expense_date, expense_amount in expense_dict.items():
        if expense_date == current_date:
            current_month_expense = expense_amount
    return current_month_expense
