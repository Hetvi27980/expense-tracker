import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faMoneyCheckDollar, faSackDollar } from "@fortawesome/free-solid-svg-icons";

export default function Profile({ user }) {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [budget, setBudget] = useState(0);
  const [savingsGoal, setSavingsGoal] = useState(0);
  const [confirmLogout, setConfirmLogout] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await axiosInstance.get("/profile/stats");
      if (response.status === 200) {
        setStats(response.data);
        setBudget(response.data.monthly_budget || 0);
        setSavingsGoal(response.data.savings_goal || 0);
      }
    } catch (error) {
      toast.error("Failed to load profile data");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateBudget = async () => {
    try {
      const response = await axiosInstance.put("/profile/budget", {
        monthly_budget: parseFloat(budget),
      });
      if (response.status === 200) {
        toast.success("Monthly budget updated!");
        fetchStats();
      }
    } catch (error) {
      toast.error("Failed to update budget");
    }
  };

  const handleUpdateSavingsGoal = async () => {
    try {
      const response = await axiosInstance.put("/profile/savings-goal", {
        savings_goal: parseFloat(savingsGoal),
      });
      if (response.status === 200) {
        toast.success("Savings goal updated!");
        fetchStats();
      }
    } catch (error) {
      toast.error("Failed to update savings goal");
    }
  };

  const handleLogout = async () => {
    if (!confirmLogout) {
      toast.error("Please tick Confirm logout before logging out!");
      return;
    }
    try {
      await axiosInstance.post("/auth/logout");
      window.location.href = "/auth";
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="text-xl">Loading profile...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <h2 className="text-2xl font-semibold mb-6">👤 Profile</h2>

        {stats && (
          <>
            <div className="space-y-2 mb-6 text-md">
              <p>
                <strong>Username:</strong> {stats.username}
              </p>
              <p>
                <strong>Total transactions recorded:</strong>{" "}
                {stats.total_transactions}
              </p>
              <p>
                <strong>Total amount (incomes + expenses):</strong> ₹{" "}
                {stats.total_amount.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                })}
              </p>
            </div>

            <hr className="border-gray-700 my-6" />

            <h3 className="text-xl font-semibold mb-4">
              🧮 Budget & Savings Settings
            </h3>

            <div className="space-y-4">
              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Set Monthly Expense Budget (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="500"
                  className="input-field w-full mb-2"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                />
                <button onClick={handleUpdateBudget} className="btn-primary">
                  <FontAwesomeIcon icon={faMoneyCheckDollar} />
                  &nbsp;&nbsp;Save Budget
                </button>
              </div>

              <div>
                <label className="block text-sm text-gray-400 mb-2">
                  Set Savings Goal (Net Balance) (₹)
                </label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  className="input-field w-full mb-2"
                  value={savingsGoal}
                  onChange={(e) => setSavingsGoal(e.target.value)}
                />
                <button
                  onClick={handleUpdateSavingsGoal}
                  className="btn-primary"
                >
                  <FontAwesomeIcon icon={faSackDollar} />
                  &nbsp;&nbsp;Save Savings Goal
                </button>
              </div>
            </div>

            <hr className="border-gray-700 my-6" />

            <h3 className="text-xl font-semibold mb-4">🔐 LogOut</h3>
            <div className="space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={confirmLogout}
                  onChange={(e) => setConfirmLogout(e.target.checked)}
                  className="w-4 h-4"
                />
                <span>Confirm logout</span>
              </label>
              <button
                onClick={handleLogout}
                className="btn-primary"
                disabled={!confirmLogout}
              >
                <FontAwesomeIcon icon={faArrowRightFromBracket} />
                &nbsp;LogOut
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
