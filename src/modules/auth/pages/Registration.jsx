import { Link } from "react-router-dom";
import styles from "./Registration.module.css";

export default function Registration() {
  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register</h2>

        <form className={styles.form}>
          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>First Name</label>
              <input type="text" placeholder="Enter your first name" />
            </div>

            <div className={styles.inputGroup}>
              <label>Last Name</label>
              <input type="text" placeholder="Enter your last name" />
            </div>
          </div>

          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input type="email" placeholder="Enter your email" />
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input type="tel" placeholder="Enter your phone number" />
            </div>
          </div>

          
          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Company Name</label>
              <input type="text" placeholder="Enter your company name" />
            </div>

            <div className={styles.inputGroup}>
              <label>Industry Type</label>
              <select>
                <option>Choose</option>
                <option>IT</option>
                <option>Finance</option>
                <option>Healthcare</option>
              </select>
            </div>
          </div>

          
          <div className={styles.inputGroupFull}>
            <label>Country or Region</label>
            <input type="text" placeholder="Enter your country or region" />
          </div>

          <button type="submit" className={styles.button}>
            Register
          </button>
        </form>
      </div>

      <p className={styles.loginText}>
        Already have an account?{" "}
        <Link to="/login" className={styles.link}>
          Login
        </Link>
      </p>
    </div>
  );
}
