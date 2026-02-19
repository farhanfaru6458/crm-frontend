import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "./ForgotPassword.module.css";

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

  const handleSubmit = (e) => {
    e.preventDefault();

    if (validate()) {
      // Simulate API call
      setTimeout(() => {
        setSuccess("Reset link sent to your email.");
      }, 500);
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
            Send Reset Link
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
