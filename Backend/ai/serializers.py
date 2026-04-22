from rest_framework import serializers
from ai.models import OverviewModel
from authentication.serializer import UserSerializer


class OverviewSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    prediction_count = serializers.SerializerMethodField()
    accuracy_count = serializers.SerializerMethodField()

    class Meta:
        model = OverviewModel
        fields = [
            "anomalies",
            "total_spent",
            "total_saving",
            "forecasts",
            "health_score",
            "budget_count_list",
            "warnings",
            "tips",
            "spend_trend",
            "updated_on",
            "is_refreshed",
            "user",
            "data_points",
            "prediction_count",
            "accuracy_count",
        ]

    def get_prediction_count(self, obj):
        length_temporal = len(obj.anomalies.get("temporal", []))
        length_spikes = len(obj.anomalies.get("spike", []))
        length_duplication = len(obj.anomalies.get("duplication", []))
        length_recurring = len(obj.anomalies.get("recurring", []))
        return length_temporal + length_spikes + length_recurring + length_duplication

    def get_accuracy_count(self, obj):
        trend = obj.spend_trend or []
        total = 0
        correct = 0

        for entry in trend:
            actual = entry.get("actual_spend")
            predicted = entry.get("predicted_spent")

            # Only evaluate past months where actual_spend exists
            if actual is not None and predicted is not None and actual > 0:
                total += 1
                # Example: consider prediction "accurate" if within 10% margin
                if abs(predicted - actual) / actual <= 0.1:
                    correct += 1

        if total == 0:
            return "0%"
        return f"{round((correct / total) * 100)}%"
