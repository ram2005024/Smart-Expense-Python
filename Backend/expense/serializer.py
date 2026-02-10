from rest_framework import serializers
from . import models
from authentication.serializer import UserSerializer

# Expense serializer
class ExpenseSerializer(serializers.ModelSerializer):
    budget=serializers.SerializerMethodField(read_only=True)
    user=UserSerializer(read_only=True)
    budget_id=serializers.PrimaryKeyRelatedField(
        queryset=models.Budget.objects.all(),
        source='budget',
        write_only=True
    )
    def get_budget(self,obj):
        return {
            "id":obj.budget.id,
            "budget_name":obj.budget.budget_name,
            "budget_limit":obj.budget.budget_limit,
            "budget_field":obj.budget.budget_field,
            "budget_amount":obj.budget.budget_amount,
            
        }
    class Meta:
        model=models.Expense
        fields="__all__"
    
# Budget serializer
class BudgetSerailizer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    budget_expenses=ExpenseSerializer(many=True, read_only=True)
    class Meta:
        model=models.Budget
        fields="__all__"
