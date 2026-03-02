import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { ShieldCheck, Mail, ArrowLeft, RefreshCw } from "lucide-react";
import styles from "./VerifyOtp.module.css";

export default function VerifyOtp() {
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState(location.state?.email || "");
  const [otp, setOtp] = useState(Array(6).fill(""));
  const [status, setStatus] = useState({ type: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300);
  const inputRefs = useRef([]);

  useEffect(() => {
    if (!email && !location.state?.email) {
      navigate("/login");
    }
  }, [email, location.state, navigate]);

  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
      return () => clearInterval(timer);
    }
  }, [timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const handleOtpChange = (index, value) => {
    if (isNaN(value)) return;
    const newOtp = [...otp];
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    const otpValue = otp.join("");
    if (otpValue.length < 6) {
      setStatus({ type: "error", message: "Please enter the complete 6-digit code" });
      return;
    }

    setLoading(true);
    setStatus({ type: "", message: "" });

    try {
      const res = await axios.post("http://localhost:5000/api/auth/verify-otp", {
        email,
        otp: otpValue,
      });

      localStorage.setItem("crm_token", res.data.token);
      localStorage.setItem("crm_user", JSON.stringify(res.data.user));

      setStatus({ type: "success", message: "Verified successfully! Accessing portal..." });
      setTimeout(() => navigate("/dashboard"), 1500);
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Verification failed",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setStatus({ type: "", message: "" });
    try {
      await axios.post("http://localhost:5000/api/auth/resend-otp", { email });
      setStatus({ type: "success", message: "A new code has been sent to your email." });
      setTimeLeft(300);
      setOtp(Array(6).fill(""));
      inputRefs.current[0].focus();
    } catch (err) {
      setStatus({
        type: "error",
        message: err.response?.data?.message || "Failed to resend OTP",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.iconCircle}>
            <ShieldCheck size={32} />
          </div>
          <h2 className={styles.title}>Email Verification</h2>
          <p className={styles.subtitle}>
            Enter the 6-digit code sent to<br />
            <strong>{email}</strong>
          </p>
        </div>

        {status.message && (
          <div className={`${styles.statusMessage} ${status.type === "error" ? styles.statusError : styles.statusSuccess}`}>
            {status.message}
          </div>
        )}

        <form onSubmit={handleVerify}>
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
                disabled={timeLeft === 0 || loading}
                autoFocus={idx === 0}
              />
            ))}
          </div>

          <div className={`${styles.timerBox} ${timeLeft > 0 ? styles.timerActive : styles.timerExpired}`}>
            {timeLeft > 0 ? (
              <span>Verification code expires in {formatTime(timeLeft)}</span>
            ) : (
              <span>The code has expired</span>
            )}
          </div>

          <button
            type="submit"
            className={styles.button}
            disabled={loading || timeLeft === 0 || otp.join("").length < 6}
          >
            {loading ? <RefreshCw size={20} className={styles.spin} /> : "Verify & Continue"}
          </button>
        </form>

        <div className={styles.resendSection}>
          <span>Didn't receive code?</span>
          <button
            onClick={handleResend}
            disabled={loading || timeLeft > 60} // Allow resend after 4 mins
            className={styles.resendBtn}
          >
            {timeLeft > 60 ? `Wait ${Math.ceil((timeLeft - 60) / 60)}m to resend` : "Resend Now"}
          </button>
        </div>

        <button onClick={() => navigate("/register")} className={styles.resendBtn} style={{ marginTop: '20px', width: '100%', color: '#718096' }}>
          <ArrowLeft size={14} style={{ marginRight: '5px' }} /> Use a different email
        </button>
      </div>
    </div>
  );
}
