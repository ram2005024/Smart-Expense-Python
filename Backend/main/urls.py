from django.conf import settings
from django.conf.urls.static import static

from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    path("api/", include("authentication.urls")),
    path("api/", include("expense.urls")),
    path("api/budget/", include("budget.urls")),
    path("api/ai/", include("ai.urls")),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
