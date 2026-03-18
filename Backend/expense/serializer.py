import expense.models
from rest_framework import serializers
from . import models
from authentication.serializer import UserSerializer
from django.db.models import Sum
# Expense serializer
class ExpenseSerializer(serializers.ModelSerializer):
    budget=serializers.SerializerMethodField(read_only=True)
    user=UserSerializer(read_only=True)
    expense_image = serializers.ImageField(required=False,allow_null=True)
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
        fields = [
            "id",
            "expense_name",
            "expense_description",
            "expense_amount",
            "status",
            "expense_image",
            "created_at",
            "updated_at",
            "user",
            "budget",
            "budget_id",
            "expense_category"
        ]
        

        read_only_fields=["expense_category"]
    
    def validate(self, data):
        budget=data.get("budget") or getattr(self.instance,"budget",None)
        expense_amount=data.get("expense_amount",getattr(self.instance,"expense_amount",0))
        if not budget or not "expense_amount" in data:
            return data
        total_spent = budget.budget_expenses.aggregate(
            Sum("expense_amount")
        )["expense_amount__sum"] or 0

        if total_spent + expense_amount > budget.budget_amount:
            raise serializers.ValidationError({
                "inactive": ["You can't add as the budget amount exceeded"]
            })
        return data
 
    def create(self, validated_data):
        budget=validated_data["budget"]
        request=self.context.get("request")
        
        if budget:
            validated_data["user"]=request.user
            validated_data["expense_category"]=budget.budget_field
        return super().create(validated_data)
    
    def update(self, instance, validated_data):
        image=validated_data.get("expense_image")
        if image:
            validated_data["expense_image"]=image
        budget=validated_data.get("budget")
        if budget:
            instance.expense_category=budget.budget_field
        return super().update(instance, validated_data)
    def get_expense_image(self, obj):
        if obj.expense_image:
            return obj.expense_image.url
# Budget serializer
class BudgetSerailizer(serializers.ModelSerializer):
    user=UserSerializer(read_only=True)
    budget_expenses=ExpenseSerializer(many=True, read_only=True)
    class Meta:
        model=models.Budget
        fields=("budget_name","budget_expenses","user","id")
