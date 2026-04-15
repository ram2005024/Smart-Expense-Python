# Get all the expense of the user
from expense.models import Expense


def get_expense_of_user(user):
    return Expense.objects.select_related("budget").filter(user=user)
