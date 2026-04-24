from ai.anomalies.get_reference_id import get_reference_id
from ai.models import AnomalyState


def get_filter_anomalies(anomalies, user):
    filtered = {}
    for anomaly_type, items in anomalies.items():
        filtered[anomaly_type] = []
        for item in items:
            isMarked = AnomalyState.objects.filter(
                user=user, reference_id=item["reference_id"], mark_safe=True
            ).exists()
            if not isMarked:
                filtered[anomaly_type].append(item)
    return filtered
