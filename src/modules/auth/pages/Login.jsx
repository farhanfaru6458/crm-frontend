import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import { Eye } from "lucide-react";

export default function Login() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Log in</h2>

        <form className={styles.form}>
         
          <div className={styles.inputGroup}>
            <label>Email</label>
            <div className={styles.inputWrapper}>
              <input type="email" placeholder="Enter your email" />
            </div>
          </div>

          
          <div className={styles.inputGroup}>
            <div className={styles.passwordLabel}>
              <label>Password</label>
              <span className={styles.forgot}>Forgot password?</span>
            </div>

            <div className={styles.inputWrapper}>
              <input type="password" placeholder="Enter your password" />
              <Eye size={18} className={styles.eyeIcon} />
            </div>
          </div>

          <button type="submit" className={styles.button}>
            Log in
          </button>
        </form>
      </div>
      <p className={styles.signupText}>
        Don’t have an account?{" "}
        <Link to="/register" className={styles.link}>
          Sign up
        </Link>
      </p>
    </div>
  );
}
