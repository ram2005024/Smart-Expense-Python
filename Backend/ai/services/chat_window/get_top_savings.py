from collections import defaultdict
from expense.selectors.budget_selector import get_budget_of_user, get_budget_total_spent
from django.db.models import Sum


def get_top_savings(user):
    # Check if the user has enough Budget data or not
    Budgets = get_budget_of_user(user).filter(is_active=True)
    expense_count = sum(b.budget_expenses.count() for b in Budgets)
    budget_count = Budgets.count()
    if budget_count < 3 or expense_count < 5:
        return {
            "type": "saving",
            "results": [
                {
                    "method": "Freeze",
                    "description": "Freeze discretionary categories like PERSONAL,TRIP,CLOTHS to minimize the expense",
                },
                {
                    "method": "Under Budget",
                    "description": "Try to reallocate the amount of under-budget to control the overspending in another budget",
                },
            ],
            "message": "You don't have enough data for the budget though try to maintain the data and follow the guidance to save the money",
        }
    else:
        results = []
        # Give suggestion on the basis of freezing the underbudget expense
        results.append(get_under_budget_saving_tips(user))
        results.extend(get_descritionary_budgets(user))
        results.extend(get_saving_suggestion_from_usage_of_inactive_budgets(user))
    return {
        "type": "saving",
        "results": results,
        "description": f"Here are top {len(results)} strategies to save the money for your expense ",
    }


def get_under_budget_saving_tips(user):
    # Get the budget with total spent and group with the same field name
    Budget = (
        get_budget_of_user(user)
        .filter(is_active=True)
        .values("budget_field")
        .annotate(
            total_spent=Sum("budget_expenses__expense_amount"),
            total_budget_amount=Sum("budget_amount"),
        )
    )
    # Find the budget that are under the budget_amount
    result = []
    for b in Budget:
        total_spent = b["total_spent"] or 0
        budget_amount = b["total_budget_amount"]
        if budget_amount > total_spent:
            spent_percentage = (total_spent / budget_amount) * 100
            if spent_percentage <= 80:
                result.append(
                    {
                        "type": "Under-budget minimization",
                        "message": f"Budget with category {b['budget_field']} has spent percentage {round(spent_percentage,2)}% which is under the budget.Try reallocating this budget amount if there is  overspent budget or freeze this budget expense ",
                    }
                )
    return result[0] if result else None


def get_descritionary_budgets(user):
    DESCRITIONARY_BUDGETS = ["TRIP", "PERSONAL", "CLOTHS"]
    INCLUDED_DESCRITIONARY_BUDGETS = []
    result = []
    # Get the budget with their total spent and total_budget_amount
    Budget = (
        get_budget_of_user(user)
        .filter(is_active=True)
        .values("budget_field")
        .annotate(
            total_spent=Sum("budget_expenses__expense_amount"),
            total_budget_amount=Sum("budget_amount"),
        )
    )
    for b in Budget:
        spent_percentage = round((b["total_spent"] / b["total_budget_amount"]) * 100, 2)
        if spent_percentage <= 50 and b["budget_field"] in DESCRITIONARY_BUDGETS:
            INCLUDED_DESCRITIONARY_BUDGETS.append(b["budget_field"])
    if INCLUDED_DESCRITIONARY_BUDGETS:
        result.append(
            {
                "type": "Descritionary Budget",
                "message": f"Your budgets have {len(INCLUDED_DESCRITIONARY_BUDGETS)} descritionary budgets like {','.join(INCLUDED_DESCRITIONARY_BUDGETS)}.Please reduce the expense for these budgets to save the expense for other budgets",
            }
        )
    return result


def get_saving_suggestion_from_usage_of_inactive_budgets(user):
    # Get the budgets that are inactive
    Budgets = (
        get_budget_of_user(user)
        .filter(is_active=False)
        .values("budget_field")
        .annotate(
            total_spent=Sum("budget_expenses__expense_amount"),
            total_budget_amount=Sum("budget_amount"),
        )
    )
    categories_details = []
    result = []
    for b in Budgets:
        total_spent = b["total_spent"] or 0
        budget_amount = b["total_budget_amount"]
        # Get the budget category that are mostly overspent from the inactive ones
        spent_percentage = (total_spent / budget_amount) * 100
        categories_details.append(
            {"budget_field": b["budget_field"], "spent_percentage": spent_percentage}
        )
    if not categories_details:
        return None
    sorted_categories = sorted(
        categories_details, key=lambda item: item["spent_percentage"]
    )  # Ascending
    low_spent_category = sorted_categories[0]
    other_categories = [item["budget_field"] for item in sorted_categories[1:]]
    result.append(
        {
            "type": "Saving on less spent category",
            "message": (
                f"From your previous inactive budgets.The least spent budget was {low_spent_category["budget_field"]} with spent percentage of {low_spent_category["spent_percentage"]}."
                f"Please reduce the budget_amount for this category and take care of other categories like "
                f"{','.join(other_categories)} which were spent more than the lowest one"
            ),
        }
    )
    return result
