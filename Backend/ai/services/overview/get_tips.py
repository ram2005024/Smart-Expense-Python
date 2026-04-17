from django.core.cache import cache
from expense.selectors.budget_selector import get_budget_of_user
from django.db.models import Sum
from django.utils import timezone


def get_tips(user):
    cache_key = f"tips:{user.id}"
    tips = cache.get(cache_key)
    if tips is not None:
        return tips
    tips = []
    Budget = get_budget_of_user(user)
    # Get the budget inactive tips
    tips.extend(budget_inactive_tips(Budget))
    # Budget overspent category
    tips.extend(get_tip_from_overspent_budget_category(user))
    # Budget when about to expire
    tips.extend(get_hint_on_about_expire(user))
    cache.set(cache_key, tips, timeout=600)
    return tips


def budget_inactive_tips(budget_queryset):
    tips = []
    # Find the total budget of a user
    inactive_budget = budget_queryset.filter(is_active=False).count()
    if inactive_budget:
        tips.append(
            build_tip_response(
                "Inactive Budgets",
                f"The number of inactive budgets is {inactive_budget}.Please remove or add a new ones.",
                "High",
            )
        )
    return tips


# Budget overspent category
def get_tip_from_overspent_budget_category(user):
    tips = []
    Budget = (
        get_budget_of_user(user)
        .filter(is_active=True)
        .annotate(total_expense=Sum("budget_expenses__expense_amount"))
    )
    expense_dict = {}
    for b in Budget:
        expense_dict[b.budget_name] = b.total_expense
    if expense_dict:
        sorted_value = dict(
            sorted(expense_dict.items(), key=lambda item: item[1], reverse=True)
        )
        risk = "Low"
        total_budget_expense = 0
        for value in list(sorted_value.values()):
            total_budget_expense += value
        maximum_value = list(sorted_value.values())[0]
        maximum_budget_name = list(sorted_value.keys())[0]
        expense_percent = (maximum_value / total_budget_expense) * 100
        if expense_percent > 80:
            risk = "High"
        if expense_percent >= 90:
            risk = "Critical"
        tips.append(
            build_tip_response(
                "overspent_category",
                f"You have overspent on {maximum_budget_name}.Please control the expense for this category",
                risk,
                maximum_budget_name,
                Budget.filter(budget_name=maximum_budget_name).first().budget_amount,
            )
        )
    return tips


# Tip when the budget is about to expire
def get_hint_on_about_expire(user):
    Budgets = get_budget_of_user(user).filter(is_active=True)
    tips = []
    today = timezone.now().date()
    for b in Budgets:
        if b.valid_until:
            is_about_to_expire = (today - b.valid_until).days
            if 0 < is_about_to_expire <= 3:
                tips.append(
                    build_tip_response(
                        "expiring",
                        f"Budget {b.budget_name} is about to expire in {is_about_to_expire} please analyse and review it",
                        "High",
                        b.budget_name,
                        b.budget_amount,
                    )
                )
    return tips


# Prepare the output for the tips
def build_tip_response(
    type, tip_message, serverity, budget_name=None, budget_amount=None
):
    return {
        "tip_type": type,
        "tip_message": tip_message,
        "severity": serverity,
        "budget_name": budget_name,
        "budget_amount": budget_amount,
    }
