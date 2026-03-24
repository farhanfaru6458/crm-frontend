import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./ForgotPassword.module.css";
import axiosInstance from "../../../services/axiosInstance";
export default function ForgotPassword() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const validate = () => {
    if (!email.trim()) {
      setError("Email is required");
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError("Email is invalid");
      return false;
    }
    setError("");
    return true;
  };



  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validate()) {
      try {
        const res = await axiosInstance.post(
          "/auth/forgot-password",
          { email }
        );

        setSuccess(res.data.message);

        setTimeout(() => {
          navigate(`/reset-password/${email}`);
        }, 1500);

      } catch (err) {
        setError(err.response?.data?.message || "Something went wrong");
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Forgot Password</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {success && (
            <div className={styles.success}>
              {success}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your registered email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value);
                setError("");
                setSuccess("");
              }}
              className={error ? styles.invalid : ""}
            />
            {error && <span className={styles.errorText}>{error}</span>}
          </div>

          <button type="submit" className={styles.button}>
            Send OTP
          </button>
        </form>

        <p className={styles.backText}>
          Remember your password?{" "}
          <Link to="/login" className={styles.link}>
            Back to Login
          </Link>
        </p>
      </div>
    </div>
  );
}
