from django.urls import path, include
from expense.views import get_spend_by_categories, RetriveBudgetSpendPrediction
from . import views
from rest_framework.routers import DefaultRouter

router = DefaultRouter()
router.register(r"budgets", views.BudgetView, basename="budget")
router.register(r"expenses", views.ExpenseView, basename="expense")
urlpatterns = [
    path("", include(router.urls)),
    path(
        "expense/summarize_spend_categories",
        views.get_spend_by_categories,
        name="get_spend_by_categories",
    ),
    path(
        "expense/get_category_budget_usage",
        views.get_category_budget_usage,
        name="get_category_budget_usage",
    ),
    path(
        "ai/budget_insight/<str:pk>",
        views.BudgetRetrieve.as_view(),
        name="retrieve_budget",
    ),
    path(
        "ai/expense_insight",
        views.RetrieveUserExpense.as_view(),
        name="retrieve_user_expense",
    ),
    path("ai/expense_trend", views.get_expense_trend, name="get_expense_trend"),
    path("ai/expense_anomaly", views.get_expense_anomaly, name="get_expense_anomaly"),
    path(
        "ai/budget_spend_prediction/<str:pk>",
        RetriveBudgetSpendPrediction.as_view(),
        name="get_spend_prediction",
    ),
    path(
        "ai/expense/total_spent",
        views.get_total_spend_insight,
        name="total-spend-insight",
    ),
    path(
        "ai/expense/reimbrushed", views.analyse_reimbrushed, name="reimbrushed-insight"
    ),
    path("ai/expense/pending", views.analyse_pending, name="pending-insight"),
    path("ai/expense/decline", views.analyse_decline, name="declined-insight"),
]
