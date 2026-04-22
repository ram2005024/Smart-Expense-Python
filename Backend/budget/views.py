import datetime
import requests
from rest_framework.permissions import IsAuthenticated
from rest_framework.viewsets import ModelViewSet
from .serializer import BudgetSerializer
from django.db.models.functions import Coalesce
from requests.exceptions import RequestException
from budget.pagination import BudgetPagination
from expense.models import Budget, Expense, category, budget_type_cat
from rest_framework import generics
from django.db.models import Sum, Count, FloatField
from django.conf import settings
from rest_framework.response import Response
from rest_framework import status
from rest_framework.decorators import action


# Create budget viewset
class BudgetView(ModelViewSet):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]
    pagination_class = BudgetPagination
    queryset = Budget.objects.all()

    # Before saving into the database
    def perform_create(self, serializer):
        serializer.save(user=self.request.user)

    # Get all the budgets of related user
    def get_queryset(self):
        budgets = Budget.objects.filter(user=self.request.user, is_active=True)
        return budgets

    # action to get total_spent insight
    @action(detail=False, methods=["GET"])
    def budget_insight(self, request):
        limit = request.GET.get("limit")
        budgets = (
            self.get_queryset()
            .filter(budget_limit=limit)
            .annotate(total_expense=Sum("budget_expenses__expense_amount"))
        )
        total_spent = 0
        for budget in budgets:
            total_spent += budget.total_expense or 0

        # Budget total
        budget = budgets.aggregate(
            budget_total=Sum("budget_amount"),
            budget_total_categories=Count("budget_limit"),
        )
        budget_total = budget["budget_total"] or 0
        budget_category = budget["budget_total_categories"] or 0
        try:
            budget_usage_percentage = total_spent / budget_total * 100
        except ZeroDivisionError:
            budget_usage_percentage = 0
        # Remaining
        remaining = budget_total - total_spent
        # Trend
        trend = ""
        if budget_usage_percentage > 50:
            trend = "Up"
        elif budget_usage_percentage > 0 and budget_usage_percentage < 50:
            trend = "Down"
        else:
            trend = "stable"

        # For overbudget
        overbudget = sum(1 for b in budgets if (b.total_expense or 0) > b.budget_amount)

        return Response(
            {
                "total_spent": round(total_spent, 2),
                "budget_usage_percentage": round(budget_usage_percentage, 2),
                "trend": trend,
                "remaining": remaining,
                "budget_total": budget_total,
                "budget_category_total": budget_category,
                "overbudget": overbudget,
            },
            status=status.HTTP_200_OK,
        )

    def list(self, request, *args, **kwargs):
        limit = request.GET.get("limit")
        budgets = Budget.objects.filter(
            budget_limit=limit,
            user=request.user,
        )
        return Response(
            self.get_serializer(budgets, many=True).data, status=status.HTTP_200_OK
        )

    # Update the budget while reallocated
    @action(detail=True, methods=["PATCH"])
    def update_budget_for_reallocation(self, request, pk=None):
        reallocated_amount = request.data.get("reallocated_amount")
        new_budget_limit = request.data.get("new_budget_limit")
        reallocated_budget_id = request.data.get("reallocated_id")
        toUpdateBudget = self.get_object()
        # If reallocation data is passed
        if int(reallocated_amount) > 0 and reallocated_budget_id:
            # If budget exists or not
            try:
                source = Budget.objects.get(pk=reallocated_budget_id)
            except Budget.DoesNotExist:
                return Response(
                    {"message": "Budget category doesn't exist"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
            # Check if the budget has available fund or not
            if self.get_serializer(source).data["remaining"] >= float(
                reallocated_amount
            ):
                total_amount = float(new_budget_limit) + float(reallocated_amount)
                # Substract the fund from source
                source.budget_amount -= float(reallocated_amount)
                source.save()
                toUpdateBudget.budget_amount = total_amount
                toUpdateBudget.save()
                return Response(
                    {"message": "Updated successfully"}, status=status.HTTP_200_OK
                )
            else:
                return Response(
                    {"message": "Source category hasn't enough fund to reallocate"},
                    status=status.HTTP_400_BAD_REQUEST,
                )
        # If no reallocation only add the budget amount in the destination budget
        toUpdateBudget.budget_amount = float(new_budget_limit)
        toUpdateBudget.save()
        return Response({"message": "Updated successfully"}, status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"])
    def get_budget_health(self, request):
        budgets = (
            self.get_queryset()
            .filter(budget_limit=request.GET.get("limit"))
            .annotate(
                total_expense=Coalesce(
                    Sum("budget_expenses__expense_amount"), 0, output_field=FloatField()
                )
            )
        )

        aggregate_datas = budgets.aggregate(
            total_budget=Coalesce(Sum("budget_amount"), 0, output_field=FloatField()),
            total_spent=Coalesce(Sum("total_expense"), 0, output_field=FloatField()),
        )

        total_spent = aggregate_datas["total_spent"]
        total_amount = aggregate_datas["total_budget"]
        usage_percentage = (
            round((total_spent / total_amount) * 100, 2) if total_amount > 0 else 0
        )

        on_track = 0
        near_limit = 0
        over_budget = 0

        for budget in budgets:
            total = budget.budget_amount
            spent = budget.total_expense
            upct = (spent / total) * 100 if total > 0 else 0
            if budget.total_expense > budget.budget_amount:
                over_budget += 1

            elif upct < 85:
                on_track += 1
            else:
                near_limit += 1

        return Response(
            {
                "usage_percentage": usage_percentage,
                "status": "red" if over_budget > 0 else "green",
                "message": (
                    f"{over_budget} categories exceeded.Review needed"
                    if over_budget > 0
                    else "All good"
                ),
                "over_budget": over_budget,
                "near_limit": near_limit,
                "on_track": on_track,
            },
            status=status.HTTP_200_OK,
        )

        # Monthly spend analytics

    @action(detail=False, methods=["GET"])
    def monthly_spend_analytics(self, request):
        all_expenses = list(
            Expense.objects.filter(user=request.user).values(
                "expense_amount", "budget_id", "created_at"
            )
        )
        formatted_values = [
            {
                "expense_amount": e["expense_amount"],
                "month": e["created_at"].strftime("%b"),
            }
            for e in all_expenses
        ]
        try:
            response = requests.post(
                settings.FAST_API + "budget/budgetSpend", json=formatted_values
            )
            response.raise_for_status()
        except RequestException as e:
            return Response(
                {"message": f"Something went wrong {str(e)}"},
                status=status.HTTP_400_BAD_REQUEST,
            )
        return Response(response.json(), status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"])
    def get_top_spend(self, request):
        # Get all the expense of the user
        budgets = list(
            self.get_queryset()
            .filter(is_active=True)
            .annotate(
                total_expense=Coalesce(
                    Sum("budget_expenses__expense_amount"), 0, output_field=FloatField()
                )
            )
        )
        formatted = [
            {
                "valid_until": budget.valid_until,
                "budget_category": budget.budget_field,
                "budget_name": budget.budget_name,
                "budget_spent": budget.total_expense,
                "budget_amount": budget.budget_amount,
                "usage_percentage": round(
                    budget.total_expense * 100 / budget.budget_amount, 2
                ),
            }
            for budget in budgets
        ]
        return Response(formatted, status=status.HTTP_200_OK)

    @action(detail=False, methods=["GET"])
    def get_budget_categories_and_type(self, request):
        categories = [{"code": code, "label": label} for code, label in category]
        types = [{"code": code, "label": lable} for code, lable in budget_type_cat]
        return Response(
            {"categories": categories, "type": types}, status=status.HTTP_200_OK
        )


class GetAllBudgets(generics.ListAPIView):
    serializer_class = BudgetSerializer
    permission_classes = [IsAuthenticated]

    def get_queryset(self):
        today = datetime.date.today()
        return Budget.objects.filter(user=self.request.user, valid_until__gt=today)
