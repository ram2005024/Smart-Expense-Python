from django.urls import path,include
from expense.views import get_expense_trend, RetrieveUserExpense
from . import views
from rest_framework.routers import DefaultRouter
router=DefaultRouter()
router.register(r'budgets',views.BudgetView,basename='budget')
router.register(r'expenses',views.ExpenseView,basename='expense')
urlpatterns = [
    path('',include(router.urls)),
    path('ai/budget_insight/<str:pk>',views.BudgetRetrieve.as_view(),name="retrieve_budget"),
    path('ai/expense_insight',views.RetrieveUserExpense.as_view(),name="retrieve_user_expense"),
    path('ai/expense_trend',views.get_expense_trend,name="get_expense_trend")
]
