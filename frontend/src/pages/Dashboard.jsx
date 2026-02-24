import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faCircleExclamation,
  faThumbsUp,
  faTriangleExclamation,
} from "@fortawesome/free-solid-svg-icons";

export default function Dashboard({ user }) {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const response = await axiosInstance.get("/dashboard");
      if (response.status === 200) {
        setDashboardData(response.data);
      }
    } catch (error) {
      toast.error("Failed to load dashboard data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl">Loading dashboard...</div>
      </div>
    );
  }

  if (!dashboardData) {
    return (
      <div className="glass-card">
        <h2 className="text-2xl font-bold mb-4">👋🏻 Hello, {user?.username}</h2>
        <p className="text-gray-400">Failed to load dashboard data.</p>
      </div>
    );
  }

  const {
    total_income,
    total_expense,
    net_balance,
    this_month_income,
    this_month_expense,
    this_month_net,
    top5_expenses,
    recent_transactions,
    monthly_budget,
    savings_goal,
  } = dashboardData;

  // Budget alerts
  const getBudgetStatus = () => {
    if (!monthly_budget || monthly_budget === 0) return null;
    const percentage = (this_month_expense / monthly_budget) * 100;
    if (percentage > 100) {
      return {
        type: "error",
        message: "You have crossed your monthly budget!",
      };
    } else if (percentage > 80) {
      return {
        type: "warning",
        message: "You are close to your monthly budget!",
      };
    } else if (percentage > 50) {
      return {
        type: "success",
        message: "You are doing good on your monthly budget!",
      };
    } else {
      return {
        type: "success",
        message: "You are doing great on your monthly budget!",
      };
    }
  };

  const budgetStatus = getBudgetStatus();
  const savingsProgress =
    savings_goal > 0 ? Math.min(100, (net_balance / savings_goal) * 100) : 0;
  const budgetProgress =
    monthly_budget > 0
      ? Math.min(100, (this_month_net / monthly_budget) * 100)
      : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="glass-card">
        <h2 className="text-3xl font-bold mb-2">👋🏻 Hello, {user?.username}</h2>
        <h3 className="text-xl font-semibold mb-6">Financial Overview</h3>

        {!dashboardData.recent_transactions ||
        dashboardData.recent_transactions.length === 0 ? (
          <div className="text-gray-400">
            No transactions yet. Start by adding your first expense or income!
          </div>
        ) : (
          <>
            {/* Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Total Income</div>
                <div className="text-2xl font-bold text-green-400">
                  ₹{" "}
                  {total_income.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">Total Expense</div>
                <div className="text-2xl font-bold text-red-400">
                  ₹{" "}
                  {total_expense.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">
                  Total Net Balance
                </div>
                <div className="text-2xl font-bold text-indigo-400">
                  ₹{" "}
                  {net_balance.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">
                  This Month Income
                </div>
                <div className="text-2xl font-bold text-emerald-400">
                  ₹{" "}
                  {this_month_income.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">
                  This Month Expense
                </div>
                <div className="text-2xl font-bold text-rose-400">
                  ₹{" "}
                  {this_month_expense.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
              <div className="bg-gray-900/50 p-4 rounded-lg">
                <div className="text-sm text-gray-400 mb-1">This Month Net</div>
                <div className="text-2xl font-bold text-purple-400">
                  ₹{" "}
                  {this_month_net.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </div>
              </div>
            </div>

            {/* Budget Alert */}
            {budgetStatus && (
              <div
                className={`p-4 rounded-lg mb-4 ${
                  budgetStatus.type === "error"
                    ? "bg-red-900/30 border border-red-500"
                    : budgetStatus.type === "warning"
                      ? "bg-yellow-900/30 border border-yellow-500"
                      : "bg-green-900/30 border border-green-500"
                }`}
              >
                <FontAwesomeIcon
                  icon={
                    budgetStatus.type === "error"
                      ? faCircleExclamation
                      : budgetStatus.type === "warning"
                        ? faTriangleExclamation
                        : faThumbsUp
                  }
                />
                {"  "}
                {budgetStatus.message}
              </div>
            )}

            {/* Budget Goal Progress */}
            {monthly_budget > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">
                  📊 Budget Progress
                </h4>
                <p className="text-sm text-gray-400 mb-2">
                  Monthly Budget: ₹{" "}
                  {monthly_budget.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  | Current Monthly Net: ₹{" "}
                  {this_month_net.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-linear-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(0, Math.min(100, budgetProgress))}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}

            {/* Savings Goal Progress */}
            {savings_goal > 0 && (
              <div className="mb-6">
                <h4 className="text-lg font-semibold mb-2">
                  🎯 Savings Goal Progress
                </h4>
                <p className="text-sm text-gray-400 mb-2">
                  Goal: ₹{" "}
                  {savings_goal.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}{" "}
                  | Current Net: ₹{" "}
                  {net_balance.toLocaleString("en-IN", {
                    minimumFractionDigits: 2,
                  })}
                </p>
                <div className="w-full bg-gray-700 rounded-full h-4">
                  <div
                    className="bg-linear-to-r from-blue-500 to-purple-500 h-4 rounded-full transition-all duration-300"
                    style={{
                      width: `${Math.max(0, Math.min(100, savingsProgress))}%`,
                    }}
                  ></div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Top 5 Expenses */}
      {top5_expenses && top5_expenses.length > 0 && (
        <div className="glass-card">
          <h3 className="text-xl font-semibold mb-4">
            📈 Top 5 Highest Expenses
          </h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {top5_expenses.map((expense, idx) => (
                  <tr key={idx} className="border-b border-gray-800">
                    <td className="p-2">
                      {new Date(expense.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">{expense.category}</td>
                    <td className="p-2 font-semibold text-red-400">
                      ₹{" "}
                      {expense.amount.toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                      })}
                    </td>
                    <td className="p-2">{expense.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Recent Transactions */}
      {recent_transactions && recent_transactions.length > 0 && (
        <div className="glass-card">
          <h3 className="text-xl font-semibold mb-4">🕒 Recent Transactions</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="text-left p-2">Date</th>
                  <th className="text-left p-2">Type</th>
                  <th className="text-left p-2">Category</th>
                  <th className="text-left p-2">Amount</th>
                  <th className="text-left p-2">Description</th>
                </tr>
              </thead>
              <tbody>
                {recent_transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-gray-800">
                    <td className="p-2">
                      {new Date(tx.date).toLocaleDateString()}
                    </td>
                    <td className="p-2">
                      <span
                        className={`px-2 py-1 rounded ${
                          tx.kind === "income"
                            ? "bg-green-900/30 text-green-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {tx.kind === "income" ? "Income" : "Expense"}
                      </span>
                    </td>
                    <td className="p-2">{tx.category}</td>
                    <td className="p-2 font-semibold">
                      {tx.kind === "income" ? (
                        <span className="text-green-400">
                          +₹{" "}
                          {tx.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      ) : (
                        <span className="text-red-400">
                          -₹{" "}
                          {tx.amount.toLocaleString("en-IN", {
                            minimumFractionDigits: 2,
                          })}
                        </span>
                      )}
                    </td>
                    <td className="p-2">{tx.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
