from django.db import models
import datetime
class BudgetManager(models.Manager):
    def get_queryset(self):
        today=datetime.date.today()
        queryset = super().get_queryset()
        queryset.filter(valid_until__lt=today,is_active=True).update(is_active=False)
        return queryset