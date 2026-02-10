from django.db import models
import os
import uuid
from django.core.validators import MinValueValidator,MaxValueValidator
from authentication.models import CustomUser
from django.core.exceptions import ValidationError
# Create your models here.
category=(
    ('FOOD','Food Expense'),
    ('PERSONAL','Personal Expense'),
    ('TRIP','Trip Expense'),
    ('CLOTHS','Cloths Expense'),
    ('OTHERS','Others'),
    ('GROCERY','Grocery Expenses'),
)
# Budget model
# Budget category
budget_type_cat=(
    ('MONTHLY','Monthly Budget'),
    ('WEEKLY','Weekly Budget'),
    ('YEARLY','Yearly Budget'),
    ('SEMI YEARLY','Semi Yearly Budget'),
    ('DAY','Day Budget'),
)
class Budget(models.Model):
    # Timestamps
    created_at=models.DateTimeField(auto_now=True,null=True)
    updated_at=models.DateTimeField(auto_now_add=True,null=True)
    id=models.CharField(primary_key=True,default=uuid.uuid4)
    budget_name=models.CharField(max_length=100,blank=True,null=True)
    budget_limit=models.CharField(choices=budget_type_cat,null=False,max_length=200)
    budget_field=models.CharField(choices=category,null=False,max_length=200)
    active_budget=models.BooleanField(default=True)
    budget_amount=models.FloatField(
        validators=[
            MinValueValidator(0.0),
            MaxValueValidator(10000000.0)
        ]
    )
    user=models.ForeignKey(CustomUser,related_name='user_budgets',on_delete=models.CASCADE)

    def __str__(self):
        return f"User {self.user.username} {self.budget_name} budget"

#Expense Model
def upload_user_expense_image(instance,filename):
    return os.path.join('expense_image',str(instance.user.id),filename)
    
class Expense(models.Model):
    id=models.CharField(primary_key=True,default=uuid.uuid4)
    expense_name=models.CharField(null=False,blank=False,max_length=250)
    user=models.ForeignKey(CustomUser,related_name='user_expenses',on_delete=models.CASCADE)
    expense_description=models.TextField()
    budget=models.ForeignKey(Budget,related_name='budget_expenses',on_delete=models.CASCADE)
    expense_amount=models.FloatField(validators=[MinValueValidator(0.0)])
    expense_category=models.CharField(max_length=50,choices=category,null=False,blank=False)
    expense_image=models.ImageField(upload_to=upload_user_expense_image,null=True,blank=True)
    created_at=models.DateTimeField(auto_now_add=True)
    updated_at=models.DateTimeField(auto_now=True)
    
    def __str__(self):
        return f"User {self.user.id} expense"
    
    def clean(self):
        if not self.budget.active_budget:
            raise ValidationError("You can't add the expense to inactive budget.")
