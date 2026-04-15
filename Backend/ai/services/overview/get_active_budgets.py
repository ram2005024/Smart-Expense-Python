from expense.models import Budget


def get_active_budgets(user):
    active_budgets = Budget.objects.filter(user=user, is_active=True).count()
    inactive_budgets = Budget.objects.filter(user=user, is_active=False).count()
    total = active_budgets + inactive_budgets
    return {
        "active_budgets": active_budgets,
        "inactive_budgets": inactive_budgets,
        "total_budget": total,
    }
