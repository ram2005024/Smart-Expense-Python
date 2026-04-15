from dateutil.relativedelta import relativedelta
from django.db.models import Sum
from expense.models import Budget, Expense
import datetime
from authentication.models import CustomUser


# Get better percentage
def get_percentile(user):
    total_users = CustomUser.objects.count()
    if total_users == 0:
        return 0
    better_than = CustomUser.objects.filter(health_score__lt=user.health_score).count()
    percentage = better_than / total_users * 100
    return round(percentage)


def get_health_score(user, date=None):
    if date is None:
        date = datetime.date.today()
    # Base on the budget utilization
    budgets = Budget.objects.filter(user=user).annotate(
        total_expense=Sum("budget_expenses__expense_amount")
    )
    utilization_scores = []
    for b in budgets:
        total_spent = b.total_expense or 0
        spent_ratio = total_spent / b.budget_amount
        utilization_scores.append(100 - min(spent_ratio * 100, 100))
    avg_utilization_score = (
        sum(utilization_scores) / len(utilization_scores) if utilization_scores else 100
    )

    # Based on the active budget
    active_ratio = (
        budgets.filter(is_active=True).count() / budgets.count()
        if budgets.exists()
        else 1
    )
    active_score = active_ratio * 100

    # Based on the trend
    # Current Spent
    current_spent = (
        Expense.objects.filter(
            user=user, created_at__year=date.year, created_at__month=date.month
        ).aggregate(current_total=Sum("expense_amount"))["current_total"]
        or 0
    )
    # Previous spent
    prev_date = date - relativedelta(months=1)
    previous_spent = (
        Expense.objects.filter(
            user=user,
            created_at__year=prev_date.year,
            created_at__month=prev_date.month,
        ).aggregate(previous_expense_total=Sum("expense_amount"))[
            "previous_expense_total"
        ]
        or 0
    )
    trend_ratio = (
        (previous_spent - current_spent) / previous_spent * 100 if previous_spent else 0
    )
    trend_score = max(0, 100 - abs(trend_ratio))

    # Calculate the health score based on the above result
    health_score = 0.4 * avg_utilization_score + 0.3 * active_score + 0.3 * trend_score
    better_percentage = get_percentile(user)
    return {
        "health_score": round(health_score),
        "better_than_percentage": (
            f"Good standing-Better than {better_percentage} of companies your size"
            if better_percentage
            else "Not a good standing as you are leading at the top"
        ),
    }
