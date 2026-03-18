from pydantic import BaseModel

# Budget monthly spend analytics
class BudgetSpend(BaseModel):
    expense_amount:float
    month:str