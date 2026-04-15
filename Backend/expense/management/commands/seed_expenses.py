from django.core.management.base import BaseCommand
from faker import Faker
import random, datetime
from expense.models import Expense, Budget
from authentication.models import CustomUser

fake = Faker()


class Command(BaseCommand):
    help = "Seed dummy expenses for a given month (always generates for budgets)"

    def add_arguments(self, parser):
        parser.add_argument("--username", type=str, required=True)
        parser.add_argument("--count", type=int, default=5)
        parser.add_argument("--month", type=int, default=datetime.date.today().month)
        parser.add_argument("--year", type=int, default=datetime.date.today().year)

    def handle(self, *args, **options):
        username = options["username"]
        count = options["count"]
        month = options["month"]
        year = options["year"]

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"User '{username}' not found"))
            return

        budgets = list(Budget.objects.filter(user=user))
        if not budgets:
            self.stdout.write(
                self.style.ERROR("No budgets found for this user. Seed budgets first!")
            )
            return

        statuses = ["PENDING", "DECLINED", "REIMBRUSHED", "PAID"]

        # First and last day of chosen month
        first_day = datetime.date(year, month, 1)
        if month == 12:
            next_month = datetime.date(year + 1, 1, 1)
        else:
            next_month = datetime.date(year, month + 1, 1)
        last_day = next_month - datetime.timedelta(days=1)

        expenses_to_create = []

        for _ in range(count):
            budget = random.choice(budgets)

            # Instead of skipping, just clamp dates to the chosen month
            start_date = first_day
            end_date = last_day

            # Pick a random day within the chosen month
            random_day = random.randint(0, (end_date - start_date).days)
            expense_date = start_date + datetime.timedelta(days=random_day)
            updated_date = expense_date + datetime.timedelta(days=random.randint(0, 2))

            expenses_to_create.append(
                Expense(
                    expense_name=fake.word(),
                    user=user,
                    expense_description=fake.sentence(),
                    budget=budget,
                    expense_amount=round(random.uniform(10, 200), 2),
                    status=random.choice(statuses),
                    expense_category=budget.budget_field,
                    created_at=datetime.datetime.combine(
                        expense_date, datetime.time.min
                    ),
                    updated_at=datetime.datetime.combine(
                        updated_date, datetime.time.min
                    ),
                )
            )

        Expense.objects.bulk_create(expenses_to_create)
        self.stdout.write(
            self.style.SUCCESS(
                f"Added {len(expenses_to_create)} dummy expenses for {username} in {month}/{year}"
            )
        )
