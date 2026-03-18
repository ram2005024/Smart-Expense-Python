from django.contrib import admin
from .models import Expense,Budget

# Register your models here.

# Model Admins
#For expense
class ExpenseAdmin(admin.ModelAdmin):

    readonly_fields=['expense_category']
    list_display=['expense_name',]
# For budget
class BudgetAdmin(admin.ModelAdmin):
    list_display=['budget_name','user','budget_field','budget_limit','budget_amount']
admin.site.register(Expense,ExpenseAdmin)
admin.site.register(Budget,BudgetAdmin)
