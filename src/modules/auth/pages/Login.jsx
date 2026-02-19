import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Login.module.css";
import { Eye, EyeOff } from "lucide-react";

import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    let newErrors = {};

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.password) {
      newErrors.password = "Password is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setSubmitError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const res = login(formData.email, formData.password);
      if (res.success) {
        navigate("/dashboard");
      } else {
        setSubmitError(res.error);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Log in</h2>

        <form className={styles.form} onSubmit={handleSubmit}>
          {submitError && (
            <div
              style={{
                color: "#dc2626",
                marginBottom: "15px",
                backgroundColor: "#fee2e2",
                padding: "10px",
                borderRadius: "6px",
                fontSize: "14px",
              }}
            >
              {submitError}
            </div>
          )}

          <div className={styles.inputGroup}>
            <label>Email</label>
            <div className={styles.inputWrapper}>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.invalid : ""}
              />
            </div>
            {errors.email && <span className={styles.errorText}>{errors.email}</span>}
          </div>


          <div className={styles.inputGroup}>
            <div className={styles.passwordLabel}>
              <label>Password</label>
              <Link to="/forgot-password" className={styles.forgot}>
                Forgot password?
              </Link> 
            </div>

            <div className={styles.inputWrapper}>
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Enter your password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? styles.invalid : ""}
              />
              <button
                type="button"
                className={styles.eyeButton}
                onClick={() => setShowPassword(!showPassword)}
                style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer', position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)' }}
              >
                {showPassword ? <EyeOff size={18} className={styles.eyeIcon} /> : <Eye size={18} className={styles.eyeIcon} />}
              </button>
            </div>
            {errors.password && <span className={styles.errorText}>{errors.password}</span>}
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
