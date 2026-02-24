# Expense Tracker - React Frontend

React frontend for the Expense Tracker application built with Vite, TailwindCSS, and Axios.

## Features

- ✅ Modern React with Vite
- ✅ TailwindCSS for styling
- ✅ Dark glass theme (matching original Streamlit design)
- ✅ Session-based authentication
- ✅ Dashboard with financial overview
- ✅ Transaction management (CRUD)
- ✅ Analytics with charts (Plotly)
- ✅ Profile management
- ✅ Responsive design

## Prerequisites

- Node.js 18+ and npm/yarn
- Backend API running on http://localhost:3000

## Setup Instructions

### 1. Install Dependencies

```bash
cd frontend
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at: http://localhost:5173

### 3. Build for Production

```bash
npm run build
```

## Project Structure

```
frontend/
├── src/
│   ├── components/
│   │   └── Layout.jsx          # Main layout with sidebar
│   ├── lib/
│   │   └── axios.js             # Axios configuration
│   ├── pages/
│   │   ├── AuthPage.jsx         # Login/Register/Password Reset
│   │   ├── Dashboard.jsx        # Financial overview
│   │   ├── AddTransaction.jsx    # Add expense/income
│   │   ├── ManageTransactions.jsx # CRUD transactions
│   │   ├── Analytics.jsx        # Charts and analytics
│   │   └── Profile.jsx          # User profile & settings
│   ├── App.jsx                  # Main app component with routing
│   ├── main.jsx                # Entry point
│   └── index.css                # Global styles
├── package.json
├── vite.config.js
├── tailwind.config.js
└── README.md
```

## API Configuration

The frontend is configured to connect to the backend API at:
- Development: `http://localhost:3000/api`
- Production: `/api` (relative)

Configure in `src/lib/axios.js` if needed.

## Features Implemented

- **Authentication**: Login, Register, Password Reset
- **Dashboard**: Financial metrics, top expenses, recent transactions
- **Transactions**: Add, Edit, Delete, Undo, Filter, Search
- **Analytics**: Pie charts, bar charts, monthly trends, forecast
- **Profile**: Stats, budget settings, savings goal
- **Reports**: PDF, CSV, Excel downloads

## Styling

- Dark glass theme with gradients
- TailwindCSS for utility classes
- Custom CSS for glassmorphism effects
- Responsive design for mobile and desktop

## Notes

- Uses session-based authentication (cookies)
- Axios configured with `withCredentials: true` for cookies
- React Router for navigation
- React Hot Toast for notifications
- Plotly.js for charts
