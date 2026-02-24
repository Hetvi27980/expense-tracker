import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from "@fortawesome/free-solid-svg-icons";

export default function AddTransaction() {
  const [loading, setLoading] = useState(false);

  // Expense form
  const [expenseData, setExpenseData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "Food",
    amount: "",
    description: "",
  });

  // Income form
  const [incomeData, setIncomeData] = useState({
    date: new Date().toISOString().split("T")[0],
    category: "",
    amount: "",
    description: "",
  });

  const expenseCategories = [
    "Food",
    "Travel",
    "Shopping",
    "Bills",
    "Health",
    "Education",
    "Entertainment",
    "Other",
  ];

  const handleAddExpense = async (e) => {
    e.preventDefault();
    if (parseFloat(expenseData.amount) <= 0) {
      toast.error("Amount should be greater than 0!");
      return;
    }
    if (!expenseData.description.trim()) {
      toast.error("Please enter a description!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/transactions", {
        date: expenseData.date,
        category: expenseData.category,
        amount: parseFloat(expenseData.amount),
        description: expenseData.description.trim(),
        kind: "expense",
      });
      if (response.status === 200) {
        toast.success("Expense added successfully!!");
        setExpenseData({
          date: new Date().toISOString().split("T")[0],
          category: "Food",
          amount: "",
          description: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add expense!");
    } finally {
      setLoading(false);
    }
  };

  const handleAddIncome = async (e) => {
    e.preventDefault();
    if (parseFloat(incomeData.amount) <= 0) {
      toast.error("Income amount should be greater than 0!");
      return;
    }
    if (!incomeData.category.trim()) {
      toast.error("Please enter income source!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/transactions", {
        date: incomeData.date,
        category: incomeData.category.trim(),
        amount: parseFloat(incomeData.amount),
        description: incomeData.description.trim() || "",
        kind: "income",
      });
      if (response.status === 200) {
        toast.success("Income added successfully!!");
        setIncomeData({
          date: new Date().toISOString().split("T")[0],
          category: "",
          amount: "",
          description: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Failed to add income!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Add Expense */}
      <div className="glass-card">
        <h2 className="text-2xl font-semibold mb-6">📝 Add New Expense</h2>
        <form onSubmit={handleAddExpense} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Date</label>
              <input
                type="date"
                className="input-field w-full"
                value={expenseData.date}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Category
              </label>
              <select
                className="input-field w-full"
                value={expenseData.category}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, category: e.target.value })
                }
                required
              >
                {expenseCategories.map((cat) => (
                  <option key={cat} value={cat}>
                    {cat}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                className="input-field w-full"
                placeholder="Enter amount"
                value={expenseData.amount}
                onChange={(e) =>
                  setExpenseData({ ...expenseData, amount: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Description
              </label>
              <input
                type="text"
                className="input-field w-full"
                placeholder="e.g., Coffee, Auto, Netflix, etc."
                value={expenseData.description}
                onChange={(e) =>
                  setExpenseData({
                    ...expenseData,
                    description: e.target.value,
                  })
                }
                required
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              "Saving..."
            ) : (
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} />
                Save Expense
              </span>
            )}
          </button>
        </form>
      </div>

      {/* Add Income */}
      <div className="glass-card">
        <h2 className="text-2xl font-semibold mb-6">💰 Add Income</h2>
        <form onSubmit={handleAddIncome} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm text-gray-400 mb-2">Date</label>
              <input
                type="date"
                className="input-field w-full"
                value={incomeData.date}
                onChange={(e) =>
                  setIncomeData({ ...incomeData, date: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">Source</label>
              <input
                type="text"
                className="input-field w-full"
                placeholder="e.g., Salary, Blessings, Gifts, Freelancing"
                value={incomeData.category}
                onChange={(e) =>
                  setIncomeData({ ...incomeData, category: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Amount (₹)
              </label>
              <input
                type="number"
                min="0"
                className="input-field w-full"
                placeholder="Enter amount"
                value={incomeData.amount}
                onChange={(e) =>
                  setIncomeData({ ...incomeData, amount: e.target.value })
                }
                required
              />
            </div>
            <div>
              <label className="block text-sm text-gray-400 mb-2">
                Description (optional)
              </label>
              <input
                type="text"
                className="input-field w-full"
                placeholder="Any notes..."
                value={incomeData.description}
                onChange={(e) =>
                  setIncomeData({ ...incomeData, description: e.target.value })
                }
              />
            </div>
          </div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? (
              "Saving..."
            ) : (
              <span className="flex items-center gap-2">
                <FontAwesomeIcon icon={faPlus} />
                Save Income
              </span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}

