# Smart Expense Tracker

A full-stack expense tracking application with FastAPI backend and React frontend, featuring data structures (Trie, Heap, Stack, Hashing) and MySQL database.

## 🎯 Project Overview

The Expense Tracker is a modern full-stack application:

- **Backend**: FastAPI (Python) with MySQL database
- **Frontend**: React with Vite + TailwindCSS
- **Data Structures**: Trie, Heap, Stack, Hashing
- **Authentication**: Session-based with cookies

## 📁 Project Structure

```
Expense Tracker/
├── backend/          # FastAPI backend
│   ├── main.py      # API routes
│   ├── models.py    # Database models
│   ├── database.py  # DB connection
│   ├── auth.py      # Authentication
│   ├── data_structures.py  # Trie, Heap, Stack
│   ├── reports.py   # PDF, CSV, Excel generation
│   └── ...
├── frontend/        # React frontend
│   ├── src/
│   │   ├── pages/   # All page components
│   │   ├── components/  # Reusable components
│   │   └── lib/     # Axios configuration
│   └── ...
└── README.md        # This file
```

## ✨ Features

### Authentication
- ✅ User registration
- ✅ Login/Logout
- ✅ Password reset with security question
- ✅ Session-based authentication

### Transactions
- ✅ Add expenses and incomes
- ✅ Edit transactions
- ✅ Delete transactions (with undo)
- ✅ Filter by type, category, date range
- ✅ Search functionality (Trie-based)

### Dashboard
- ✅ Financial overview (income, expense, net balance)
- ✅ Monthly budget tracking
- ✅ Savings goal progress
- ✅ Top 5 highest expenses
- ✅ Recent transactions

### Analytics
- ✅ Category-wise pie chart
- ✅ Category-wise bar chart
- ✅ Monthly income vs expense trends
- ✅ Next month expense forecast

### Reports
- ✅ PDF report download
- ✅ CSV report download
- ✅ Excel report download

### Profile
- ✅ User statistics
- ✅ Monthly budget setting
- ✅ Savings goal setting

## 🧠 Data Structures

All data structures:

1. **Trie**: Fast prefix-based search suggestions
2. **Heap**: Efficient top N expenses retrieval
3. **Stack**: Undo delete functionality
4. **Hashing**: SHA256 password security

## 🎨 UI Theme

Dark glass theme design:
- Glassmorphism cards
- Gradient backgrounds
- Modern, sleek interface

## 📚 Documentation

- **Backend**: See `backend/README.md`
- **Frontend**: See `frontend/README.md`
- **Backend Summary**: See `BACKEND_SUMMARY.md`
- **Frontend Summary**: See `FRONTEND_SUMMARY.md`

## 🔧 Configuration

### Backend
- Database: Configure in `backend/.env`
- API Port: 3000 (configurable in `.env`)

### Frontend
- API URL: Configured in `frontend/src/lib/axios.js`
- Development: `http://localhost:3000/api`
- Production: `/api`

## 🧪 Testing

### Backend API
Visit http://localhost:3000/docs for interactive API documentation (Swagger UI)

### Frontend
- Open http://localhost:5173
- Register a new user or login
- Start tracking expenses!

## 📝 Notes

- Session cookies are used for authentication
- CORS is configured for React frontend
- All passwords are hashed using SHA256
- Database tables are auto-created on first run

## 🐛 Troubleshooting

**Backend won't start:**
- Check MySQL is running
- Verify database credentials in `.env`
- Ensure database exists

**Frontend can't connect to backend:**
- Ensure backend is running on port 3000
- Check CORS settings in `backend/main.py`
- Verify API URL in `frontend/src/lib/axios.js`

**Database connection errors:**
- Verify MySQL server is running
- Check database credentials
- Ensure database `expense_tracker` exists

## 📄 License

This project is for educational purposes.

---

**Built with ❤️ using FastAPI, React, and MySQL**
