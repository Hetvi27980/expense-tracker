import { Link, useLocation } from "react-router-dom";
import { axiosInstance } from "../lib/axios";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket } from '@fortawesome/free-solid-svg-icons';

export default function Layout({ children, onLogout }) {
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await axiosInstance.post("/auth/logout");
      onLogout();
    } catch (error) {
      console.error("Logout error:", error);
    }
  };

  const navLinks = [
    { path: "/dashboard", label: "🏠 Dashboard", icon: "🏠" },
    { path: "/add-transaction", label: "📝 Add Expense / Income", icon: "📝" },
    {
      path: "/manage-transactions",
      label: "🧾 Manage Transactions",
      icon: "🧾",
    },
    { path: "/analytics", label: "📊 Analytics", icon: "📊" },
    { path: "/profile", label: "👤 Profile", icon: "👤" },
  ];

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <nav className="sidebar w-72 shrink-0">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-200 mb-4">
            🧭 Navigation
          </h2>
          <ul className="space-y-2">
            {navLinks.map((link) => (
              <li key={link.path}>
                <Link
                  to={link.path}
                  className={`nav-link ${
                    location.pathname === link.path ? "active" : ""
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-auto pt-8 border-t border-gray-700">
          <button onClick={handleLogout} className="btn-primary w-full">
            <FontAwesomeIcon icon={faArrowRightFromBracket} />
            &nbsp;&nbsp;Logout
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8">{children}</main>
    </div>
  );
}
