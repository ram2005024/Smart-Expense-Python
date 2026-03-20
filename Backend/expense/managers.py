from django.db import models
import datetime


class BudgetManager(models.Manager):
    def get_queryset(self):
        return super().get_queryset()
