import React from "react";
import styles from "./LeadForm.module.css";

const LeadForm = ({ formData, onChange }) => {
    const fields = [
        { name: "name", label: "Lead Name", placeholder: "Enter lead name", required: true },
        { name: "email", label: "Email", placeholder: "Enter email", type: "email", required: true },
        { name: "phone", label: "Phone", placeholder: "Enter phone number" },
        { name: "company", label: "Company", placeholder: "Enter company name" },
        { name: "jobTitle", label: "Job Title", placeholder: "Enter job title" },
        { name: "status", label: "Status", type: "select", options: ["New", "Contacted", "Qualified", "Converted", "Unqualified"] },
        { name: "owner", label: "Owner", placeholder: "Enter owner name" },
        { name: "city", label: "City", placeholder: "Enter city" },
        { name: "country", label: "Country", placeholder: "Enter country" },
    ];

    return (
        <div className={styles.form}>
            {fields.map((field) => (
                <div key={field.name} className={styles.field}>
                    <label className={styles.label}>
                        {field.label} {field.required && <span className={styles.required}>*</span>}
                    </label>
                    {field.type === "select" ? (
                        <select
                            className={styles.select}
                            value={formData[field.name] || ""}
                            onChange={(e) => onChange(field.name, e.target.value)}
                            disabled={field.name === "status" && formData[field.name] === "Converted"}
                        >
                            <option value="">Select {field.label}</option>
                            {field.options.map((opt) => (
                                <option key={opt} value={opt}>
                                    {opt}
                                </option>
                            ))}
                        </select>
                    ) : (
                        <input
                            type={field.type || "text"}
                            className={styles.input}
                            placeholder={field.placeholder}
                            value={formData[field.name] || ""}
                            onChange={(e) => onChange(field.name, e.target.value)}
                        />
                    )}
                </div>
            ))}
        </div>
    );
};

export default LeadForm;
