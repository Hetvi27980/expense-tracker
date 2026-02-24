# Backend Setup Guide

## Quick Start

1. **Install dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Configure environment:**
   - Copy `.env.example` to `.env`
   - Edit `.env` with your MySQL credentials

3. **Create MySQL database:**
   ```sql
   CREATE DATABASE expense_tracker;
   ```

4. **Initialize database tables:**
   ```bash
   python init_db.py
   ```

5. **Run the server:**
   ```bash
   python run.py
   ```
   Or:
   ```bash
   python main.py
   ```

## Environment Variables

Create a `.env` file in the `backend` directory:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=your_password
DB_NAME=expense_tracker
SECRET_KEY=your-random-secret-key-here
API_PORT=3000
API_HOST=0.0.0.0
```

## Testing the API

Once running, visit:
- **API Docs (Swagger)**: http://localhost:3000/docs
- **API Docs (ReDoc)**: http://localhost:3000/redoc

## API Base URL

All API endpoints are prefixed with `/api`:
- Base URL: `http://localhost:3000/api`

## Session Authentication

The backend uses session-based authentication with cookies. The session cookie is named `session_id` and is set automatically on login.

For React frontend, ensure:
- CORS is configured (already done in `main.py`)
- Cookies are sent with requests (`credentials: 'include'` in fetch/axios)
- Frontend runs on allowed origin (see CORS settings in `main.py`)
