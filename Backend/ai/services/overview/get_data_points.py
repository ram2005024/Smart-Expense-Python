from expense.models import Budget
from django.db.models import Count


def get_data_points(user):
    budgets = Budget.objects.filter(user=user, is_active=True).annotate(
        expense_count=Count("budget_expenses")
    )
    budget_count = budgets.count()
    expense_count = sum(b.expense_count for b in budgets)
    return (budget_count + expense_count) * 1.5
