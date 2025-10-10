import { useState } from "react";

function ForgotPasswordPage({ onBackToLogin }) {
  const [userId, setUserId] = useState("");
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  const handleVerifyUser = () => {
    // TODO: Match userId + emailOrMobile with backend
    if (userId && emailOrMobile) {
      setOtpSent(true);
    } else {
      alert("❌ User ID and Mobile/Email not matching");
    }
  };

  const handleReset = () => {
    // TODO: Reset password backend API
    alert("✅ Password reset successful");
    onBackToLogin();
  };

  return (
    <div className="forgot-container">
      <h2>Forgot Password</h2>
      {!otpSent ? (
        <>
          <div className="flex flex-col items-center space-y-2 mt-2" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', border: '0px solid #ccc', paddingLeft: '400px', borderRadius: '10px' }}>
          <input placeholder="User ID" value={userId} onChange={(e) => setUserId(e.target.value)} />
          </div>
          <div className="flex flex-col items-center space-y-2 mt-2" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', border: '0px solid #ccc', paddingLeft: '400px', borderRadius: '10px' }}>
          <input placeholder="Mobile or Email" value={emailOrMobile} onChange={(e) => setEmailOrMobile(e.target.value)} />
          </div>
          <div className="flex flex-col items-center space-y-2 mt-2" style={{ marginBottom: '10px', display: 'flex', alignItems: 'center', flexWrap: 'wrap', border: '0px solid #ccc', paddingLeft: '400px', borderRadius: '10px' }}>
          <button onClick={handleVerifyUser}>Send OTP</button>
          <button onClick={onBackToLogin}>Back to Login</button>
          </div>
        </>
      ) : (
        <>
          <p>📩 OTP sent to your registered mobile/email</p>
          <input placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} />
          <button onClick={handleReset}>Reset Password</button>
        </>
      )}
    </div>
  );
}

export default ForgotPasswordPage;
