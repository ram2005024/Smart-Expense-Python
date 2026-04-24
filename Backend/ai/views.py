from django.contrib.auth import get_user_model
from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from django.db.models import Sum
from django.conf import settings
import uuid
from django.utils import timezone
from datetime import timedelta
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
from ai.serializers import OverviewSerializer
from ai.services.overview.get_data_points import get_data_points
from ai.anomalies.get_filter_anomalies import get_filter_anomalies
from .services.convert_date_to_str import convertDateToStr
from .services.overview.get_all_anomalies import get_all_anomalies
from .services.overview.get_total_spent_savings import get_total_saving, get_total_spent
from .services.overview.get_health_score import get_health_score
from datetime import datetime
from .models import AnomalyState, OverviewModel, ShareLink, User


@api_view(["GET"])
@permission_classes([IsAuthenticated])
def get_overview(request):
    date = request.query_params.get("date")
    refresh = request.query_params.get("refresh")
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
    data_points = get_data_points(request.user)
    spend_trend = get_spent_forecast_trend(request.user)
    # Filter the anomalies before sending to the client
    filtered_anomaly = get_filter_anomalies(anomalies=anomalies, user=request.user)
    # Put in the model after getting the reponse
    overview_model, created = OverviewModel.objects.get_or_create(user=request.user)
    if overview_model.is_refreshed and not refresh:
        serializer = OverviewSerializer(overview_model)
        return Response(serializer.data, status=status.HTTP_200_OK)
    # If its not refresh then provide the new values
    overview_model.anomalies = filtered_anomaly
    overview_model.total_spent = total_spent
    overview_model.total_saving = total_savings
    overview_model.health_score = health_score
    overview_model.budget_count_list = budget_count_list
    overview_model.warnings = warnings
    overview_model.forecasts = forecasts
    overview_model.tips = tips
    overview_model.spend_trend = spend_trend
    overview_model.is_refreshed = True
    overview_model.data_points = data_points
    overview_model.save()
    serializer = OverviewSerializer(overview_model)
    return Response(
        serializer.data,
        status=status.HTTP_200_OK,
    )


@api_view(["POST"])
@permission_classes([IsAuthenticated])
def get_chat_response(request):
    query = request.data.get("query").lower() or ""
    if any(word in query for word in ["hi", "hello", "hlw", "hey"]):
        return Response(
            {
                "message": f"Hey {request.user.username.capitalize()}!.Lets enroll with us to track your daily expense.I am your AI assistant created by Cyrus Smart Expense Tracker😁"
            },
            status=status.HTTP_200_OK,
        )
    if "overspend" in query:
        chat_response = get_overspent_chat(request.user)
        return Response(chat_response, status=status.HTTP_200_OK)
    if "predict" in query:
        chat_response = get_next_month_spend_prediction(request.user)
        return Response(chat_response, status=status.HTTP_200_OK)
    if "saving" in query:
        chat_response = get_top_savings(request.user)
        return Response(chat_response, status=status.HTTP_200_OK)
    if "compare" in query:
        chat_response = compare_previous_current_month_expense(request.user)
        return Response(chat_response, status=status.HTTP_200_OK)
    if any(word in query for word in ["jump", "sudden", "sudden jump", "spike"]):
        chat_response = get_sudden_jump_in_expense(request.user)
        return Response(chat_response, status=status.HTTP_200_OK)
    return Response(
        {"message": "Sorry the query request is invalid.Try again later"},
        status=status.HTTP_400_BAD_REQUEST,
    )


# Get the share link
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def generate_share_link(request):
    token = str(uuid.uuid4())
    # Make the token
    share_link, created = ShareLink.objects.get_or_create(user=request.user)
    if created:
        share_link.token = token
        share_link.save()
        return Response(
            {
                "share_link"
                f"{settings.FRONTEND_URL}/share/overview/{share_link.user.id}?token={token}"
            },
            status=status.HTTP_200_OK,
        )
    # Generate the new expiry date on updating the token
    share_link.token = token
    share_link.expires_at = timezone.now() + timedelta(hours=24)
    share_link.save()
    return Response(
        {
            "share_link": f"{settings.FRONTEND_URL}/share/overview/{share_link.user.id}?token={token}"
        },
        status=status.HTTP_200_OK,
    )


# Verify the share-link
@api_view(["POST"])
@permission_classes([IsAuthenticated])
def verify_share_link(request, user_id):
    token = request.data.get("token")
    User = get_user_model()
    try:
        user = User.objects.get(id=user_id)
    except User.DoesNotExist:
        return Response(
            {"message": "Share link user doesn't exist"},
            status=status.HTTP_404_NOT_FOUND,
        )
    # Get the share_link of the user
    try:
        share_link = ShareLink.objects.get(user=user)
    except ShareLink.DoesNotExist:
        return Response(
            {"message": "Share link of user doesn't exist"},
            status=status.HTTP_404_NOT_FOUND,
        )
    is_Matched = share_link.token == token
    if not is_Matched:
        return Response({"message": "Token mismatched"})
    # Check the expiry date of the token
    current_date = timezone.now()
    isExpired = current_date > share_link.expires_at
    if isExpired:
        return Response(
            {
                "message": "Token expired",
            },
            status=status.HTTP_404_NOT_FOUND,
        )
        # Get the overview of the user and send the response
    overview = OverviewModel.objects.get(user=user)
    serializer = OverviewSerializer(overview)
    return Response(
        {"message": "Successfully verified", "overview": serializer.data},
        status=status.HTTP_200_OK,
    )


# View to mark safe for any anomaly
@api_view(["GET"])
@permission_classes([IsAuthenticated])
def mark_safe(request, reference_id):
    overview = OverviewModel.objects.get(user=request.user)
    AnomalyState.objects.filter(user=request.user, reference_id=reference_id).update(
        mark_safe=True
    )
    user_anomalies = overview.anomalies
    filtered = get_filter_anomalies(user_anomalies, request.user)
    overview.anomalies = filtered
    overview.save()
    serializer = OverviewSerializer(overview)
    return Response({"message": "Marked safe", "overview": serializer.data})
