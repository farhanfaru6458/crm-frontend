import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import styles from "./CompanyForm.module.css";
import { countries } from "../../../utils/countries";

import CustomSelect from "../../../components/ui/CustomSelect/CustomSelect";

const CompanyForm = ({ formData, onChange, errors = {} }) => {
    const { user } = useAuth();
    const [owners, setOwners] = useState([]);

    useEffect(() => {
        const fetchUsers = async () => {
            if (user?.role === 'admin') {
                const token = localStorage.getItem('crm_token') || sessionStorage.getItem('crm_token');
                try {
                    const res = await axios.get("http://localhost:5000/api/users", {
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

    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    const handleSelectChange = (name, value) => {
        onChange(name, value);
    };

    return (
        <form className={styles.form}>
            <div className={styles.field}>
                <label className={styles.label}>Domain Name *</label>
                <input
                    type="text"
                    name="domain"
                    className={`${styles.input} ${errors.domain ? styles.errorInput : ""}`}
                    placeholder="Enter"
                    value={formData.domain || ""}
                    onChange={handleChange}
                />
                {errors.domain && <span className={styles.errorText}>{errors.domain}</span>}
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Company Name *</label>
                    <input
                        type="text"
                        name="name"
                        className={`${styles.input} ${errors.name ? styles.errorInput : ""}`}
                        placeholder="Enter"
                        value={formData.name || ""}
                        onChange={handleChange}
                    />
                    {errors.name && <span className={styles.errorText}>{errors.name}</span>}
                </div>
                <div className={styles.field}>
                    <label className={styles.label}>Company Email</label>
                    <input
                        type="email"
                        name="email"
                        className={`${styles.input} ${errors.email ? styles.errorInput : ""}`}
                        placeholder="Enter"
                        value={formData.email || ""}
                        onChange={handleChange}
                    />
                    {errors.email && <span className={styles.errorText}>{errors.email}</span>}
                </div>
            </div>

            <div className={styles.field}>
                <CustomSelect
                    label="Company Owner *"
                    name="owner"
                    value={Array.isArray(formData.owner) ? formData.owner : []}
                    options={owners}
                    onChange={handleSelectChange}
                    error={errors.owner}
                    isMulti={true}
                />
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <CustomSelect
                        label="Industry *"
                        name="industry"
                        value={formData.industry || ""}
                        options={["Real Estate", "Technology", "Legal Services", "Healthcare", "Finance", "Retail", "Manufacturing"]}
                        onChange={handleSelectChange}
                        error={errors.industry}
                    />
                </div>
                <div className={styles.field}>
                    <CustomSelect
                        label="Type *"
                        name="type"
                        value={formData.type || ""}
                        options={["Client", "Partner", "Vendor"]}
                        onChange={handleSelectChange}
                        error={errors.type}
                    />
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
                    <CustomSelect
                        label="Country/Region"
                        name="country"
                        value={formData.country || ""}
                        options={countries}
                        onChange={handleSelectChange}
                        error={errors.country}
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

            {/* <div className={styles.field}>
                <CustomSelect
                    label="Lead Status"
                    name="leadStatus"
                    value={formData.leadStatus || "New"}
                    options={["New", "In Progress", "Converted", "Qualified", "Unqualified", "Contacted"]}
                    onChange={handleSelectChange}
                />
            </div> */}

            <div className={styles.field}>
                <label className={styles.label}>Phone Number *</label>
                <div className={styles.phoneInput}>
                    <div className={styles.flagSelector}>
                        <span className={styles.flag}>🇮🇳</span>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.chevron}>
                            <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                        </svg>
                    </div>
                    <input
                        type="tel"
                        name="phone"
                        className={`${styles.input} ${errors.phone ? styles.errorInput : ""}`}
                        placeholder="Enter"
                        value={formData.phone || ""}
                        onChange={handleChange}
                    />
                </div>
                {errors.phone && <span className={styles.errorText}>{errors.phone}</span>}
            </div>
        </form>
    );
};

export default CompanyForm;
