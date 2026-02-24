import { useState, useEffect } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRotateLeft,
  faBan,
  faFileArrowDown,
  faFloppyDisk,
  faPenToSquare,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";

export default function ManageTransactions() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingId, setEditingId] = useState(null);
  const [editData, setEditData] = useState(null);
  const [categories, setCategories] = useState([]);

  // Filters
  const [filters, setFilters] = useState({
    kind: "All",
    category: "All",
    start_date: "",
    end_date: new Date().toISOString().split("T")[0],
    search: "",
  });

  useEffect(() => {
    fetchTransactions();
    fetchCategories();
  }, [filters]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const params = {};
      if (filters.kind !== "All") params.kind = filters.kind.toLowerCase();
      if (filters.category !== "All") params.category = filters.category;
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;
      if (filters.search) params.search = filters.search;

      const response = await axiosInstance.get("/transactions", { params });
      if (response.status === 200) {
        setTransactions(response.data.transactions || []);
      }
    } catch (error) {
      toast.error("Failed to load transactions");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await axiosInstance.get("/transactions");
      if (response.status === 200) {
        const allTx = response.data.transactions || [];
        const uniqueCategories = [...new Set(allTx.map((t) => t.category))];
        setCategories(uniqueCategories.sort());
      }
    } catch (error) {
      console.error(error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this transaction?")) {
      return;
    }
    try {
      const response = await axiosInstance.delete(`/transactions/${id}`);
      if (response.status === 200) {
        toast.success("Transaction deleted! You can undo from above.");
        fetchTransactions();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to delete transaction"
      );
    }
  };

  const handleUndo = async () => {
    try {
      const response = await axiosInstance.post("/transactions/undo");
      if (response.status === 200) {
        toast.success("Last deleted transaction restored!");
        fetchTransactions();
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "No transaction to undo");
    }
  };

  const handleEdit = (transaction) => {
    setEditingId(transaction.id);
    setEditData({
      date: transaction.date,
      category: transaction.category,
      amount: transaction.amount,
      description: transaction.description,
      kind: transaction.kind,
    });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (parseFloat(editData.amount) <= 0) {
      toast.error("Amount should be greater than 0!");
      return;
    }
    if (!editData.description.trim()) {
      toast.error("Description cannot be empty!");
      return;
    }

    try {
      const response = await axiosInstance.put(`/transactions/${editingId}`, {
        date: editData.date,
        category: editData.category,
        amount: parseFloat(editData.amount),
        description: editData.description.trim(),
      });
      if (response.status === 200) {
        toast.success("Transaction updated!!");
        setEditingId(null);
        setEditData(null);
        fetchTransactions();
      }
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Failed to update transaction"
      );
    }
  };

  const handleDownload = async (format) => {
    try {
      const params = {};
      if (filters.start_date) params.start_date = filters.start_date;
      if (filters.end_date) params.end_date = filters.end_date;

      const response = await axiosInstance.get(`/reports/${format}`, {
        params,
        responseType: "blob",
      });
      const blob = new Blob([response.data]);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      const disposition = response.headers.get("content-disposition");
      const filename = disposition?.split("filename=")[1]?.replace(/"/g, "");
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      toast.success(`Report downloaded as ${format.toUpperCase()}`);
    } catch (error) {
      toast.error(`Failed to download ${format.toUpperCase()} report`);
    }
  };

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

  return (
    <div className="space-y-6">
      <div className="glass-card">
        <h2 className="text-2xl font-semibold mb-6">🧾 Manage Transactions</h2>

        {/* Undo Button */}
        <div className="mb-4">
          <button onClick={handleUndo} className="btn-primary">
            <FontAwesomeIcon icon={faArrowRotateLeft} />
            &nbsp;&nbsp;Undo last delete
          </button>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div>
            <label className="block text-sm text-gray-400 mb-2">Type</label>
            <select
              className="input-field w-full"
              value={filters.kind}
              onChange={(e) => setFilters({ ...filters, kind: e.target.value })}
            >
              <option value="All">All</option>
              <option value="Expense">Expense</option>
              <option value="Income">Income</option>
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">Category</label>
            <select
              className="input-field w-full"
              value={filters.category}
              onChange={(e) =>
                setFilters({ ...filters, category: e.target.value })
              }
            >
              <option value="All">All</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">
              From Date
            </label>
            <input
              type="date"
              className="input-field w-full"
              value={filters.start_date}
              onChange={(e) =>
                setFilters({ ...filters, start_date: e.target.value })
              }
            />
          </div>
          <div>
            <label className="block text-sm text-gray-400 mb-2">To Date</label>
            <input
              type="date"
              className="input-field w-full"
              value={filters.end_date}
              onChange={(e) =>
                setFilters({ ...filters, end_date: e.target.value })
              }
            />
          </div>
        </div>

        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            className="input-field w-full"
            placeholder="Search (description / category / type)"
            value={filters.search}
            onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          />
        </div>

        {/* Transactions List */}
        {loading ? (
          <div className="text-center py-8">Loading transactions...</div>
        ) : transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-400">
            No transactions found.
          </div>
        ) : (
          <div className="space-y-4">
            {transactions.map((tx) => (
              <div
                key={tx.id}
                className="bg-gray-900/50 p-4 rounded-lg border border-gray-800"
              >
                <div className="flex flex-wrap items-center gap-4">
                  <div className="flex-1 min-w-50">
                    <div className="font-semibold text-lg">
                      {tx.description || tx.category}
                    </div>
                    <div className="text-sm text-gray-400">
                      {new Date(tx.date).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex-1 min-w-50">
                    <div>
                      Type:{" "}
                      <span
                        className={`px-2 py-1 rounded text-sm ${
                          tx.kind === "income"
                            ? "bg-green-900/30 text-green-400"
                            : "bg-red-900/30 text-red-400"
                        }`}
                      >
                        {tx.kind === "income" ? "Income" : "Expense"}
                      </span>
                    </div>
                    <div className="text-sm text-gray-400">
                      Category: {tx.category}
                    </div>
                    <div className="font-semibold text-lg">
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
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(tx)}
                      className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faPenToSquare} />
                      &nbsp;Edit
                    </button>
                    <button
                      onClick={() => handleDelete(tx.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg"
                    >
                      <FontAwesomeIcon icon={faTrash} />
                      &nbsp;Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Edit Form */}
        {editingId && editData && (
          <div className="mt-6 p-4 bg-gray-900/50 rounded-lg border border-gray-800">
            <h3 className="text-xl font-semibold mb-4">
              ✏️ Edit Selected Transaction
            </h3>
            <form onSubmit={handleUpdate} className="space-y-4">
              <div className="text-sm text-gray-400">
                Type:{" "}
                <strong>
                  {editData.kind === "income" ? "Income" : "Expense"}
                </strong>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    className="input-field w-full"
                    value={editData.date}
                    onChange={(e) =>
                      setEditData({ ...editData, date: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    {editData.kind === "income"
                      ? "Source / Category"
                      : "Category"}
                  </label>
                  {editData.kind === "income" ? (
                    <input
                      type="text"
                      className="input-field w-full"
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                      required
                    />
                  ) : (
                    <select
                      className="input-field w-full"
                      value={editData.category}
                      onChange={(e) =>
                        setEditData({ ...editData, category: e.target.value })
                      }
                      required
                    >
                      {expenseCategories.map((cat) => (
                        <option key={cat} value={cat}>
                          {cat}
                        </option>
                      ))}
                    </select>
                  )}
                </div>
                <div>
                  <label className="block text-sm text-gray-400 mb-2">
                    Amount (₹)
                  </label>
                  <input
                    type="number"
                    min="0"
                    className="input-field w-full"
                    value={editData.amount}
                    onChange={(e) =>
                      setEditData({ ...editData, amount: e.target.value })
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
                    value={editData.description}
                    onChange={(e) =>
                      setEditData({ ...editData, description: e.target.value })
                    }
                    required
                  />
                </div>
              </div>
              <div className="flex gap-2">
                <button type="submit" className="btn-primary">
                  <FontAwesomeIcon icon={faFloppyDisk} />
                  &nbsp;Save Changes
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setEditingId(null);
                    setEditData(null);
                  }}
                  className="btn-primary"
                >
                  <FontAwesomeIcon icon={faBan} />
                  &nbsp;Cancel Edit
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Download Reports */}
        <div className="mt-6 flex gap-4">
          <button onClick={() => handleDownload("pdf")} className="btn-primary">
            <FontAwesomeIcon icon={faFileArrowDown} />
            &nbsp;Download PDF
          </button>
          <button onClick={() => handleDownload("csv")} className="btn-primary">
            <FontAwesomeIcon icon={faFileArrowDown} />
            &nbsp;Download CSV
          </button>
          <button
            onClick={() => handleDownload("excel")}
            className="btn-primary"
          >
            <FontAwesomeIcon icon={faFileArrowDown} />
            &nbsp;Download Excel
          </button>
        </div>
      </div>
    </div>
  );
}
