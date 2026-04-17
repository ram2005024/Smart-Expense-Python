from django.urls import path
from . import views

urlpatterns = [
    path("overview", views.get_overview, name="get_overview"),
    path("chat", views.get_chat_response, name="get_overview"),
]
