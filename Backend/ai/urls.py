from django.urls import path
from . import views

urlpatterns = [
    path("overview", views.get_overview, name="get_overview"),
    path("chat", views.get_chat_response, name="get_overview"),
    path("generate_share_link", views.generate_share_link, name="generate_share_link"),
    path(
        "verify_share_link/<str:user_id>",
        views.verify_share_link,
        name="verify_share_link",
    ),
    path(
        "anomaly/mark-unsafe/<str:reference_id>",
        views.mark_safe,
        name="anomaly-mark-safe",
    ),
]
