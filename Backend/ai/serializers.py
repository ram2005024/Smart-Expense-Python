from rest_framework import serializers
from ai.models import OverviewModel
from authentication.serializer import UserSerializer


class OverviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)

    class Meta:
        model = OverviewModel
        fields = [
            "anomalies",
            "total_spent",
            "total_saving",
            "health_score",
            "budget_count_list",
            "warnings",
            "tips",
            "spend_trend",
            "updated_on",
            "is_refreshed",
            "user",
        ]
