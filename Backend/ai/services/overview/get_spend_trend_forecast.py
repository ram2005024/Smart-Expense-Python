from datetime import datetime
from django.utils import timezone
import calendar
from expense.selectors.expense_selector import get_month_expense


def get_spent_forecast_trend(user):
    monthly_expense = get_month_expense(user)
    today = timezone.now().date()
    current_month = datetime.strftime(today, "%Y-%m")
    day_passed = today.day
    total_days_in_month = calendar.monthrange(today.year, today.month)[1]
    total_spent = monthly_expense.get(current_month, 0)
    trend = []
    # If the month passed then send the actual spend of that month
    for month, expense in monthly_expense.items():
        if month < current_month:
            trend.append(
                {"actual_spend": expense, "predicted_spend": None, "month": month}
            )
    predicted_spent = (
        (total_spent / day_passed) * total_days_in_month if day_passed > 0 else 0
    )
    trend.append(
        {
            "actual_spend": None,
            "predicted_spent": round(predicted_spent),
            "spent_so_far": total_spent,
            "month": current_month,
        }
    )
    return trend
