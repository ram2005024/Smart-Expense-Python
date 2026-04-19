from expense.selectors.expense_selector import get_month_expense
import math


def compare_previous_current_month_expense(user):
    # Current month Expense
    month_expenses = dict(
        sorted(get_month_expense(user).items(), key=lambda x: x[0], reverse=True)
    )
    current_month_expense = 0
    previous_month_expense = 0
    if month_expenses:
        current_month_expense = list(month_expenses.values())[0]
        previous_month_expense = list(month_expenses.values())[1]
        ratio = current_month_expense / previous_month_expense
        if ratio > 1:
            return {
                "type": "Compare",
                "message": (
                    "Based on the given expenses data from current and previous month"
                    f".Your expense was increased by approx. {math.ceil(ratio)} times.Please take care of your expenses"
                ),
                "previous_expense": previous_month_expense,
                "current_month_expense": current_month_expense,
            }
        else:
            return {
                "type": "Compare",
                "message": (
                    "Based on the given expenses data from current and previous month"
                    f".Your expense was decreased by approx. {math.ceil(ratio)} times."
                ),
                "previous_expense": previous_month_expense,
                "current_month_expense": current_month_expense,
            }
    else:
        return {"message": "Not enough previous expense details to track the progess"}
