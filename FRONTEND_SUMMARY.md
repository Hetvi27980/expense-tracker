# React Frontend

### ✅ Complete React Frontend with:
- **Vite** for fast development
- **TailwindCSS** for styling
- **Axios** for API calls
- **React Router** for navigation
- **useState** for state management

### 📁 Project Structure

```
Expense Tracker/frontend/
├── src/
│   ├── components/
│   │   └── Layout.jsx              # Sidebar navigation layout
│   ├── lib/
│   │   └── axios.js                 # Axios config with credentials
│   ├── pages/
│   │   ├── AuthPage.jsx            # Login/Register/Password Reset
│   │   ├── Dashboard.jsx          # Financial overview & metrics
│   │   ├── AddTransaction.jsx       # Add expense/income forms
│   │   ├── ManageTransactions.jsx  # CRUD, filters, search, undo
│   │   ├── Analytics.jsx           # Charts (Plotly)
│   │   └── Profile.jsx             # User stats, budget, logout
│   ├── App.jsx                     # Main app with routing
│   ├── main.jsx                    # Entry point
│   └── index.css                   # Global styles + dark glass theme
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── index.html
└── README.md
```

### 🎨 Pages Implemented

1. **AuthPage** (`/auth`)
   - Login form
   - Register form
   - Password reset (expandable section)
   - Form validation
   - Toast notifications

2. **Dashboard** (`/dashboard`)
   - Financial metrics (Total Income, Expense, Net Balance, This Month)
   - Budget alerts
   - Savings goal progress bar
   - Top 5 highest expenses
   - Recent transactions table

3. **AddTransaction** (`/add-transaction`)
   - Add expense form (date, category, amount, description)
   - Add income form (date, source, amount, description)
   - Form validation

4. **ManageTransactions** (`/manage-transactions`)
   - List all transactions
   - Filters (type, category, date range)
   - Search functionality
   - Edit transaction
   - Delete transaction with undo
   - Download reports (PDF, CSV, Excel)

5. **Analytics** (`/analytics`)
   - Category-wise pie chart
   - Category-wise bar chart
   - Monthly income vs expense trend
   - Next month expense forecast
   - Download PDF report

6. **Profile** (`/profile`)
   - User statistics
   - Monthly budget setting
   - Savings goal setting
   - Logout with confirmation

### 🎯 Features

✅ Session-based authentication (cookies)
✅ Protected routes
✅ Responsive design
✅ TailwindCSS theme styling
✅ Toast notifications (react-hot-toast)
✅ Charts with Plotly.js
✅ Form validation
✅ Error handling
✅ Loading states

### 🚀 Quick Start

1. **Install dependencies:**
   ```bash
   cd frontend
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Access the app:**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:3000

### 📝 Configuration

- **API Base URL**: Configured in `src/lib/axios.js`
  - Development: `http://localhost:3000/api`
  - Production: `/api`

- **Axios**: Configured with `withCredentials: true` for session cookies

- **Vite**: Proxy configured for `/api` requests to backend

### 🎨 Styling

- **TailwindCSS v4** for utility classes
- **Custom CSS** for dark glass theme:
  - Glassmorphism cards
  - Gradient backgrounds
  - Custom button styles
  - Sidebar styling

### 📦 Dependencies

- `react` & `react-dom` - React framework
- `react-router-dom` - Routing
- `axios` - HTTP client
- `react-hot-toast` - Notifications
- `react-plotly.js` & `plotly.js` - Charts
- `tailwindcss` - Styling
- `vite` - Build tool

### ✅ All Features

- ✅ Multi-user authentication
- ✅ Add expenses and incomes
- ✅ Manage transactions (CRUD)
- ✅ Dashboard with financial overview
- ✅ Analytics with charts
- ✅ Search functionality (Trie-based on backend)
- ✅ Top N expenses (Heap on backend)
- ✅ Undo delete (Stack on backend)
- ✅ Budget and savings goal tracking
- ✅ Report downloads (PDF, CSV, Excel)

---

**Frontend is complete and ready!** 🎉
