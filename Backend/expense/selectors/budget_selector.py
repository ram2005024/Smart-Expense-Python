# Get all the budget along with the expense of the user
from expense.models import Budget
from django.db.models import Sum
from django.db.models.functions import TruncMonth


def get_budget_of_user(user):
    return Budget.objects.prefetch_related("budget_expenses").filter(user=user)


def get_budget_total_spent(budget):
    return (
        budget.budget_expenses.aggregate(total_spent=Sum("expense_amount"))[
            "total_spent"
        ]
        or 0
    )


def get_group_budget_with_expense_month_category(user):
    return (
        get_budget_of_user(user)
        .filter(is_active=True)
        .annotate(month=TruncMonth("budget_expenses__created_at"))
        .values("budget_field", "month")
        .annotate(total_spent=Sum("budget_expenses__expense_amount"))
    )
