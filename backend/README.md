# Expense Tracker - FastAPI Backend

Backend API for the Expense Tracker application built with FastAPI, MySQL, and data structures (Trie, Heap, Stack, Hashing).

## Features

- ✅ User authentication (Register, Login, Password Reset) with session-based auth
- ✅ Transaction management (CRUD operations)
- ✅ Dashboard with financial overview
- ✅ Analytics and reports (PDF, CSV, Excel)
- ✅ Data Structures:
  - **Trie**: Smart search suggestions
  - **Heap**: Top N expenses
  - **Stack**: Undo delete functionality
  - **Hashing**: Password security (SHA256)

## Prerequisites

- Python 3.8+
- MySQL 5.7+ or MariaDB
- pip

## Setup Instructions

### 1. Create Virtual Environment

```bash
cd backend
python -m venv venv

# Windows
venv\Scripts\activate

# Linux/Mac
source venv/bin/activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Database

1. Create MySQL database:
```sql
CREATE DATABASE expense_tracker;
```

2. Copy `.env.example` to `.env`:
```bash
copy .env.example .env  # Windows
cp .env.example .env     # Linux/Mac
```

3. Edit `.env` file with your MySQL credentials:
```
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker
SECRET_KEY=your-random-secret-key-here
```

### 4. Initialize Database

```bash
python init_db.py
```

This will create all necessary tables (`users` and `transactions`).

### 5. Run the Server

```bash
python main.py
```

Or using uvicorn directly:
```bash
uvicorn main:app --host 0.0.0.0 --port 3000 --reload
```

The API will be available at: `http://localhost:3000`

## API Documentation

Once the server is running, visit:
- **Swagger UI**: http://localhost:3000/docs
- **ReDoc**: http://localhost:3000/redoc

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info
- `POST /api/auth/reset-password` - Reset password

### Transactions
- `GET /api/transactions` - Get transactions (with filters)
- `POST /api/transactions` - Create transaction
- `PUT /api/transactions/{id}` - Update transaction
- `DELETE /api/transactions/{id}` - Delete transaction
- `POST /api/transactions/undo` - Undo last delete

### Dashboard
- `GET /api/dashboard` - Get dashboard data

### Analytics
- `GET /api/analytics` - Get analytics data

### Search
- `GET /api/search/suggestions?prefix={text}` - Get search suggestions (Trie)

### Profile
- `GET /api/profile/stats` - Get user stats
- `PUT /api/profile/budget` - Update monthly budget
- `PUT /api/profile/savings-goal` - Update savings goal

### Reports
- `GET /api/reports/pdf?start_date={date}&end_date={date}` - Download PDF
- `GET /api/reports/csv?start_date={date}&end_date={date}` - Download CSV
- `GET /api/reports/excel?start_date={date}&end_date={date}` - Download Excel

## Data Structures Used

1. **Trie**: For fast prefix-based search suggestions
2. **Heap (heapq)**: For finding top N expenses efficiently
3. **Stack**: For undo delete functionality
4. **Hashing (SHA256)**: For password security

## Project Structure

```
backend/
├── main.py              # FastAPI application and routes
├── models.py            # SQLAlchemy database models
├── database.py          # Database connection and session
├── auth.py              # Authentication utilities
├── data_structures.py   # Trie, Heap, Stack implementations
├── reports.py           # PDF, CSV, Excel report generation
├── config.py            # Configuration from environment variables
├── init_db.py           # Database initialization script
├── requirements.txt     # Python dependencies
├── .env.example         # Environment variables template
└── README.md            # This file
```

## Notes

- Session-based authentication (cookies)
- CORS enabled for React frontend
- All passwords are hashed using SHA256 (same as original)
- Delete operations support undo via Stack data structure
- Search uses Trie for efficient prefix matching

## Troubleshooting

**Database connection error:**
- Ensure MySQL server is running
- Check database credentials in `.env`
- Verify database exists: `CREATE DATABASE expense_tracker;`

**Port already in use:**
- Change `API_PORT` in `.env` or use different port: `uvicorn main:app --port 3001`

**Import errors:**
- Ensure virtual environment is activated
- Reinstall dependencies: `pip install -r requirements.txt`
