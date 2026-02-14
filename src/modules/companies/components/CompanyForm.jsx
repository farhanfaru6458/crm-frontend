import React from "react";
import styles from "./CompanyForm.module.css";

const CompanyForm = ({ formData, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    return (
        <form className={styles.form}>
            <div className={styles.field}>
                <label className={styles.label}>Domain Name *</label>
                <input
                    type="text"
                    name="domain"
                    className={styles.input}
                    placeholder="Enter"
                    value={formData.domain || ""}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Company Name *</label>
                <input
                    type="text"
                    name="name"
                    className={styles.input}
                    placeholder="Enter"
                    value={formData.name || ""}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Company Owner *</label>
                <input
                    type="text"
                    name="owner"
                    className={styles.input}
                    placeholder="Enter"
                    value={formData.owner || ""}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Industry *</label>
                    <select
                        name="industry"
                        className={styles.select}
                        value={formData.industry || ""}
                        onChange={handleChange}
                    >
                        <option value="">Choose</option>
                        <option value="Real Estate">Real Estate</option>
                        <option value="Technology">Technology</option>
                        <option value="Legal Services">Legal Services</option>
                        <option value="Healthcare">Healthcare</option>
                        <option value="Finance">Finance</option>
                    </select>
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Type *</label>
                    <select
                        name="type"
                        className={styles.select}
                        value={formData.type || ""}
                        onChange={handleChange}
                    >
                        <option value="">Choose</option>
                        <option value="Client">Client</option>
                        <option value="Partner">Partner</option>
                        <option value="Vendor">Vendor</option>
                    </select>
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>City</label>
                    <input
                        type="text"
                        name="city"
                        className={styles.input}
                        placeholder="Enter"
                        value={formData.city || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Country/Region</label>
                    <input
                        type="text"
                        name="country"
                        className={styles.input}
                        placeholder="Enter"
                        value={formData.country || ""}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>No of Employees</label>
                    <input
                        type="text"
                        name="employees"
                        className={styles.input}
                        placeholder="Enter"
                        value={formData.employees || ""}
                        onChange={handleChange}
                    />
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Annual Revenue</label>
                    <input
                        type="text"
                        name="revenue"
                        className={styles.input}
                        placeholder="Enter"
                        value={formData.revenue || ""}
                        onChange={handleChange}
                    />
                </div>
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Phone Number *</label>
                <div className={styles.phoneInput}>
                    <div className={styles.flagSelector}>
                        <span className={styles.flag}>🇮🇳</span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={styles.chevron}
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="m19.5 8.25-7.5 7.5-7.5-7.5"
                            />
                        </svg>
                    </div>
                    <input
                        type="tel"
                        name="phone"
                        className={styles.input}
                        placeholder="Enter"
                        value={formData.phone || ""}
                        onChange={handleChange}
                    />
                </div>
            </div>
        </form>
    );
};

export default CompanyForm;
