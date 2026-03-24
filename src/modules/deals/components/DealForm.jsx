import { useSelector } from "react-redux";
import { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import styles from "./DealForm.module.css";

import CustomSelect from "../../../components/ui/CustomSelect/CustomSelect";

const DealForm = ({ formData, onChange, errors = {} }) => {
    const { user } = useAuth();
    const [owners, setOwners] = useState([]);
    const leads = useSelector((state) => state.leads.leads);

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
        if (name === "associatedLeadId" && value) {
            const selectedLead = leads.find(l => l._id === value);
            if (selectedLead && selectedLead.email) {
                onChange("email", selectedLead.email);
            }
        }
        onChange(name, value);
    };

    const getLeadLabel = (lead) => {
        if (lead.name && !lead.name.includes("undefined")) return lead.name;
        const first = (lead.firstName && lead.firstName !== "undefined") ? lead.firstName : "";
        const last = (lead.lastName && lead.lastName !== "undefined") ? lead.lastName : "";
        const combined = `${first} ${last}`.trim();
        return combined || "Unnamed Lead";
    };

    const currentLeadId = typeof formData.associatedLeadId === 'object' ? formData.associatedLeadId?._id : formData.associatedLeadId;
    const leadOptions = leads
        .filter(lead => lead.status === "Qualified" || lead._id === currentLeadId)
        .map((lead) => ({
        value: lead._id,
        label: `${getLeadLabel(lead)} (${lead.company || 'No Company'})`
    }));

    return (
        <form className={styles.form}>
            <div className={styles.field}>
                <CustomSelect
                    label="Associated Lead"
                    name="associatedLeadId"
                    value={(typeof formData.associatedLeadId === 'object' && formData.associatedLeadId !== null) ? formData.associatedLeadId._id : (formData.associatedLeadId || "")}
                    options={leadOptions}
                    onChange={handleSelectChange}
                    placeholder="Select Lead"
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Deal Name *</label>
                <input
                    type="text"
                    name="dealName"
                    className={`${styles.input} ${errors.dealName ? styles.errorInput : ""}`}
                    placeholder="Enter"
                    value={formData.dealName || ""}
                    onChange={handleChange}
                />
                {errors.dealName && <span className={styles.errorText}>{errors.dealName}</span>}
            </div>

            <div className={styles.field}>
                <CustomSelect
                    label="Deal Stage *"
                    name="dealStage"
                    value={formData.dealStage || ""}
                    options={[
                        "Proposal Sent", "Negotiation", "Presentation Scheduled",
                        "Qualified to Buy", "Contract Sent", "Appointment Scheduled",
                        "Decision Maker Bought In", "Closed Won", "Closed Lost"
                    ]}
                    onChange={handleSelectChange}
                    error={errors.dealStage}
                />
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Amount *</label>
                <input
                    type="number"
                    name="amount"
                    className={`${styles.input} ${errors.amount ? styles.errorInput : ""}`}
                    placeholder="Enter"
                    value={formData.amount || ""}
                    onChange={handleChange}
                />
                {errors.amount && <span className={styles.errorText}>{errors.amount}</span>}
            </div>

            <div className={styles.field}>
                <label className={styles.label}>Email (Contact)</label>
                <input
                    type="email"
                    name="email"
                    className={styles.input}
                    placeholder="Auto-populated from lead"
                    value={formData.email || ""}
                    onChange={handleChange}
                />
            </div>

            <div className={styles.field}>
                <CustomSelect
                    label="Deal Owner *"
                    name="dealOwner"
                    value={formData.dealOwner || []}
                    options={owners}
                    isMulti={true}
                    onChange={handleSelectChange}
                    error={errors.dealOwner}
                />
            </div>

            <div className={styles.row}>
                <div className={styles.field}>
                    <label className={styles.label}>Close Date *</label>
                    <input
                        type="date"
                        name="closeDate"
                        className={`${styles.input} ${errors.closeDate ? styles.errorInput : ""}`}
                        value={formData.closeDate || ""}
                        onChange={handleChange}
                    />
                    {errors.closeDate && <span className={styles.errorText}>{errors.closeDate}</span>}
                </div>
                <div className={styles.field}>
                    <CustomSelect
                        label="Priority *"
                        name="priority"
                        value={formData.priority || ""}
                        options={["High", "Medium", "Low"]}
                        onChange={handleSelectChange}
                        error={errors.priority}
                    />
                </div>
            </div>
        </form>
    );
};

export default DealForm;
