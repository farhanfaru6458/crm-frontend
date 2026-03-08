import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Registration.module.css";

import { useAuth } from "../../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { countries } from "../../../utils/countries";
import CustomSelect from "../../../components/ui/CustomSelect/CustomSelect";

export default function Registration() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    company: "",
    industry: "",
    password: "",
    confirmPassword: "",
    country: "",
  });

  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  const validate = () => {
    let newErrors = {};

    if (!formData.firstName.trim()) newErrors.firstName = "First Name is required";
    if (!formData.lastName.trim()) newErrors.lastName = "Last Name is required";

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/\S+@\S+\.\S+/.test(formData.email.replace(/^admin/, ""))) {
      newErrors.email = "Email is invalid";
    }

    if (!formData.phone.trim()) newErrors.phone = "Phone Number is required";
    if (!formData.company.trim()) newErrors.company = "Company Name is required";
    if (!formData.industry || formData.industry === "Choose") newErrors.industry = "Industry Type is required";

    if (!formData.password) {
      newErrors.password = "Password is required";
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!formData.confirmPassword) {
      newErrors.confirmPassword = "Confirm Password is required";
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (!formData.country.trim()) newErrors.country = "Country is required";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user types
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: "" });
    }
    setSubmitError("");
  };

  const handleSelectChange = (name, value) => {
    setFormData({ ...formData, [name]: value });
    if (errors[name]) {
      setErrors({ ...errors, [name]: "" });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validate()) {
      let emailToSend = formData.email;
      let role = "user";

      if (formData.email.toLowerCase().startsWith("admin")) {
        role = "admin";
        emailToSend = formData.email.substring(5); // Remove "admin" prefix
      }

      const payload = {
        ...formData,
        email: emailToSend,
        role: role
      };

      const res = await register(payload);
      if (res.success) {
        navigate(`/verify-otp`, { state: { email: emailToSend } });
      } else {
        setSubmitError(res.error);
      }
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.card}>
        <h2 className={styles.title}>Register</h2>

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

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>First Name</label>
              <input
                type="text"
                name="firstName"
                placeholder="Enter your first name"
                value={formData.firstName}
                onChange={handleChange}
                className={errors.firstName ? styles.invalid : ""}
              />
              {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Last Name</label>
              <input
                type="text"
                name="lastName"
                placeholder="Enter your last name"
                value={formData.lastName}
                onChange={handleChange}
                className={errors.lastName ? styles.invalid : ""}
              />
              {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
            </div>
          </div>


          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Email</label>
              <input
                type="email"
                name="email"
                placeholder="Enter your email"
                value={formData.email}
                onChange={handleChange}
                className={errors.email ? styles.invalid : ""}
              />
              {errors.email && <span className={styles.errorText}>{errors.email}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Phone Number</label>
              <input
                type="tel"
                name="phone"
                placeholder="Enter your phone number"
                value={formData.phone}
                onChange={handleChange}
                className={errors.phone ? styles.invalid : ""}
              />
              {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
          </div>


          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Company Name</label>
              <input
                type="text"
                name="company"
                placeholder="Enter your company name"
                value={formData.company}
                onChange={handleChange}
                className={errors.company ? styles.invalid : ""}
              />
              {errors.company && <span className={styles.errorText}>{errors.company}</span>}
            </div>

            <div className={styles.inputGroup}>
              <CustomSelect
                label="Industry Type"
                value={formData.industry}
                onChange={(val) => handleSelectChange("industry", val)}
                options={["IT", "Finance", "Healthcare", "Retail", "Education"]}
                error={errors.industry}
              />
            </div>
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label>Password</label>
              <input
                type="password"
                name="password"
                placeholder="Enter password"
                value={formData.password}
                onChange={handleChange}
                className={errors.password ? styles.invalid : ""}
              />
              {errors.password && <span className={styles.errorText}>{errors.password}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label>Confirm Password</label>
              <input
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                className={errors.confirmPassword ? styles.invalid : ""}
              />
              {errors.confirmPassword && <span className={styles.errorText}>{errors.confirmPassword}</span>}
            </div>
          </div>


          <div className={styles.inputGroupFull}>
            <CustomSelect
              label="Country or Region"
              value={formData.country}
              onChange={(val) => handleSelectChange("country", val)}
              options={countries}
              error={errors.country}
            />
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
