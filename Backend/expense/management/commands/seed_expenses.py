from django.core.management.base import BaseCommand
from faker import Faker
import random, datetime
from expense.models import Expense, Budget
from authentication.models import CustomUser

fake = Faker()

class Command(BaseCommand):
    help = "Seed a few dummy expenses starting from today"

    def add_arguments(self, parser):
        parser.add_argument(
            "--username",
            type=str,
            required=True,
            help="Username of the user to seed expenses for",
        )
        parser.add_argument(
            "--count",
            type=int,
            default=5,
            help="Number of dummy expenses to create",
        )

    def handle(self, *args, **options):
        username = options["username"]
        count = options["count"]

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"User '{username}' not found"))
            return

        budgets = list(Budget.objects.filter(user=user))
        if not budgets:
            self.stdout.write(self.style.ERROR("No budgets found for this user. Seed budgets first!"))
            return

        statuses = ["PENDING", "DECLINED", "REIMBRUSHED", "PAID"]
        today = datetime.date.today()-datetime.timedelta(days=30)
        expenses_to_create = []

        for _ in range(count):
            budget = random.choice(budgets)
            expense_date = today
            updated_date = today + datetime.timedelta(days=random.randint(0, 2))

            expenses_to_create.append(
                Expense(
                    expense_name=fake.word(),
                    user=user,
                    expense_description=fake.sentence(),
                    budget=budget,
                    expense_amount=round(random.uniform(10, 200), 2),
                    status=random.choice(statuses),
                    expense_category=budget.budget_field,
                    created_at=datetime.datetime.combine(expense_date, datetime.time.min),
                    updated_at=datetime.datetime.combine(updated_date, datetime.time.min),
                )
            )

        Expense.objects.bulk_create(expenses_to_create)
        self.stdout.write(self.style.SUCCESS(f"Added {len(expenses_to_create)} dummy expenses for {username} starting today"))