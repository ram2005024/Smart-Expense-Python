import datetime
from rest_framework import serializers
from expense.models import Budget
from django.db.models import Sum
from expense.serializer import ExpenseSerializer
# Budget serializer

class BudgetSerializer(serializers.ModelSerializer):
    transactions=serializers.SerializerMethodField()
    remaining=serializers.SerializerMethodField()
    total_spent=serializers.SerializerMethodField()
    usage_percentage=serializers.SerializerMethodField()
    budget_status=serializers.SerializerMethodField()
    is_active=serializers.SerializerMethodField()
    # budget_expenses=ExpenseSerializer(many=True,read_only=True)
    
    
    
    class Meta:
        model=Budget
        fields=[
            "budget_name",
            "budget_limit",
            "budget_field",
            "is_active",
            "budget_amount",
            "created_at",
            "updated_at",
            "valid_until",
            "id",
            # "budget_expenses",
            "total_spent",
            "remaining",
            "transactions",
            "usage_percentage",
            "budget_status"
        ]

    # GET custom field
    def get_transactions(self,obj):
        return obj.budget_expenses.count()
    
    def get_total_spent(self,obj):
        return obj.budget_expenses.aggregate(
            total=Sum("expense_amount")
        )["total"] or 0
    def get_remaining(self,obj):
        total_spent=self.get_total_spent(obj)
        return 0 if obj.budget_amount-total_spent<0 else obj.budget_amount-total_spent
    
    def get_usage_percentage(self,obj):
        total_spent=self.get_total_spent(obj)
        return round((total_spent/obj.budget_amount)*100,2)
    
    def get_budget_status(self,obj):
        budget_usage_percentage=self.get_usage_percentage(obj)
         # Budget Status
        budget_status=""
        if budget_usage_percentage < 50:
            budget_status="On track"
        elif budget_usage_percentage>=50 and budget_usage_percentage <100:
            budget_status="Near limit"
        else:
            budget_status="⚠️ Over budget"
            
        return budget_status
    
    def get_is_active(self,obj):
        today=datetime.date.today()
        return obj.valid_until and today<obj.valid_until
        