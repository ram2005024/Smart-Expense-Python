from expense.selectors.budget_selector import get_budget_of_user
from django.db.models import Sum
from collections import defaultdict


def get_overspent_chat(user):
    overspent = []
    Budgets = (
        get_budget_of_user(user)
        .filter(is_active=True)
        .annotate(total_expense=Sum("budget_expenses__expense_amount"))
    )
    category_spend, budget_field = get_budget_category_spend(Budgets)
    over_spent_budget = {}
    for category, spent in category_spend.items():
        budget_amount = budget_field.get(category, 0)
        if budget_amount > 0 and spent > budget_amount:
            overspent_percentage = (spent / budget_amount) * 100
            over_spent_budget[category] = round(overspent_percentage, 2)
    if over_spent_budget:
        top_category, top_spent_percent = sorted(
            over_spent_budget.items(), key=lambda item: item[1], reverse=True
        )[0]
        overspent.append(
            {
                "type": "Overspent",
                "Overspent_budget_category": top_category,
                "spent_percentage": top_spent_percent,
                "message": f"Your budget of category {top_category} has  spent percentage of {top_spent_percent}.",
            }
        )
    message = " ".join([f"{r['type']}: {r['message']}" for r in overspent])
    return {
        "message": (
            message
            if overspent
            else "No overspending was detected in any budget. Keep it up, and best of luck maintaining this progress!"
        )
    }


# Extract the category of the budget along with their expense
def get_budget_category_spend(Budgets):
    category_spend = {}
    budget_total = {}
    for b in Budgets:
        category_spend[b.budget_field] = b.total_expense
        budget_total[b.budget_field] = b.budget_amount
    return category_spend, budget_total
