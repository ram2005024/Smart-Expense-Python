from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from expense.models import Budget, Expense
from rest_framework.response import Response
import datetime
from ai.services.overview.get_active_budgets import get_active_budgets
from ai.services.overview.get_all_warnings import get_warning
from ai.services.overview.get_forecasts import get_forcast
from .services.convert_date_to_str import convertDateToStr
from .services.overview.get_all_anomalies import get_all_anomalies
from .services.overview.get_total_spent_savings import get_total_saving, get_total_spent
from .services.overview.get_health_score import get_health_score


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_overview(request):
    date = request.query_params.get("date")
    if not date:
        return Response(
            {"message": "Date field missing"}, status=status.HTTP_400_BAD_REQUEST
        )
    date_str = convertDateToStr(date)
    # Get the anomalies
    anomalies = get_all_anomalies(request._request, date_str)
    total_spent = get_total_spent(request._request, date_str)
    total_savings = get_total_saving(request._request, date_str)
    health_score = get_health_score(request.user, date_str)
    budget_count_list = get_active_budgets(request.user)
    warnings = get_warning(request.user)
    forecasts = get_forcast(request.user)
    return Response(
        {
            "anomalies": anomalies,
            "total_spent": total_spent,
            "total_saving": total_savings,
            "health_score": health_score,
            "budget_count_list": budget_count_list,
            "warnings": warnings,
            "forecasts": forecasts,
        },
        status=status.HTTP_200_OK,
    )
