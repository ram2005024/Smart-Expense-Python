from datetime import datetime
from django.utils import timezone
import calendar
from expense.selectors.expense_selector import get_month_expense


def get_spent_forecast_trend(user):
    monthly_expense = get_month_expense(
        user
    )  # dict like {"2026-03": 5000, "2026-04": 2000}
    today = timezone.now().date()
    current_month = today.strftime("%Y-%m")
    day_passed = today.day
    total_days_in_month = calendar.monthrange(today.year, today.month)[1]
    total_spent = monthly_expense.get(current_month, 0)
    trend = []

    for month_str, expense in monthly_expense.items():
        month_date = datetime.strptime(month_str, "%Y-%m")
        current_date = datetime.strptime(current_month, "%Y-%m")

        if month_date < current_date:
            # For past months, simulate prediction as if we only had data until mid-month
            days_in_month = calendar.monthrange(month_date.year, month_date.month)[1]
            # Example: assume we had expense data for first half of month
            half_days = days_in_month // 2
            predicted_spent = round(
                (expense / days_in_month) * days_in_month
            )  # fallback
            # Or: predicted_spent = round((expense / days_in_month) * half_days * 2)

            trend.append(
                {
                    "actual_spend": expense,
                    "predicted_spent": predicted_spent,
                    "month": month_str,
                }
            )

    # Current month forecast
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
