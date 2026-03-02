import React, { useState, useRef, useEffect } from "react";
import { Mail, ChevronDown, X } from "lucide-react";
import styles from "./LeadForm.module.css";

const LeadForm = ({ formData, onChange, errors = {} }) => {
    const owners = ["Jane Cooper", "Wade Warren", "Brooklyn Simmons", "Leslie Alexander", "Jenny Wilson", "Guy Hawkins", "Robert Fox", "Cameron Williamson"];
    const statuses = ["New", "Contacted", "Qualified", "Converted", "Unqualified"];

    const [isOwnerDropdownOpen, setIsOwnerDropdownOpen] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOwnerDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    const toggleOwner = (owner) => {
        const currentOwners = formData.owner || [];
        const newOwners = currentOwners.includes(owner)
            ? currentOwners.filter((o) => o !== owner)
            : [...currentOwners, owner];
        onChange("owner", newOwners);
    };

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
                    <label className={styles.label}>Contact Owner</label>
                    <div className={styles.customSelectWrapper} ref={dropdownRef}>
                        <div
                            className={styles.customSelect}
                            onClick={() => setIsOwnerDropdownOpen(!isOwnerDropdownOpen)}
                        >
                            {formData.owner && formData.owner.length > 0 ? (
                                <div className={styles.selectedTags}>
                                    {formData.owner.map(o => (
                                        <span key={o} className={styles.tag}>
                                            {o}
                                            <X
                                                size={12}
                                                onClick={(e) => { e.stopPropagation(); toggleOwner(o); }}
                                                className={styles.closeTag}
                                            />
                                        </span>
                                    ))}
                                </div>
                            ) : (
                                <span className={styles.placeholder}>Choose</span>
                            )}
                            <ChevronDown size={20} className={styles.selectChevron} />
                        </div>
                        {isOwnerDropdownOpen && (
                            <div className={styles.dropdownOptions}>
                                {owners.map(owner => (
                                    <div
                                        key={owner}
                                        className={`${styles.option} ${formData.owner?.includes(owner) ? styles.selectedOption : ""}`}
                                        onClick={() => toggleOwner(owner)}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={formData.owner?.includes(owner) || false}
                                            readOnly
                                            className={styles.checkbox}
                                        />
                                        {owner}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Lead Status Field */}
                <div className={styles.field}>
                    <label className={styles.label}>Lead Status</label>
                    <div className={styles.selectContainer}>
                        <select
                            className={styles.select}
                            value={formData.status || ""}
                            onChange={(e) => handleSelectChange("status", e.target.value)}
                        >
                            <option value="" disabled>Choose</option>
                            {statuses.map(status => (
                                <option key={status} value={status}>{status}</option>
                            ))}
                        </select>
                        <ChevronDown size={20} className={styles.selectChevronOverlay} />
                    </div>
                </div>
            </form>
        </div>
    );
};

export default LeadForm;
