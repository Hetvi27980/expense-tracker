"""
FastAPI Backend - Expense Tracker API
"""
import uvicorn
from fastapi import FastAPI, Depends, HTTPException, status, Request, Response
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse, StreamingResponse
from sqlalchemy.orm import Session
from sqlalchemy import and_
from datetime import date, datetime, timedelta
from typing import List, Optional
import pandas as pd
import numpy as np
from pydantic import BaseModel
from itsdangerous import URLSafeTimedSerializer

from database import get_db, Base, engine
from models import User, Transaction, TransactionKind
from auth import hash_text, verify_hash
from data_structures import Trie, get_top_n_expenses, DeleteStack
from reports import generate_pdf_report, generate_csv_report, generate_excel_report
from config import SECRET_KEY

# Create tables
Base.metadata.create_all(bind=engine)

app = FastAPI(title="Expense Tracker API", version="1.0.0")

# CORS middleware for React frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173"
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
    expose_headers=["*"],
)

# Session serializer
serializer = URLSafeTimedSerializer(SECRET_KEY)

# In-memory session store (for production, use Redis or database)
sessions = {}

# In-memory delete stack per user
delete_stacks = {}

# ---------------------- PYDANTIC MODELS ---------------------- #
class UserRegister(BaseModel):
    username: str
    password: str
    sec_question: Optional[str] = None
    sec_answer: Optional[str] = None

class UserLogin(BaseModel):
    username: str
    password: str

class PasswordReset(BaseModel):
    username: str
    sec_answer: str
    new_password: str

class TransactionCreate(BaseModel):
    date: date
    category: str
    amount: float
    description: str
    kind: str  # "expense" or "income"

class TransactionUpdate(BaseModel):
    date: date
    category: str
    amount: float
    description: str

class BudgetUpdate(BaseModel):
    monthly_budget: float

class SavingsGoalUpdate(BaseModel):
    savings_goal: float

# ---------------------- SESSION HELPERS ---------------------- #
def get_session_username(request: Request) -> Optional[str]:
    """Get username from session cookie"""
    session_id = request.cookies.get("session_id")
    if not session_id:
        return None
    try:
        username = serializer.loads(session_id, max_age=86400)  # 24 hours
        if username in sessions:
            return username
    except:
        pass
    return None

def create_session(response: Response, username: str):
    """Create session and set cookie"""
    session_id = serializer.dumps(username)
    sessions[username] = {"username": username, "created_at": datetime.now()}
    response.set_cookie(
        key="session_id",
        value=session_id,
        max_age=86400,  # 24 hours
        httponly=True,
        samesite="lax",  # "lax" for HTTP, "none" for HTTPS
        secure=False  # "True" for HTTPS, "False" for HTTP
    )

def delete_session(response: Response, username: str):
    """Delete session"""
    if username in sessions:
        del sessions[username]
    if username in delete_stacks:
        del delete_stacks[username]
    response.delete_cookie(
        key="session_id",
        samesite="lax", # "lax" for HTTP, "none" for HTTPS
        secure=False # "True" for HTTPS, "False" for HTTP
    )

# ---------------------- DEPENDENCIES ---------------------- #
def get_current_user(request: Request, db: Session = Depends(get_db)) -> User:
    """Dependency to get current authenticated user"""
    username = get_session_username(request)
    if not username:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated"
        )
    user = db.query(User).filter(User.username == username).first()
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found"
        )
    return user

# ---------------------- AUTH ROUTES ---------------------- #
@app.post("/api/auth/register")
async def register(user_data: UserRegister, db: Session = Depends(get_db)):
    """Register a new user"""
    # Check if username exists
    existing = db.query(User).filter(User.username == user_data.username).first()
    if existing:
        raise HTTPException(status_code=400, detail="Username already exists")
    
    if len(user_data.username) < 3:
        raise HTTPException(status_code=400, detail="Username must be at least 3 monthlyacters")
    
    if len(user_data.password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters")
    
    new_user = User(
        username=user_data.username,
        password_hash=hash_text(user_data.password),
        sec_question=user_data.sec_question,
        sec_answer_hash=hash_text(user_data.sec_answer) if user_data.sec_answer else None,
        savings_goal=0.0,
        monthly_budget=0.0
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    
    return {"message": "Registration successful! You can now login.", "username": new_user.username}

@app.post("/api/auth/login")
async def login(user_data: UserLogin, response: Response, db: Session = Depends(get_db)):
    """Login user"""
    user = db.query(User).filter(User.username == user_data.username).first()
    if not user:
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    if not verify_hash(user_data.password, user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid username or password")
    
    create_session(response, user.username)
    return {"message": "Login successful", "username": user.username}

@app.post("/api/auth/logout")
async def logout(request: Request, response: Response):
    """Logout user"""
    username = get_session_username(request)
    if username:
        delete_session(response, username)
    return {"message": "Logged out successfully"}

@app.get("/api/auth/me")
async def get_current_user_info(current_user: User = Depends(get_current_user)):
    """Get current user info"""
    return {
        "username": current_user.username,
        "savings_goal": current_user.savings_goal,
        "monthly_budget": current_user.monthly_budget
    }

@app.post("/api/auth/reset-password")
async def reset_password(reset_data: PasswordReset, db: Session = Depends(get_db)):
    """Reset password using security question"""
    user = db.query(User).filter(User.username == reset_data.username).first()
    if not user:
        raise HTTPException(status_code=404, detail="User not found")
    
    if not user.sec_answer_hash or not verify_hash(reset_data.sec_answer, user.sec_answer_hash):
        raise HTTPException(status_code=400, detail="Security answer is incorrect")
    
    if len(reset_data.new_password) < 4:
        raise HTTPException(status_code=400, detail="Password must be at least 4 characters")
    
    user.password_hash = hash_text(reset_data.new_password)
    db.commit()
    
    return {"message": "Password reset successfully"}

# ---------------------- TRANSACTION ROUTES ---------------------- #
@app.get("/api/transactions")
async def get_transactions(
    kind: Optional[str] = None,
    category: Optional[str] = None,
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    search: Optional[str] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user transactions with optional filters"""
    query = db.query(Transaction).filter(Transaction.username == current_user.username)
    
    if kind:
        kind_enum = TransactionKind.expense if kind == "expense" else TransactionKind.income
        query = query.filter(Transaction.kind == kind_enum)
    
    if category:
        query = query.filter(Transaction.category == category)
    
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    
    transactions = query.order_by(Transaction.date.desc()).all()
    
    # Convert to dict list
    result = []
    for t in transactions:
        result.append({
            "id": t.id,
            "date": t.date.isoformat(),
            "category": t.category,
            "amount": t.amount,
            "description": t.description,
            "kind": t.kind.value
        })
    
    # Search filter (client-side for simplicity, or use SQL LIKE)
    if search:
        search_lower = search.lower()
        result = [
            t for t in result
            if search_lower in (t.get("description") or "").lower()
            or search_lower in (t.get("category") or "").lower()
            or search_lower in (t.get("kind") or "").lower()
        ]
    
    return {"transactions": result}

@app.post("/api/transactions")
async def create_transaction(
    transaction: TransactionCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Create a new transaction"""
    if transaction.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than 0")
    
    kind_enum = TransactionKind.income if transaction.kind == "income" else TransactionKind.expense
    
    new_transaction = Transaction(
        username=current_user.username,
        date=transaction.date,
        category=transaction.category,
        amount=transaction.amount,
        description=transaction.description,
        kind=kind_enum
    )
    
    db.add(new_transaction)
    db.commit()
    db.refresh(new_transaction)
    
    return {
        "id": new_transaction.id,
        "date": new_transaction.date.isoformat(),
        "category": new_transaction.category,
        "amount": new_transaction.amount,
        "description": new_transaction.description,
        "kind": new_transaction.kind.value,
        "message": "Transaction created successfully"
    }

@app.put("/api/transactions/{transaction_id}")
async def update_transaction(
    transaction_id: int,
    transaction: TransactionUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update a transaction"""
    t = db.query(Transaction).filter(
        and_(
            Transaction.id == transaction_id,
            Transaction.username == current_user.username
        )
    ).first()
    
    if not t:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    if transaction.amount <= 0:
        raise HTTPException(status_code=400, detail="Amount must be greater than 0")
    
    t.date = transaction.date
    t.category = transaction.category
    t.amount = transaction.amount
    t.description = transaction.description
    
    db.commit()
    db.refresh(t)
    
    return {
        "id": t.id,
        "date": t.date.isoformat(),
        "category": t.category,
        "amount": t.amount,
        "description": t.description,
        "kind": t.kind.value,
        "message": "Transaction updated successfully"
    }

@app.delete("/api/transactions/{transaction_id}")
async def delete_transaction(
    transaction_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Delete a transaction (with undo support)"""
    t = db.query(Transaction).filter(
        and_(
            Transaction.id == transaction_id,
            Transaction.username == current_user.username
        )
    ).first()
    
    if not t:
        raise HTTPException(status_code=404, detail="Transaction not found")
    
    # Store in delete stack for undo
    if current_user.username not in delete_stacks:
        delete_stacks[current_user.username] = DeleteStack()
    
    delete_stacks[current_user.username].push({
        "id": t.id,
        "username": t.username,
        "date": t.date.isoformat(),
        "category": t.category,
        "amount": t.amount,
        "description": t.description,
        "kind": t.kind.value
    })
    
    db.delete(t)
    db.commit()
    
    return {"message": "Transaction deleted successfully"}

@app.post("/api/transactions/undo")
async def undo_delete(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Undo last delete"""
    if current_user.username not in delete_stacks:
        raise HTTPException(status_code=400, detail="No deleted transaction to undo")
    
    stack = delete_stacks[current_user.username]
    deleted = stack.pop()
    
    if not deleted:
        raise HTTPException(status_code=400, detail="No deleted transaction to undo")
    
    kind_enum = TransactionKind.income if deleted["kind"] == "income" else TransactionKind.expense
    
    restored = Transaction(
        id=deleted["id"],
        username=deleted["username"],
        date=datetime.fromisoformat(deleted["date"]).date(),
        category=deleted["category"],
        amount=deleted["amount"],
        description=deleted["description"],
        kind=kind_enum
    )
    
    db.add(restored)
    db.commit()
    db.refresh(restored)
    
    return {"message": "Transaction restored successfully"}

# ---------------------- DASHBOARD ROUTES ---------------------- #
@app.get("/api/dashboard")
async def get_dashboard(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get dashboard data"""
    transactions = db.query(Transaction).filter(
        Transaction.username == current_user.username
    ).all()
    
    expenses = [t for t in transactions if t.kind == TransactionKind.expense]
    incomes = [t for t in transactions if t.kind == TransactionKind.income]
    
    total_income = sum(t.amount for t in incomes)
    total_expense = sum(t.amount for t in expenses)
    net_balance = total_income - total_expense
    
    # This month calculations
    today = date.today()
    this_month_start = date(today.year, today.month, 1)
    
    this_month_expenses = [t for t in expenses if t.date >= this_month_start]
    this_month_incomes = [t for t in incomes if t.date >= this_month_start]
    
    this_month_exp = sum(t.amount for t in this_month_expenses)
    this_month_inc = sum(t.amount for t in this_month_incomes)
    this_month_net = this_month_inc - this_month_exp
    
    # Top 5 expenses
    expenses_list = [{"amount": t.amount, "date": t.date.isoformat(), "category": t.category, "description": t.description} for t in expenses]
    top5 = get_top_n_expenses(expenses_list, n=5)
    
    # Recent transactions
    recent = sorted(transactions, key=lambda x: x.date, reverse=True)[:10]
    recent_list = [{
        "id": t.id,
        "date": t.date.isoformat(),
        "kind": t.kind.value,
        "category": t.category,
        "amount": t.amount,
        "description": t.description
    } for t in recent]
    
    return {
        "total_income": total_income,
        "total_expense": total_expense,
        "net_balance": net_balance,
        "this_month_expense": this_month_exp,
        "this_month_income": this_month_inc,
        "this_month_net": this_month_net,
        "top5_expenses": top5,
        "recent_transactions": recent_list,
        "monthly_budget": current_user.monthly_budget,
        "savings_goal": current_user.savings_goal
    }

# ---------------------- ANALYTICS ROUTES ---------------------- #
@app.get("/api/analytics")
async def get_analytics(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get analytics data"""
    transactions = db.query(Transaction).filter(
        Transaction.username == current_user.username
    ).all()
    
    expenses = [t for t in transactions if t.kind == TransactionKind.expense]
    incomes = [t for t in transactions if t.kind == TransactionKind.income]
    
    # Category-wise expense breakdown
    category_data = {}
    for exp in expenses:
        if exp.category not in category_data:
            category_data[exp.category] = 0.0
        category_data[exp.category] += exp.amount
    
    # Monthly trends
    monthly_data = {}
    for t in transactions:
        month_start = datetime(t.date.year, t.date.month, 1)
        month_key = month_start.isoformat()
        if month_key not in monthly_data:
            monthly_data[month_key] = {"expense": 0.0, "income": 0.0}
        if t.kind == TransactionKind.expense:
            monthly_data[month_key]["expense"] += t.amount
        else:
            monthly_data[month_key]["income"] += t.amount
    
    # Forecast (simple linear trend)
    forecast = None
    if len(monthly_data) >= 2:
        monthly_expenses = sorted([(k, v["expense"]) for k, v in monthly_data.items()])
        if len(monthly_expenses) >= 2:
            amounts = [v for _, v in monthly_expenses]
            x = np.arange(len(amounts))
            coeffs = np.polyfit(x, amounts, 1)
            next_x = len(x)
            forecast = float(np.polyval(coeffs, next_x))
    
    return {
        "category_breakdown": category_data,
        "monthly_trends": monthly_data,
        "forecast": forecast
    }

# ---------------------- SEARCH ROUTES ---------------------- #
@app.get("/api/search/suggestions")
async def get_search_suggestions(
    prefix: str,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get search suggestions using Trie"""
    transactions = db.query(Transaction).filter(
        Transaction.username == current_user.username
    ).all()
    
    # Build Trie from descriptions
    trie = Trie()
    descriptions = set()
    for t in transactions:
        if t.description:
            descriptions.add(t.description.lower())
    
    for desc in descriptions:
        trie.insert(desc)
    
    suggestions = trie.starts_with(prefix.lower(), limit=5)
    return {"suggestions": suggestions}

# ---------------------- PROFILE ROUTES ---------------------- #
@app.put("/api/profile/budget")
async def update_budget(
    budget: BudgetUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update monthly budget"""
    current_user.monthly_budget = budget.monthly_budget
    db.commit()
    return {"message": "Budget updated successfully", "monthly_budget": current_user.monthly_budget}

@app.put("/api/profile/savings-goal")
async def update_savings_goal(
    goal: SavingsGoalUpdate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Update savings goal"""
    current_user.savings_goal = goal.savings_goal
    db.commit()
    return {"message": "Savings goal updated successfully", "savings_goal": current_user.savings_goal}

@app.get("/api/profile/stats")
async def get_profile_stats(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Get user profile statistics"""
    transactions = db.query(Transaction).filter(
        Transaction.username == current_user.username
    ).all()
    
    total_amount = sum(t.amount for t in transactions)
    count = len(transactions)
    
    return {
        "username": current_user.username,
        "total_transactions": count,
        "total_amount": total_amount,
        "monthly_budget": current_user.monthly_budget,
        "savings_goal": current_user.savings_goal
    }

# ---------------------- REPORT ROUTES ---------------------- #
@app.get("/api/reports/pdf")
async def download_pdf_report(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download PDF report"""
    query = db.query(Transaction).filter(Transaction.username == current_user.username)
    
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    
    transactions = query.order_by(Transaction.date).all()
    
    transactions_list = [{
        "date": t.date.isoformat(),
        "category": t.category,
        "amount": t.amount,
        "description": t.description,
        "kind": t.kind.value
    } for t in transactions]
    
    pdf_bytes = generate_pdf_report(transactions_list, current_user.username)
    
    return StreamingResponse(
        iter([pdf_bytes]),
        media_type="application/pdf",
        headers={"Content-Disposition": f"attachment; filename=expense_report_{current_user.username}.pdf"}
    )

@app.get("/api/reports/csv")
async def download_csv_report(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download CSV report"""
    query = db.query(Transaction).filter(Transaction.username == current_user.username)
    
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    
    transactions = query.order_by(Transaction.date).all()
    
    transactions_list = [{
        "date": t.date.isoformat(),
        "category": t.category,
        "amount": t.amount,
        "description": t.description,
        "kind": t.kind.value
    } for t in transactions]
    
    csv_bytes = generate_csv_report(transactions_list)
    
    return StreamingResponse(
        iter([csv_bytes]),
        media_type="text/csv",
        headers={"Content-Disposition": f"attachment; filename=expense_report_{current_user.username}.csv"}
    )

@app.get("/api/reports/excel")
async def download_excel_report(
    start_date: Optional[date] = None,
    end_date: Optional[date] = None,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db)
):
    """Download Excel report"""
    query = db.query(Transaction).filter(Transaction.username == current_user.username)
    
    if start_date:
        query = query.filter(Transaction.date >= start_date)
    if end_date:
        query = query.filter(Transaction.date <= end_date)
    
    transactions = query.order_by(Transaction.date).all()
    
    transactions_list = [{
        "date": t.date.isoformat(),
        "category": t.category,
        "amount": t.amount,
        "description": t.description,
        "kind": t.kind.value
    } for t in transactions]
    
    excel_bytes = generate_excel_report(transactions_list, current_user.username)
    
    return StreamingResponse(
        iter([excel_bytes]),
        media_type="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        headers={"Content-Disposition": f"attachment; filename=expense_report_{current_user.username}.xlsx"}
    )

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=3000)
