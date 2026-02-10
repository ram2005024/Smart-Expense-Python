from fastapi import APIRouter,Body
from typing import List
from collections import defaultdict
router=APIRouter()

@router.post("/expense/expense_insight")
def expense_insight(data: List[dict] = Body(...)):
    totalExpense=0
    for expense in data:
        totalExpense+=expense['expense_amount']
# Top category and amount
    expenseCategory=defaultdict(float)
    # Find the expense amount in each category
    for expense in data:
        expenseCategory[expense['expense_category']]+=expense['expense_amount']
    
    # Find the maximum category and amount
    top_category=max(expenseCategory,key=expenseCategory.get)
    top_category_amount=expenseCategory[top_category]
    
    # Find the budget whose expense in maxm
    top_budgets=[exp['budget'] for exp in data if exp['expense_category']==top_category]
    top_budget=max(top_budgets,key=lambda x : x['budget_amount'])
    # Find the highest expense
    
    top_expense=max(data,key=lambda x:x['expense_amount'])
    highest_expense=top_expense['expense_amount']
    highest_expense_on=top_expense['expense_category']

    # Ai Insights
    insights=[
        f"You have more expense on {highest_expense_on} which you created in {top_expense['created_at']} under the budget {top_expense['budget']['budget_name']} which is estimated {top_expense['budget']['budget_amount']}",
        f"You are spending a lot in {top_category} alloted {top_category_amount} please take care about this",
        f"You had maximum income on {top_expense['expense_name']} with Rs{highest_expense}",
        f"Please review the budget and expense wisely on {top_category}"
    ]

    return {
        "top_expense":top_expense,
        "top_category":top_category,
        "total_expense":totalExpense,
        "top_budget":top_budget,
        "insights":insights,
        "highest_expense":highest_expense,
        "highest_expense_on":highest_expense_on,
    }
    
    