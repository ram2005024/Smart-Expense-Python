from sqlalchemy import create_engine

# Local Postgres connection
DATABASE_URL = "postgresql://myuser:9crqoovg9@localhost:5432/smart_expense"

engine = create_engine(DATABASE_URL)