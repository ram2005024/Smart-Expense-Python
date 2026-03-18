import django_filters
from expense.models import Expense

# Expense filter

class ExpenseFilter(django_filters.FilterSet):
    # Custom filter fields
    start_date=django_filters.DateFilter(field_name="created_at",lookup_expr="gte")
    end_date=django_filters.DateFilter(field_name="created_at",lookup_expr="lte")
    min_amt=django_filters.NumberFilter(field_name="expense_amount",lookup_expr="gte")
    max_amt=django_filters.NumberFilter(field_name="expense_amount",lookup_expr="lte")

    # Default field
    statuses=django_filters.BaseInFilter(field_name="status",lookup_expr="in")
    categories=django_filters.BaseInFilter(field_name="expense_category",lookup_expr="in")

    class Meta:
        model=Expense
        fields=["statuses","categories"]
