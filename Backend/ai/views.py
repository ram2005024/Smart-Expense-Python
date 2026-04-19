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
from ai.services.overview.get_tips import get_tips
from ai.services.overview.get_spend_trend_forecast import get_spent_forecast_trend
from ai.services.chat_window.get_overspent_chat import get_overspent_chat
from ai.services.chat_window.get_next_month_spent_prediction import (
    get_next_month_spend_prediction,
)
from ai.services.chat_window.get_top_savings import get_top_savings
from ai.services.chat_window.compare_current_previous import (
    compare_previous_current_month_expense,
)
from ai.services.chat_window.sudden_jump_in_expense import get_sudden_jump_in_expense
from .services.convert_date_to_str import convertDateToStr
from .services.overview.get_all_anomalies import get_all_anomalies
from .services.overview.get_total_spent_savings import get_total_saving, get_total_spent
from .services.overview.get_health_score import get_health_score
from datetime import datetime


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_overview(request):
    date = request.query_params.get("date")
    if not date:
        return Response(
            {"message": "Date field missing"}, status=status.HTTP_400_BAD_REQUEST
        )
    date_str = convertDateToStr(date)
    current_date = datetime.now()
    if date_str > current_date:
        return Response(
            {"message": "You can't choose the future date.Please try again"},
            status=status.HTTP_400_BAD_REQUEST,
        )
    # Get the anomalies
    anomalies = get_all_anomalies(request._request, date_str)
    total_spent = get_total_spent(request._request, date_str)
    total_savings = get_total_saving(request._request, date_str)
    health_score = get_health_score(request.user, date_str)
    budget_count_list = get_active_budgets(request.user)
    warnings = get_warning(request.user)
    forecasts = get_forcast(request.user)
    tips = get_tips(request.user)
    spend_trend = get_spent_forecast_trend(request.user)
    return Response(
        {
            "anomalies": anomalies,
            "total_spent": total_spent,
            "total_saving": total_savings,
            "health_score": health_score,
            "budget_count_list": budget_count_list,
            "warnings": warnings,
            "forecasts": forecasts,
            "tips": tips,
            "spend_trend": spend_trend,
            "updated_on": datetime.now(),
        },
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_chat_response(request):
    query = request.POST.get("query") or ""
    if "overspend" in query:
        chat_response = get_overspent_chat(request.user)
        return Response(chat_response, status=status.HTTP_200_OK)
    if "prediction" in query:
        chat_response = get_next_month_spend_prediction(request.user)
        return Response(chat_response, status=status.HTTP_200_OK)
    if "saving" in query:
        chat_response = get_top_savings(request.user)
        return Response(chat_response, status=status.HTTP_200_OK)
    if "compare" in query:
        chat_response = compare_previous_current_month_expense(request.user)
        return Response(chat_response, status=status.HTTP_200_OK)
    if "suddenjump" or "jump" or "spike" in query:
        chat_response = get_sudden_jump_in_expense(request.user)
        return Response(chat_response, status=status.HTTP_200_OK)
    return Response(
        {"message": "Sorry the query request is invalid.Try again later"},
        status=status.HTTP_200_OK,
    )
