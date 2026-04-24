from django.contrib import admin
from ai.models import AnomalyState, OverviewModel, ShareLink

# Register your models here.
admin.site.register(OverviewModel)
admin.site.register(ShareLink)
admin.site.register(AnomalyState)
