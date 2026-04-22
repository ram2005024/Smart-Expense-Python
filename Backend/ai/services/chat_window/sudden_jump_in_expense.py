from expense.selectors.budget_selector import (
    get_group_budget_with_expense_month_category,
)


def get_sudden_jump_in_expense(user):
    # Get the budget by grouping the month of expense,category
    budgets = get_group_budget_with_expense_month_category(user)

    categories_details = {}
    for b in budgets:
        if b["budget_field"] not in categories_details:
            categories_details[b["budget_field"]] = []
        categories_details[b["budget_field"]].append(
            {"month": b["month"], "total_spent": b["total_spent"]}
        )
    category_spikes = []
    for category, records in categories_details.items():
        if len(records) < 2:
            continue
        sorted_records = sorted(records, key=lambda item: item["month"], reverse=True)
        latest_spent = sorted_records[0]["total_spent"]
        # Find the average spent
        avg_spent = sum([r["total_spent"] for r in sorted_records[1:]]) / len(
            sorted_records[1:]
        )
        if avg_spent > 0 and latest_spent > avg_spent * 1.5:
            spike_percentage = ((latest_spent / avg_spent) - 1) * 100
            category_spikes.append(
                {
                    "type": "Sudden spike",
                    "message": (
                        f"Based on the previous month expenses for category {category}."
                        f"There is sudden increase in expense this month by {round(spike_percentage,2)}%"
                    ),
                }
            )
            message = " ".join(
                [f"{r['type']}: {r['message']}" for r in category_spikes]
            )
    return {
        "message": message if category_spikes else "No sudden jump in expenses detected"
    }
