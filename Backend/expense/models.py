import datetime
from django.db import models
import os
from django.utils import timezone
import uuid
import cloudinary
import cloudinary.uploader
import cloudinary.models
from django.core.validators import MinValueValidator, MaxValueValidator
from authentication.models import CustomUser
from django.core.exceptions import ValidationError
from expense.managers import BudgetManager

# Create your models here.
category = (
    ("FOOD", "Food Expense"),
    ("PERSONAL", "Personal Expense"),
    ("TRIP", "Trip Expense"),
    ("CLOTHS", "Cloths Expense"),
    ("OTHERS", "Others"),
    ("GROCERY", "Grocery Expenses"),
    ("STUDY", "Study Expenses"),
)
# Budget model
# Budget category
budget_type_cat = (
    ("MONTHLY", "Monthly Budget"),
    ("WEEKLY", "Weekly Budget"),
    ("YEARLY", "Yearly Budget"),
    ("SEMI YEARLY", "Semi Yearly Budget"),
    ("DAY", "Day Budget"),
)


class Budget(models.Model):
    # Timestamps
    created_at = models.DateTimeField(auto_now=True, null=True)
    updated_at = models.DateTimeField(auto_now_add=True, null=True)
    id = models.CharField(primary_key=True, default=uuid.uuid4)
    budget_name = models.CharField(max_length=100, blank=True, null=True)
    budget_limit = models.CharField(choices=budget_type_cat, null=False, max_length=200)
    budget_field = models.CharField(choices=category, null=False, max_length=200)
    is_active = models.BooleanField(default=True)
    budget_amount = models.FloatField(
        validators=[MinValueValidator(0.0), MaxValueValidator(10000000.0)]
    )
    user = models.ForeignKey(
        CustomUser, related_name="user_budgets", on_delete=models.CASCADE
    )
    valid_until = models.DateField(null=True, blank=True)
    objects = BudgetManager()

    # Before saving check the bugdet is active or not
    def save(self, *args, **kwargs):
        if not self.valid_until:
            today = datetime.date.today()
            if self.budget_limit == "MONTHLY":
                self.valid_until = today + datetime.timedelta(days=30)
            elif self.budget_limit == "WEEKLY":
                self.valid_until = today + datetime.timedelta(days=7)

            elif self.budget_limit == "SEMI YEARLY":
                self.valid_until = today + datetime.timedelta(days=182)

            elif self.budget_limit == "YEARLY":
                self.valid_until = today + datetime.timedelta(days=365)
            else:
                self.valid_until = today + datetime.timedelta(days=1)

        if self.valid_until and datetime.date.today() > self.valid_until:
            self.is_active = False
        super().save(*args, **kwargs)

    @property
    def active_budget(self):
        # First check that the budget validity is correct or not
        today = datetime.date.today()
        if self.valid_until and today > self.valid_until:
            return False

        # Check if the expense amount has exceeded the budget or not
        total_spent = (
            self.budget_expenses.aggregate(models.Sum("expense_amount"))[
                "expense_amount__sum"
            ]
            or 0
        )
        return total_spent < self.budget_amount

    def __str__(self):
        return f"User {self.user.username} {self.budget_name} budget"


# Expense Model
def upload_user_expense_image(instance, filename):
    return os.path.join("expense_image", str(instance.user.id), filename)


expense_status = (
    ("PAID", "Paid"),
    ("PENDING", "Pending"),
    ("DECLINED", "Declined"),
    ("REIMBRUSHED", "Reimbrushed"),
)


class Expense(models.Model):
    id = models.CharField(primary_key=True, default=uuid.uuid4)
    expense_name = models.CharField(null=False, blank=False, max_length=250)
    user = models.ForeignKey(
        CustomUser, related_name="user_expenses", on_delete=models.CASCADE
    )
    expense_description = models.TextField()
    budget = models.ForeignKey(
        Budget, related_name="budget_expenses", on_delete=models.CASCADE
    )
    expense_amount = models.FloatField(validators=[MinValueValidator(0.0)])
    status = models.CharField(
        max_length=50, choices=expense_status, null=False, blank=False
    )
    expense_category = models.CharField(
        max_length=50, choices=category, null=False, blank=False
    )
    expense_image = cloudinary.models.CloudinaryField(
        "image", folder="expense_images", blank=True, null=True
    )
    created_at = models.DateTimeField(default=timezone.now())
    updated_at = models.DateTimeField(default=timezone.now())

    def __str__(self):
        return f"User {self.user.id} expense"

    def clean(self):
        if self.budget:
            self.expense_category = self.budget.budget_field

        if not self.budget.active_budget:
            raise ValidationError("You can't add the expense to inactive budget.")

    def save(self, *args, **kwargs):
        self.full_clean()
        #    Check if the remaining budget amount is valid or not
        total_spent = (
            self.budget.budget_expenses.exclude(pk=self.pk).aggregate(
                models.Sum("expense_amount")
            )["expense_amount__sum"]
            or 0
        )

        if total_spent + self.expense_amount > self.budget.budget_amount:
            raise ValidationError(
                {"inactive": "You can't add as the budget amount exceeded"}
            )
        super().save(*args, **kwargs)
        total_spent = (
            self.budget.budget_expenses.aggregate(models.Sum("expense_amount"))[
                "expense_amount__sum"
            ]
            or 0
        )
        if (total_spent >= self.budget.budget_amount) or (
            self.budget.valid_until and datetime.date.today() > self.budget.valid_until
        ):

            self.budget.is_active = False
            self.budget.save(update_fields=["is_active"])
