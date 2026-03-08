import React, { useState } from 'react';
import { useAuth } from "../../../context/AuthContext";
import styles from './Profile.module.css';
import { countries } from "../../../utils/countries";
import CustomSelect from "../../../components/ui/CustomSelect/CustomSelect";

const Profile = () => {
    const { user, updateUser } = useAuth();
    const [isEditing, setIsEditing] = useState(false);
    const [formData, setFormData] = useState({});

    if (!user) {
        return <div className={styles.container}>Loading profile...</div>;
    }

    const handleEditClick = () => {
        setFormData({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            // email is usually not editable easily, keeping it read-only for now
            phone: user.phone || "",
            companyName: user.companyName || "",
            industry: user.industry || "",
            country: user.country || ""
        });
        setIsEditing(true);
    };

    const handleCancelClick = () => {
        setIsEditing(false);
        setFormData({});
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSelectChange = (name, value) => {
        setFormData({
            ...formData,
            [name]: value
        });
    };

    const handleSaveClick = () => {
        updateUser(formData);
        setIsEditing(false);
    };

    return (
        <div className={styles.container}>
            <div className={styles.profileCard}>
                <div className={styles.header}>
                    <div className={styles.avatar}>
                        {(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
                    </div>
                    <h2>{user.firstName} {user.lastName}</h2>
                    <p>{user.email}</p>

                    {!isEditing && (
                        <button className={styles.editButton} onClick={handleEditClick}>
                            Edit Profile
                        </button>
                    )}
                </div>

                <div className={styles.details}>
                    <h3>Profile Details</h3>

                    {isEditing ? (
                        <div className={styles.editForm}>
                            <div className={styles.formGroup}>
                                <label>First Name</label>
                                <input
                                    type="text"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Last Name</label>
                                <input
                                    type="text"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Phone</label>
                                <input
                                    type="text"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <label>Company</label>
                                <input
                                    type="text"
                                    name="companyName"
                                    value={formData.companyName}
                                    onChange={handleChange}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <CustomSelect
                                    label="Industry"
                                    name="industry"
                                    value={formData.industry}
                                    options={["IT", "Finance", "Healthcare", "Retail", "Education"]}
                                    onChange={(val) => handleSelectChange("industry", val)}
                                />
                            </div>
                            <div className={styles.formGroup}>
                                <CustomSelect
                                    label="Country"
                                    name="country"
                                    value={formData.country}
                                    options={countries}
                                    onChange={(val) => handleSelectChange("country", val)}
                                />
                            </div>

                            <div className={styles.formActions}>
                                <button className={styles.cancelBtn} onClick={handleCancelClick}>Cancel</button>
                                <button className={styles.saveBtn} onClick={handleSaveClick}>Save Changes</button>
                            </div>
                        </div>
                    ) : (
                        <>
                            <div className={styles.row}>
                                <span className={styles.label}>First Name:</span>
                                <span className={styles.value}>{user.firstName || "-"}</span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles.label}>Last Name:</span>
                                <span className={styles.value}>{user.lastName || "-"}</span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles.label}>Email:</span>
                                <span className={styles.value}>{user.email}</span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles.label}>Phone:</span>
                                <span className={styles.value}>{user.phone || "-"}</span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles.label}>Company:</span>
                                <span className={styles.value}>{user.companyName || "-"}</span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles.label}>Industry:</span>
                                <span className={styles.value}>{user.industry || "-"}</span>
                            </div>
                            <div className={styles.row}>
                                <span className={styles.label}>Country:</span>
                                <span className={styles.value}>{user.country || "-"}</span>
                            </div>
                        </>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
