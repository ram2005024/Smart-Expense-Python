from django.contrib import admin
from .models import Expense,Budget

# Register your models here.

# Model Admins
#For expense
class ExpenseAdmin(admin.ModelAdmin):
    list_display=['expense_name','user','expense_amount','expense_category','budget_field']
    def budget_field(self,obj):
        return obj.budget.budget_field
# For budget
class BudgetAdmin(admin.ModelAdmin):
    list_display=['budget_name','user','budget_field','budget_limit','budget_amount']
admin.site.register(Expense,ExpenseAdmin)
admin.site.register(Budget,BudgetAdmin)
