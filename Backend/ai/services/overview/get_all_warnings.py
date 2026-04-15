from expense.selectors.expense_selector import get_expense_of_user
from django.core.cache import cache
from expense.selectors.budget_selector import get_budget_of_user, get_budget_total_spent
import datetime
from django.utils import timezone


def get_warning(user):
    budget = get_budget_of_user(user)
    expense = get_expense_of_user(user)
    cache_key = f"expense_warning:{user.id}"
    warnings = cache.get(cache_key)
    if warnings is not None:
        return warnings

    # If not warning in the cache recompute
    warnings = []
    warnings.extend(get_budget_warning(budget))
    warnings.extend(get_expense_warning(expense))

    cache.set(cache_key, warnings, timeout=600)
    return warnings


# Budget Warning
def get_budget_warning(budget):
    current = datetime.date.today()
    warnings = []
    for b in budget:
        isExpired = b.valid_until and current > b.valid_until
        isExpiring = is_budget_expiring(b, 2)
        isExceeded = is_budget_exceeded(b)
        is_inactive = True if b.is_active else False

        if isExpired:
            warnings.append(
                buildWarning(
                    "Expired",
                    b.budget_name,
                    "Critical",
                    b.budget_amount,
                    b.budget_field,
                    "This budget has been expired.Please review or delete it ",
                )
            )
        if isExpiring:
            warnings.append(
                buildWarning(
                    "Expiring",
                    b.budget_name,
                    "High",
                    b.budget_amount,
                    b.budget_field,
                    "This budget is expiring.Please review it  ",
                )
            )
        if isExceeded:
            warnings.append(
                buildWarning(
                    "Exceeded",
                    b.budget_name,
                    "Critical",
                    b.budget_amount,
                    b.budget_field,
                    "This budget has been exceeded.Please manage the expenses or reallocate the budget ",
                )
            )
        if is_inactive:
            warnings.append(
                buildWarning(
                    "Inactive budget",
                    b.budget_name,
                    "Critical",
                    b.budget_amount,
                    b.budget_field,
                    "This budget is inactive.",
                )
            )
    return warnings


# Expense Warning
def get_expense_warning(expense, threshold=10000):
    current = timezone.now()
    warnings = []
    for e in expense:
        # DECLINED
        if e.status == "DECLINED":
            warnings.append(
                buildWarning(
                    "Declined Expense",
                    e.expense_name,
                    "High",
                    e.expense_amount,
                    e.expense_category,
                    "This expense is declined.Please review it",
                )
            )
        if e.status == "PENDING":
            warnings.append(
                buildWarning(
                    "Pending Expense",
                    e.expense_name,
                    "Medium",
                    e.expense_amount,
                    e.expense_category,
                    "This expense is in pending state.Please review.",
                )
            )
        if e.expense_amount >= threshold:
            warnings.append(
                buildWarning(
                    "Over expense",
                    e.expense_name,
                    "High",
                    e.expense_amount,
                    e.expense_category,
                    "This expense is too high than the usual please manage it or review",
                )
            )

        if (e.created_at - current).days < 8 and e.status == "PENDING":
            warnings.append(
                buildWarning(
                    "Un-reviwed",
                    e.expense_name,
                    "Medium",
                    e.expense_amount,
                    e.expense_category,
                    "This expense isn't being reviewed since from last 8 days.Please check the expense.",
                )
            )
    return warnings


# Build the response
def buildWarning(type, name, risk, amount, category, message):
    return {
        "type": type,
        "name": name.title(),
        "risk": risk,
        "message": message,
        "amount": amount,
        "category": category,
    }


# Warning helpers
def is_budget_expiring(budget, thresold=3):
    if budget.valid_until:
        remaining = (budget.valid_until - datetime.date.today()).days
        if 0 < remaining <= thresold:
            return True
    return False


# To find whether the budget has exceeded or not
def is_budget_exceeded(budget):
    total_spent = get_budget_total_spent(budget)
    if total_spent >= budget.budget_amount:
        return True
    return False
