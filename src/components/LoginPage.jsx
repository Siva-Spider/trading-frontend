import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

function LoginPage({ onLoginSuccess, onRegisterClick, onForgotClick }) {
  const [userId, setUserId] = useState("");
  const [role, setRole] = useState("user"); // default: user
  const [passwordInput, setPasswordInput] = useState("");
  const [passwordVisible, setPasswordVisible] = useState(false); // 👈 toggle state


  const handleSubmit = (e) => {
  e.preventDefault();

  if (!userId || !passwordInput) {
    alert("Please enter User ID and Password");
    return;
  }

  fetch("http://127.0.0.1:5000/api/login", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username: userId, password: passwordInput, role }),
  })
    .then((res) => res.json())
    .then((data) => {
        console.log("Backend response:", data);
    if (data.success) {
      const userData = { username: data.username, role: data.role };
        // ✅ Save to localStorage
        localStorage.setItem("loggedInUser", JSON.stringify(userData));
        onLoginSuccess(userData);
    } else {
        alert("Login failed: " + data.message);
    }
    })
    .catch((err) => {
    console.error("Login error:", err);
    alert("Login error, please try again");
    });
};


  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900">
      {/* Header same as TradingApp */}
      <header className="app-header flex flex-col items-center mb-6">
        <img
          src="/astya_vyuha_logo.png"
          alt="Logo"
          className="app-logo w-20 h-20 mb-2"
        />
        <h1 className="text-3xl font-bold text-white">ASTA VYUHA</h1>
      </header>

      {/* User ID Input */}
      <div
        style={{
          marginBottom: "10px",
          display: "flex",
          alignItems: "center",
          flexWrap: "wrap",
          border: "0px solid #ccc",
          padding: "250px",
          borderRadius: "10px",
        }}
      >
        <form
          onSubmit={handleSubmit}
          className="flex flex-col items-center space-y-4 w-full max-w-xs"
        >
          {/* Role selection */}
          <div className="flex space-x-6 text-white mt-2">
            <label>
              <input
                type="radio"
                value="user"
                checked={role === "user"}
                onChange={() => setRole("user")}
              />{" "}
              User
            </label>
            <label>
              <input
                type="radio"
                value="admin"
                checked={role === "admin"}
                onChange={() => setRole("admin")}
              />{" "}
              Admin
            </label>
          </div>

          <input
            type="text"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
          />

          <div className="flex flex-col items-center space-y-2 mt-2">
            {/* Password */}
            <input
              type={passwordVisible ? "text" : "password"}
              placeholder="Password"
              value={passwordInput}
              onChange={(e) => setPasswordInput(e.target.value)}
              className="w-full p-3 rounded bg-gray-700 text-white focus:outline-none"
            />

            {/* Login Button */}
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white py-2 rounded"
            >
              Login
            </button>
          </div>

          {/* Register and Forgot Password */}
          <div className="flex flex-col items-center space-y-2 mt-2">
            <button
              type="button"
              className="text-sm text-blue-400 hover:underline"
              onClick={onRegisterClick}
            >
              Register
            </button>
            <button
              type="button"
              className="text-sm text-blue-400 hover:underline"
              onClick={onForgotClick}
            >
              Forgot Password
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default LoginPage;
