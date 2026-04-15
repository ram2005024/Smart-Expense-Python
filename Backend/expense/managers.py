from django.db import models
import datetime


class BudgetManager(models.Manager):
    def get_queryset(self):
        today = datetime.date.today()
        # deactivate expired budgets
        super().get_queryset().filter(valid_until__lt=today, is_active=True).update(
            is_active=False
        )
        # return queryset with updated states
        return super().get_queryset()
