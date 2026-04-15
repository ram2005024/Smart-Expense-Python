from django.core.management.base import BaseCommand
from faker import Faker
import random, datetime, uuid
from expense.models import Budget
from authentication.models import CustomUser

fake = Faker()

category = ["FOOD", "PERSONAL", "TRIP", "CLOTHS", "OTHERS", "GROCERY", "STUDY"]


class Command(BaseCommand):
    help = "Seed dummy budgets for a user with flexible types and dates"

    def add_arguments(self, parser):
        parser.add_argument("--username", type=str, required=True)
        parser.add_argument("--count", type=int, default=5)
        parser.add_argument("--month", type=int, default=datetime.date.today().month)
        parser.add_argument("--year", type=int, default=datetime.date.today().year)
        parser.add_argument("--day", type=int, default=1)
        parser.add_argument(
            "--types",
            nargs="+",
            choices=["MONTHLY", "WEEKLY", "YEARLY", "SEMI YEARLY", "DAY"],
            help="List of budget types to create, e.g. --types MONTHLY WEEKLY YEARLY",
        )

    def handle(self, *args, **options):
        username = options["username"]
        count = options["count"]
        month = options["month"]
        year = options["year"]
        day = options["day"]
        types = options.get("types")

        try:
            user = CustomUser.objects.get(username=username)
        except CustomUser.DoesNotExist:
            self.stdout.write(self.style.ERROR(f"User '{username}' not found"))
            return

        budgets_to_create = []

        # If types are provided, cycle through them; otherwise random
        chosen_types = (
            types
            if types
            else [
                random.choice(["MONTHLY", "WEEKLY", "YEARLY", "SEMI YEARLY", "DAY"])
                for _ in range(count)
            ]
        )

        for i in range(count):
            budget_limit = chosen_types[i % len(chosen_types)]
            budget_field = random.choice(category)
            budget_amount = round(random.uniform(500, 5000), 2)

            if budget_limit == "DAY":
                start_date = datetime.date(year, month, day)
                valid_until = start_date + datetime.timedelta(days=1)
            else:
                start_date = datetime.date(year, month, 1)
                if budget_limit == "MONTHLY":
                    valid_until = start_date + datetime.timedelta(days=30)
                elif budget_limit == "WEEKLY":
                    valid_until = start_date + datetime.timedelta(days=7)
                elif budget_limit == "SEMI YEARLY":
                    valid_until = start_date + datetime.timedelta(days=182)
                elif budget_limit == "YEARLY":
                    valid_until = start_date + datetime.timedelta(days=365)
                else:
                    valid_until = start_date + datetime.timedelta(days=1)

            budgets_to_create.append(
                Budget(
                    id=str(uuid.uuid4()),
                    budget_name=fake.word().capitalize() + " Budget",
                    budget_limit=budget_limit,
                    budget_field=budget_field,
                    budget_amount=budget_amount,
                    user=user,
                    created_at=datetime.datetime.combine(start_date, datetime.time.min),
                    updated_at=datetime.datetime.combine(start_date, datetime.time.min),
                    valid_until=valid_until,
                    is_active=True,
                )
            )

        Budget.objects.bulk_create(budgets_to_create)
        self.stdout.write(
            self.style.SUCCESS(
                f"Added {len(budgets_to_create)} budgets ({', '.join(chosen_types)}) for {username} in {month}/{year}"
            )
        )
