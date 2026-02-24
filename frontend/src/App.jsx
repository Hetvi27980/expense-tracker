import { Routes, Route, Navigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { axiosInstance } from "./lib/axios";
import toast from "react-hot-toast";

// Pages
import AuthPage from "./pages/AuthPage";
import Dashboard from "./pages/Dashboard";
import AddTransaction from "./pages/AddTransaction";
import ManageTransactions from "./pages/ManageTransactions";
import Analytics from "./pages/Analytics";
import Profile from "./pages/Profile";
import Layout from "./components/Layout";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await axiosInstance.get("/auth/me");
      if (response.status === 200) {
        setUser(response.data);
      }
    } catch (error) {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (userData) => {
    setUser(userData);
  };

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      setUser(null);
      toast.success("Logged out successfully!");
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <Routes>
      <Route
        path="/auth"
        element={
          user ? (
            <Navigate to="/dashboard" replace />
          ) : (
            <AuthPage onLogin={handleLogin} />
          )
        }
      />
      <Route
        path="/"
        element={
          user ? (
            <Layout onLogout={handleLogout}>
              <Dashboard user={user} />
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/dashboard"
        element={
          user ? (
            <Layout onLogout={handleLogout}>
              <Dashboard user={user} />
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/add-transaction"
        element={
          user ? (
            <Layout onLogout={handleLogout}>
              <AddTransaction />
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/manage-transactions"
        element={
          user ? (
            <Layout onLogout={handleLogout}>
              <ManageTransactions />
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/analytics"
        element={
          user ? (
            <Layout onLogout={handleLogout}>
              <Analytics />
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
      <Route
        path="/profile"
        element={
          user ? (
            <Layout onLogout={handleLogout}>
              <Profile user={user} />
            </Layout>
          ) : (
            <Navigate to="/auth" replace />
          )
        }
      />
    </Routes>
  );
}

export default App;
