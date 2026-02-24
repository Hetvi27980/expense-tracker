from sqlalchemy import Column, Integer, String, Float, Date, Enum
from database import Base
import enum

class TransactionKind(enum.Enum):
    expense = "expense"
    income = "income"

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(255), nullable=False)
    sec_question = Column(String(255), nullable=True)
    sec_answer_hash = Column(String(255), nullable=True)
    savings_goal = Column(Float, default=0.0)
    monthly_budget = Column(Float, default=0.0)

class Transaction(Base):
    __tablename__ = "transactions"
    
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(100), nullable=False, index=True)
    date = Column(Date, nullable=False)
    category = Column(String(100), nullable=False)
    amount = Column(Float, nullable=False)
    description = Column(String(500), nullable=True)
    kind = Column(Enum(TransactionKind), nullable=False, default=TransactionKind.expense)
