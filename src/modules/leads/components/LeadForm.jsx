import React, { useState, useEffect } from "react";
import { Mail, ChevronDown } from "lucide-react";
import styles from "./LeadForm.module.css";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import CustomSelect from "../../../components/ui/CustomSelect/CustomSelect";

const LeadForm = ({ formData, onChange, errors = {} }) => {
    const { user } = useAuth();
    const [owners, setOwners] = useState([]);
    const statuses = ["New", "Contacted", "Qualified", "Converted", "Unqualified"];

    useEffect(() => {
        const fetchUsers = async () => {
            if (user?.role === 'admin') {
                const token = localStorage.getItem('crm_token') || sessionStorage.getItem('crm_token');
                try {
                    const res = await axios.get("https://crm-backend-5yxt.onrender.com/api/users", {
                        headers: { Authorization: `Bearer ${token}` }
                    });
                    const formattedOwners = res.data.map(u => `${u.firstName} ${u.lastName}`);
                    setOwners(formattedOwners);
                } catch (e) {
                    console.error(e);
                    setOwners([`${user.firstName} ${user.lastName}`]);
                }
            } else if (user) {
                setOwners([`${user.firstName} ${user.lastName}`]);
            }
        };
        fetchUsers();
    }, [user]);

    const handleSelectChange = (field, value) => {
        onChange(field, value);
    };

    return (
        <div className={styles.formContainer}>
            <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                {/* Email Field */}
                <div className={styles.field}>
                    <label className={styles.label}>
                        Email <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.inputWrapper}>
                        <Mail className={styles.inputIcon} size={20} />
                        <input
                            type="email"
                            className={`${styles.inputWithIcon} ${errors.email ? styles.errorInput : ""}`}
                            placeholder="Enter"
                            value={formData.email || ""}
                            onChange={(e) => onChange("email", e.target.value)}
                            required
                        />
                    </div>
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>

                {/* First Name Field */}
                <div className={styles.field}>
                    <label className={styles.label}>
                        First Name <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        className={`${styles.input} ${errors.firstName ? styles.errorInput : ""}`}
                        placeholder="Enter"
                        value={formData.firstName || ""}
                        onChange={(e) => onChange("firstName", e.target.value)}
                        required
                    />
                    {errors.firstName && <span className={styles.errorText}>{errors.firstName}</span>}
                </div>

                {/* Last Name Field */}
                <div className={styles.field}>
                    <label className={styles.label}>
                        Last Name <span className={styles.required}>*</span>
                    </label>
                    <input
                        type="text"
                        className={`${styles.input} ${errors.lastName ? styles.errorInput : ""}`}
                        placeholder="Enter"
                        value={formData.lastName || ""}
                        onChange={(e) => onChange("lastName", e.target.value)}
                        required
                    />
                    {errors.lastName && <span className={styles.errorText}>{errors.lastName}</span>}
                </div>

                {/* Phone Number Field */}
                <div className={styles.field}>
                    <label className={styles.label}>
                        Phone Number <span className={styles.required}>*</span>
                    </label>
                    <div className={styles.phoneInput}>
                        <div className={styles.flagSelector}>
                            <img src="https://flagcdn.com/w20/in.png" alt="IN" className={styles.flagIcon} />
                            <ChevronDown size={14} className={styles.chevronIcon} />
                        </div>
                        <input
                            type="tel"
                            className={`${styles.input} ${errors.phone ? styles.errorInput : ""}`}
                            placeholder="Enter"
                            value={formData.phone || ""}
                            onChange={(e) => onChange("phone", e.target.value)}
                            required
                        />
                    </div>
                    {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
                </div>

                {/* Job Title Field */}
                <div className={styles.field}>
                    <label className={styles.label}>Job Title</label>
                    <input
                        type="text"
                        className={styles.input}
                        placeholder="Enter"
                        value={formData.jobTitle || ""}
                        onChange={(e) => onChange("jobTitle", e.target.value)}
                    />
                </div>

                {/* Contact Owner Multi Selector */}
                <div className={styles.field}>
                    <CustomSelect
                        label="Contact Owner"
                        name="owner"
                        value={formData.owner || []}
                        options={owners}
                        isMulti={true}
                        onChange={handleSelectChange}
                    />
                </div>

                {/* Lead Status Field */}
                <div className={styles.field}>
                    <CustomSelect
                        label="Lead Status"
                        name="status"
                        value={formData.status || ""}
                        options={statuses}
                        onChange={handleSelectChange}
                        error={errors.status}
                    />
                </div>
            </form>
        </div>
    );
};

export default LeadForm;
