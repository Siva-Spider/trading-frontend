import { useState } from "react";

function RegisterPage({ onBackToLogin }) {
  const [form, setForm] = useState({
    firstName: "",
    secondName: "",
    thirdName: "",
    dob: "",
    email: "",
    mobile: "",
    pancard: "",
    userId: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // ✅ Password validation function
  const validatePassword = (password) => {
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[$@])[A-Za-z\d$@]{6,}$/;
    return regex.test(password);
  };

  const API_URL = "https://trading-backend-1-l859.onrender.com";
  
  const handleRegister = async (e) => {
    e.preventDefault();

   // ✅ Frontend validation
    if (form.password !== form.confirmPassword) {
      alert("❌ Passwords do not match");
      return;
    }

    if (form.password.length < 6) {
      alert("❌ Password must be at least 6 characters long");
      return;
    }
    // ✅ Password validation rules
    if (!validatePassword(form.password)) {
      alert(
        "❌ Password must have at least:\n- One uppercase letter\n- One lowercase letter\n- One number\n- One special character ($ or @)\n- Minimum 6 characters"
      );
      return;
    }

    try {
    // Send registration data to backend
    const response = await fetch(`${API_URL}/api/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        username: form.firstName + (form.secondName || "") + form.thirdName,
        userId: form.userId,
        email: form.email,
        mobilenumber: form.mobile,
        pancard: form.pancard,
        dob: form.dob,
        password: form.password,   // ✅ send password
        role: "user"  // or get from form if selectable
      }),
    });

    const result = await response.json();

    if (result.success) {
      // Optionally send welcome email
      await fetch(`${API_URL}/api/send-welcome-email`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: form.email, firstName: form.firstName }),
      });

      alert("✅ Registration submitted and email sent!");
      onBackToLogin();
    } else {
      alert(`❌ Registration failed: ${result.message}`);
    }
  } catch (err) {
    console.error(err);
    alert("❌ Registration failed due to server error");
  }
};
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>
        <form onSubmit={handleRegister} className="flex flex-col items-center">

          <div className="w-full flex justify-center mb-4">
            <input
              name="firstName"
              placeholder="First Name"
              required
              onChange={handleChange}
              className="w-3/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full flex justify-center mb-4">
            <input
              name="secondName"
              placeholder="Second Name (Optional)"
              onChange={handleChange}
              className="w-3/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full flex justify-center mb-4">
            <input
              name="thirdName"
              placeholder="Third Name"
              required
              onChange={handleChange}
              className="w-3/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full flex justify-center mb-4">
            <input
              type="date"
              name="dob"
              required
              onChange={handleChange}
              className="w-3/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full flex justify-center mb-4">
            <input
              type="email"
              name="email"
              placeholder="Email"
              required
              onChange={handleChange}
              className="w-3/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full flex justify-center mb-4">
            <input
              type="text"
              name="mobile"
              placeholder="Mobile Number"
              required
              onChange={handleChange}
              className="w-3/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="w-full flex justify-center mb-6">
            <input
              type="text"
              name="pancard"
              placeholder="PAN Card Number"
              required
              onChange={handleChange}
              className="w-3/4 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          {/* ✅ User ID */}
          <div className="w-full flex justify-center mb-6">
            <input
              type="text"
              name="userId"
              placeholder="User ID"
              required
              onChange={handleChange}
              className="w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Password */}
          <div className="w-full flex justify-center mb-4">
            <input
              type="password"
              name="password"
              placeholder="Password"
              required
              onChange={handleChange}
              className="w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Confirm Password */}
          <div className="w-full flex justify-center mb-6">
            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              required
              onChange={handleChange}
              className="w-3/4 p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center w-full">
            <button
              type="submit"
              className="flex-1 p-3 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
            >
              Register
            </button>
            <button
              type="button"
              onClick={onBackToLogin}
              className="flex-1 p-3 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400 transition"
            >
              Back to Login
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}

export default RegisterPage;
