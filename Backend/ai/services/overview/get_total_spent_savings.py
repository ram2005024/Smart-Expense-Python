from expense.models import Budget, Expense
from django.db.models import Sum
from dateutil.relativedelta import relativedelta


def get_total_spent(request, date):
    # Current Spent
    current_spent = (
        Expense.objects.filter(
            user=request.user, created_at__year=date.year, created_at__month=date.month
        ).aggregate(current_total=Sum("expense_amount"))["current_total"]
        or 0
    )
    # Previous spent
    prev_date = date - relativedelta(months=1)
    previous_spent = (
        Expense.objects.filter(
            user=request.user,
            created_at__year=prev_date.year,
            created_at__month=prev_date.month,
        ).aggregate(previous_expense_total=Sum("expense_amount"))[
            "previous_expense_total"
        ]
        or 0
    )

    # Compare the expense of current period vs previous month
    trend_percent = (
        0
        if previous_spent == 0
        else ((current_spent - previous_spent) / previous_spent) * 100
    )
    trend = "Stable"
    if trend_percent and trend_percent < 0:
        trend = "Down"
    if trend_percent and trend_percent > 0:
        trend = "Up"

    return {
        "current_spent": round(current_spent),
        "trend": trend,
        "trend_percentage": abs(round(trend_percent)),
    }


def get_total_saving(request, date):
    budgets = Budget.objects.filter(
        user=request.user,
        budget_expenses__created_at__year=date.year,
        budget_expenses__created_at__month=date.month,
        is_active=False,
    ).annotate(total_expense=Sum("budget_expenses__expense_amount"))
    total_saving = 0
    for b in budgets:
        remaining = b.budget_amount - b.total_expense
        if remaining > 0:
            total_saving += remaining
        else:
            pass

    return {
        "total_saving": round(total_saving),
        "signal": "green" if total_saving else "red",
    }
