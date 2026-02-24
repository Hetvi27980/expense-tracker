# FastAPI Backend

### ✅ Complete FastAPI Backend with:
- **Session-based authentication** (cookies)
- **MySQL database** integration (SQLAlchemy ORM)
- **Data structures:**
  - Trie (smart search)
  - Heap (top N expenses)
  - Stack (undo delete)
  - Hashing (SHA256 passwords)

### 📁 Project Structure

```
Expense Tracker/backend/
├── main.py              # FastAPI app with all routes
├── models.py            # User & Transaction models
├── database.py          # DB connection & session
├── auth.py              # Password hashing utilities
├── data_structures.py   # Trie, Heap, Stack implementations
├── reports.py           # PDF, CSV, Excel generation
├── config.py            # Environment config
├── init_db.py           # Database initialization
├── run.py               # Run script
├── requirements.txt     # Dependencies
├── README.md            # Full documentation
└── SETUP.md             # Quick setup guide
```

### 🔌 API Endpoints

**Authentication:**
- `POST /api/auth/register` - Register
- `POST /api/auth/login` - Login
- `POST /api/auth/logout` - Logout
- `GET /api/auth/me` - Current user
- `POST /api/auth/reset-password` - Password reset

**Transactions:**
- `GET /api/transactions` - List (with filters)
- `POST /api/transactions` - Create
- `PUT /api/transactions/{id}` - Update
- `DELETE /api/transactions/{id}` - Delete
- `POST /api/transactions/undo` - Undo delete

**Dashboard:**
- `GET /api/dashboard` - Financial overview

**Analytics:**
- `GET /api/analytics` - Charts data

**Search:**
- `GET /api/search/suggestions?prefix={text}` - Trie search

**Profile:**
- `GET /api/profile/stats` - User stats
- `PUT /api/profile/budget` - Update budget
- `PUT /api/profile/savings-goal` - Update goal

**Reports:**
- `GET /api/reports/pdf` - PDF download
- `GET /api/reports/csv` - CSV download
- `GET /api/reports/excel` - Excel download

### 🎯 Features Implemented

✅ User registration & login
✅ Password reset with security question
✅ CRUD operations for transactions
✅ Dashboard with financial metrics
✅ Analytics (category breakdown, monthly trends, heatmap, forecast)
✅ Search suggestions using Trie
✅ Top N expenses using Heap
✅ Undo delete using Stack
✅ Report generation (PDF, CSV, Excel)
✅ Budget & savings goal tracking
✅ Session management

### 🚀 Ready for React Frontend

- CORS configured for React (ports 5173)
- Session cookies configured for cross-origin
- All endpoints return JSON
- API documentation at `/docs` (Swagger UI)

### 📝 Next Steps

1. **Start the backend:**
   ```bash
   cd backend
   python init_db.py  # Initialize database
   python run.py      # Start server
   ```

2. **Visit API docs:**
   - http://localhost:3000/docs

3. **Ready to connect React frontend!**

---

**Backend is complete and ready!** 🎉
