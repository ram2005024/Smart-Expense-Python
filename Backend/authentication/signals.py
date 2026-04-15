from django.db.models.signals import post_delete, post_save
from django.dispatch import receiver
from expense.models import Budget, Expense
from ai.services.overview.get_health_score import get_health_score


@receiver([post_delete, post_save], sender=Budget)
@receiver([post_delete, post_save], sender=Expense)
def update_health_score(sender, instance, **kwargs):
    user = instance.user
    score = get_health_score(user)["health_score"]
    user.health_score = score
    user.save(update_fields=["health_score"])
