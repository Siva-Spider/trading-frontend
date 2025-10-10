import { useState, useEffect } from "react";
import LoginPage from "./components/LoginPage";
import RegisterPage from "./components/RegisterPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import TradingApp from "./TradingApp";
import AdminDashboard from "./components/AdminDashboard";
import './App.css';

function App() {
  const [page, setPage] = useState("login");
  const [user, setUser] = useState(null);

  // Restore login on page refresh
  useEffect(() => {
    const storedUser = localStorage.getItem("loggedInUser");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setPage(parsedUser.role === "admin" ? "admin" : "trading");
    }
  }, []);

  // When login succeeds
  const handleLoginSuccess = (userData) => {
    localStorage.setItem("loggedInUser", JSON.stringify(userData));
    setUser(userData);
    setPage(userData.role === "admin" ? "admin" : "trading");
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem("loggedInUser");
    setUser(null);
    setPage("login");
  };

  // Page navigation logic
  if (!user) {
    if (page === "login")
      return (
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onRegisterClick={() => setPage("register")}
          onForgotClick={() => setPage("forgot")}
        />
      );
    if (page === "register")
      return <RegisterPage onBackToLogin={() => setPage("login")} />;
    if (page === "forgot")
      return <ForgotPasswordPage onBackToLogin={() => setPage("login")} />;
  }

  if (page === "admin")
    return <AdminDashboard user={user} onBackToLogin={handleLogout} />;

  // Trading app page
  return <TradingApp user={user} onLogout={handleLogout} />;
}

export default App;
