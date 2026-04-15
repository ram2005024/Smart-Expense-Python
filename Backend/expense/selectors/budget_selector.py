# Get all the budget along with the expense of the user
from expense.models import Budget
from django.db.models import Sum


def get_budget_of_user(user):
    return Budget.objects.prefetch_related("budget_expenses").filter(user=user)


def get_budget_total_spent(budget):
    return (
        budget.budget_expenses.aggregate(total_spent=Sum("expense_amount"))[
            "total_spent"
        ]
        or 0
    )
