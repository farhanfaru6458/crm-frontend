import { useState, useRef } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { ShieldCheck, Eye, EyeOff } from "lucide-react";
import styles from "./ResetPassword.module.css";

export default function ResetPassword() {
  const { email } = useParams();
  const navigate = useNavigate();

  const [otp, setOtp] = useState(Array(6).fill(""));
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState({ type: "", message: "" });
  const inputRefs = useRef([]);

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");

    if (otpValue.length < 6) {
      return setStatus({ type: "error", message: "Enter complete 6-digit OTP" });
    }

    if (newPassword.length < 6) {
      return setStatus({ type: "error", message: "Password must be at least 6 characters" });
    }

    if (newPassword !== confirmPassword) {
      return setStatus({ type: "error", message: "Passwords do not match" });
    }

    try {
      const res = await axios.post(
        "http://localhost:5000/api/auth/reset-password",
        { email, otp: otpValue, newPassword }
      );

      setStatus({ type: "success", message: res.data.message });

      setTimeout(() => navigate("/login"), 2000);

    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Reset failed",
      });
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <ShieldCheck size={30} />
          </div>
          <h2>Reset Password</h2>
          <p>
            Enter the 6-digit code sent to<br />
            <strong>{email}</strong>
          </p>
        </div>

        {status.message && (
          <div className={`${styles.status} ${status.type === "error" ? styles.error : styles.success}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className={styles.otpContainer}>
            {otp.map((digit, idx) => (
              <input
                key={idx}
                ref={(el) => (inputRefs.current[idx] = el)}
                type="text"
                maxLength="1"
                value={digit}
                onChange={(e) => handleOtpChange(idx, e.target.value)}
                onKeyDown={(e) => handleKeyDown(idx, e)}
                className={styles.otpInput}
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <div className={styles.passwordWrapper}>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
            <span onClick={() => setShowPassword(!showPassword)}>
              {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
            </span>
          </div>

          <input
            type={showPassword ? "text" : "password"}
            placeholder="Confirm Password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className={styles.confirmInput}
          />

          <button type="submit" className={styles.button}>
            Reset Password
          </button>
        </form>
      </div>
    </div>
  );
}
