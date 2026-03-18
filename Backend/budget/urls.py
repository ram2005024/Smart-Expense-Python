from django.urls import path,include
from rest_framework.routers import DefaultRouter
from budget.views import GetAllBudgets
from . import views
# Router for modelViewSet
router=DefaultRouter()
router.register(r'budgets',views.BudgetView,basename='budgets')

# URL Patterns
urlpatterns = [
    path("",include(router.urls)),
    path("get_all_budgets",GetAllBudgets.as_view(),name="list_all_budgets")
    # path("budget_health")
]
