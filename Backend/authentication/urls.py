from django.urls import path
from . import views
urlpatterns = [
    path('auth/register',views.RegisterView.as_view(),name="register"),
    path('auth/login',views.TokenObtainView.as_view(),name="login"),
    path('auth/token/refresh',views.MyTokenRefreshView.as_view(),name="refresh_token"),
]
