from datetime import timedelta
from django.db import models
from django.contrib.auth import get_user_model
from django.utils import timezone

# Create your models here.
User = get_user_model()


class OverviewModel(models.Model):
    anomalies = models.JSONField(blank=True, null=True)
    forecasts = models.JSONField(blank=True, null=True)

    total_spent = models.JSONField(blank=True, null=True)
    total_saving = models.JSONField(blank=True, null=True)
    health_score = models.JSONField(blank=True, null=True)
    budget_count_list = models.JSONField(blank=True, null=True)
    warnings = models.JSONField(blank=True, null=True)
    tips = models.JSONField(blank=True, null=True)
    spend_trend = models.JSONField(blank=True, null=True)
    is_refreshed = models.BooleanField(default=False)
    updated_on = models.DateTimeField(auto_now=True)
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="user_overview"
    )
    prediction_count = models.IntegerField(null=True, blank=True)
    data_points = models.FloatField(null=True, default=0, blank=True)
    accuracy_percentage = models.IntegerField(null=True, blank=True)

    def __str__(self):
        return f"Overview of {self.user.username}"


# ShareOverview link model
class ShareLink(models.Model):
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="user_sharelink"
    )
    token = models.CharField(max_length=100, null=False, blank=False)
    expires_at = models.DateTimeField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"User {self.user.username} overview link"

    def save(self, *args, **kwargs):
        #    Check if the user has the expiry date or not
        if not self.expires_at:
            self.expires_at = timezone.now() + timedelta(hours=24)

        super().save(*args, **kwargs)
