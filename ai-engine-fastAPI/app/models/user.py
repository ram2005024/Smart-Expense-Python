from sqlalchemy import Column, String
from app.db import Base


class CustomUser(Base):
    __tablename__ = "authentication_customuser"

    id = Column(String, primary_key=True)
