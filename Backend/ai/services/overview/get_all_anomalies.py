from expense.models import Expense
import requests
from main.settings import FAST_API


# Get all the anomalies
def get_all_anomalies(request, date_str):
    # Retrive all the expense data of the current month
    expense_data = Expense.objects.filter(
        created_at__year=date_str.year,
        created_at__month=date_str.month,
        user=request.user,
    )
    data = [
        {
            "id": e.id,
            "expense_name": e.expense_name,
            "expense_category": e.expense_category,
            "created_at": e.created_at.isoformat(),
            "expense_amount": e.expense_amount,
        }
        for e in expense_data
    ]
    payload = {"user_id": request.user.id, "data": data}
    try:
        response = requests.post(FAST_API + "expense/anomaly_detection", json=payload)
        return response.json()
    except RuntimeError:
        return {"error": "Service is unavailable"}
