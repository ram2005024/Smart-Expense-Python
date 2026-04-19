# Get all the expense of the user
from expense.models import Expense
from expense.selectors.budget_selector import get_budget_of_user
from collections import defaultdict
from datetime import datetime


def get_expense_of_user(user):
    return Expense.objects.select_related("budget").filter(user=user)


def get_month_expense(user):
    Budgets = get_budget_of_user(user).filter(is_active=True)
    monthly_expenses = defaultdict(float)
    for b in Budgets:
        expenses = b.budget_expenses.all()
        for e in expenses:
            start_month = datetime.strftime(e.created_at, "%Y-%m")
            monthly_expenses[start_month] += round(e.expense_amount)
    return monthly_expenses
