import { useState } from "react";
import { axiosInstance } from "../lib/axios";
import toast from "react-hot-toast";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowRightToBracket, faUnlockKeyhole, faUserPlus } from "@fortawesome/free-solid-svg-icons";

export default function AuthPage({ onLogin }) {
  const [activeTab, setActiveTab] = useState("login");
  const [loading, setLoading] = useState(false);

  // Login form
  const [loginData, setLoginData] = useState({
    username: "",
    password: "",
  });

  // Register form
  const [registerData, setRegisterData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    sec_question: "",
    sec_answer: "",
  });

  // Password reset form
  const [resetData, setResetData] = useState({
    username: "",
    sec_answer: "",
    new_password: "",
    confirm_password: "",
  });

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!loginData.username || !loginData.password) {
      toast.error("Please enter both username and password!");
      return;
    }
    if (loginData.username.length < 3) {
      toast.error("Username must be at least 3 characters!");
      return;
    }
    if (loginData.password.length < 4) {
      toast.error("Password must be at least 4 characters!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/login", loginData);
      if (response.status === 200) {
        toast.success(`Logged in as ${response.data.username}!!`);
        onLogin(response.data);
      }
    } catch (error) {
      toast.error(
        error.response?.data?.detail || "Invalid username or password!"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (
      !registerData.username ||
      !registerData.password ||
      !registerData.confirmPassword ||
      !registerData.sec_answer
    ) {
      toast.error("All fields are required!");
      return;
    }
    if (registerData.username.length < 3) {
      toast.error("Username must be at least 3 characters!");
      return;
    }
    if (registerData.password.length < 4) {
      toast.error("Password must be at least 4 characters!");
      return;
    }
    if (registerData.password !== registerData.confirmPassword) {
      toast.error("Passwords do not match!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/register", {
        username: registerData.username,
        password: registerData.password,
        sec_question: registerData.sec_question,
        sec_answer: registerData.sec_answer,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setActiveTab("login");
        setRegisterData({
          username: "",
          password: "",
          confirmPassword: "",
          sec_question: "",
          sec_answer: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Registration failed!");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (
      !resetData.username ||
      !resetData.sec_answer ||
      !resetData.new_password ||
      !resetData.confirm_password
    ) {
      toast.error("All fields are required!");
      return;
    }
    if (resetData.new_password !== resetData.confirm_password) {
      toast.error("New passwords do not match!");
      return;
    }
    if (resetData.new_password.length < 4) {
      toast.error("New password must be at least 4 characters!");
      return;
    }

    setLoading(true);
    try {
      const response = await axiosInstance.post("/auth/reset-password", {
        username: resetData.username,
        sec_answer: resetData.sec_answer,
        new_password: resetData.new_password,
      });
      if (response.status === 200) {
        toast.success(response.data.message);
        setResetData({
          username: "",
          sec_answer: "",
          new_password: "",
          confirm_password: "",
        });
      }
    } catch (error) {
      toast.error(error.response?.data?.detail || "Password reset failed!");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Left: Title + Features */}
        <div className="glass-card">
          <div className="app-title mb-4">Smart Expense Tracker</div>
          <p className="text-gray-400 mb-6">
            Track income & expenses with DSA-powered analytics and secure login.
          </p>
          <ul className="space-y-2 text-gray-300">
            <li>• 💾 Multi-user login with MySQL storage</li>
            <li>• 🔐 Hashed passwords + security question (forgot password)</li>
            <li>• 💸 Track expenses and incomes separately</li>
            <li>• 📊 Analytics: pie, bar, trends, heatmap, forecast</li>
            <li>• 🧠 DSA: Trie (search), Heap (top N), Stack (undo), Hashing</li>
            <li>• 🎯 Budget & savings goal per user with alerts</li>
          </ul>
        </div>

        {/* Right: Login / Register Tabs */}
        <div className="glass-card">
          <div className="flex border-b border-gray-700 mb-6">
            <button
              onClick={() => setActiveTab("login")}
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === "login"
                  ? "border-b-2 border-blue-400 text-blue-400"
                  : "text-gray-400"
              }`}
            >
              🔐 Login
            </button>
            <button
              onClick={() => setActiveTab("register")}
              className={`flex-1 py-2 px-4 text-center ${
                activeTab === "register"
                  ? "border-b-2 border-blue-400 text-blue-400"
                  : "text-gray-400"
              }`}
            >
              🆕 Register
            </button>
          </div>

          {/* Login Tab */}
          {activeTab === "login" && (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter your username"
                  className="input-field w-full"
                  value={loginData.username}
                  onChange={(e) =>
                    setLoginData({ ...loginData, username: e.target.value })
                  }
                />
              </div>
              <div>
                <input
                  type="password"
                  placeholder="Enter your password"
                  className="input-field w-full"
                  value={loginData.password}
                  onChange={(e) =>
                    setLoginData({ ...loginData, password: e.target.value })
                  }
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  "Logging in..."
                ) : (
                  <span>
                    <FontAwesomeIcon icon={faArrowRightToBracket} />
                    &nbsp;&nbsp;Login
                  </span>
                )}
              </button>

              {/* Forgot Password */}
              <details className="mt-4">
                <summary className="cursor-pointer text-sm text-gray-400 hover:text-gray-300">
                  Forgot password?
                </summary>
                <div className="mt-4 space-y-3 p-4 bg-gray-900/50 rounded-lg">
                  <input
                    type="text"
                    placeholder="Registered username"
                    className="input-field w-full"
                    value={resetData.username}
                    onChange={(e) =>
                      setResetData({ ...resetData, username: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="Security answer"
                    className="input-field w-full"
                    value={resetData.sec_answer}
                    onChange={(e) =>
                      setResetData({ ...resetData, sec_answer: e.target.value })
                    }
                  />
                  <input
                    type="password"
                    placeholder="New password"
                    className="input-field w-full"
                    value={resetData.new_password}
                    onChange={(e) =>
                      setResetData({
                        ...resetData,
                        new_password: e.target.value,
                      })
                    }
                  />
                  <input
                    type="password"
                    placeholder="Confirm new password"
                    className="input-field w-full"
                    value={resetData.confirm_password}
                    onChange={(e) =>
                      setResetData({
                        ...resetData,
                        confirm_password: e.target.value,
                      })
                    }
                  />
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    disabled={loading}
                    className="btn-primary w-full"
                  >
                    <FontAwesomeIcon icon={faUnlockKeyhole} />
                    &nbsp;&nbsp;Reset Password
                  </button>
                </div>
              </details>
            </form>
          )}

          {/* Register Tab */}
          {activeTab === "register" && (
            <form onSubmit={handleRegister} className="space-y-4">
              <input
                type="text"
                placeholder="Choose a username (Min 3 characters)"
                className="input-field w-full"
                value={registerData.username}
                onChange={(e) =>
                  setRegisterData({ ...registerData, username: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Choose a password (Min 4 characters)"
                className="input-field w-full"
                value={registerData.password}
                onChange={(e) =>
                  setRegisterData({ ...registerData, password: e.target.value })
                }
              />
              <input
                type="password"
                placeholder="Confirm password"
                className="input-field w-full"
                value={registerData.confirmPassword}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    confirmPassword: e.target.value,
                  })
                }
              />
              <select
                className="input-field w-full"
                value={registerData.sec_question}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    sec_question: e.target.value,
                  })
                }
              >
                <option value="">Select security question</option>
                <option value="Your favourite teacher's name?">
                  Your favourite teacher's name?
                </option>
                <option value="Your first school name?">
                  Your first school name?
                </option>
                <option value="Your favourite colour?">
                  Your favourite colour?
                </option>
              </select>
              <input
                type="text"
                placeholder="Security answer (Used to reset password)"
                className="input-field w-full"
                value={registerData.sec_answer}
                onChange={(e) =>
                  setRegisterData({
                    ...registerData,
                    sec_answer: e.target.value,
                  })
                }
              />
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full"
              >
                {loading ? (
                  "Registering..."
                ) : (
                  <span>
                    <FontAwesomeIcon icon={faUserPlus} />
                    &nbsp;&nbsp;Register
                  </span>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
