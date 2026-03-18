from rest_framework.pagination import PageNumberPagination 
from expense.models import Budget
class BudgetPagination(PageNumberPagination):
    page_size=10
    page_size_query_param="page_size"
    max_page_size=20
    