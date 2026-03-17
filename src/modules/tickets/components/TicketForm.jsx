import { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./TicketForm.module.css";
import axios from "axios";
import { useAuth } from "../../../context/AuthContext";
import CustomSelect from "../../../components/ui/CustomSelect/CustomSelect";

const TicketForm = ({ formData, onChange, errors = {} }) => {
  const { user } = useAuth();
  const [owners, setOwners] = useState([]);
  const deals = useSelector((state) => state.deals.deals);
  const companies = useSelector((state) => state.companies.companies);

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

  const dealOptions = deals.map(d => ({ value: d._id, label: d.dealName }));
  const companyOptions = companies.map(c => ({ value: c._id, label: c.name }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleSelectChange = (name, value) => {
    // Mutually exclusive: clear the other when one is set
    if (name === "associatedDealId" && value) {
      onChange("associatedCompanyId", "");
      const selectedDeal = deals.find(d => d._id === value);
      if (selectedDeal && selectedDeal.email) {
        onChange("email", selectedDeal.email);
      }
    } else if (name === "associatedCompanyId" && value) {
      onChange("associatedDealId", "");
      const selectedCo = companies.find(c => c._id === value);
      if (selectedCo && selectedCo.email) {
        onChange("email", selectedCo.email);
      }
    }
    onChange(name, value);
  };

  const handleGeneralSelect = (name, value) => {
    onChange(name, value);
  };

  return (
    <form className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Ticket Name *</label>
        <input
          type="text"
          name="ticketName"
          className={`${styles.input} ${errors.ticketName ? styles.errorInput : ""}`}
          placeholder="Enter ticket name"
          value={formData.ticketName || ""}
          onChange={handleChange}
        />
        {errors.ticketName && <span className={styles.errorText}>{errors.ticketName}</span>}
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <CustomSelect
            label="Deal"
            name="associatedDealId"
            value={(typeof formData.associatedDealId === 'object' && formData.associatedDealId !== null) ? formData.associatedDealId._id : (formData.associatedDealId || "")}
            options={dealOptions}
            onChange={handleSelectChange}
            placeholder="Choose Deal"
          />
        </div>
        <div className={styles.field}>
          <CustomSelect
            label="Company"
            name="associatedCompanyId"
            value={(typeof formData.associatedCompanyId === 'object' && formData.associatedCompanyId !== null) ? formData.associatedCompanyId._id : (formData.associatedCompanyId || "")}
            options={companyOptions}
            onChange={handleSelectChange}
            placeholder="Choose Company"
          />
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Description</label>
        <textarea
          name="description"
          className={styles.textarea}
          placeholder="Enter description"
          value={formData.description || ""}
          onChange={handleChange}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <CustomSelect
            label="Ticket Status *"
            name="status"
            value={formData.status || ""}
            options={["New", "Waiting on us", "Waiting on contact"]}
            onChange={handleGeneralSelect}
            error={errors.status}
          />
        </div>

        <div className={styles.field}>
          <CustomSelect
            label="Source *"
            name="source"
            value={formData.source || ""}
            options={["Chat", "Email", "Phone"]}
            onChange={handleGeneralSelect}
            error={errors.source}
          />
        </div>
      </div>

      <div className={styles.field}>
        <CustomSelect
          label="Priority *"
          name="priority"
          value={formData.priority || ""}
          options={["High", "Medium", "Low"]}
          onChange={handleGeneralSelect}
          error={errors.priority}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Email (Contact)</label>
        <input
          type="email"
          name="email"
          className={styles.input}
          placeholder="Contact email address"
          value={formData.email || ""}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <CustomSelect
          label="Ticket Owner *"
          name="owner"
          value={Array.isArray(formData.owner) ? formData.owner : []}
          options={owners}
          onChange={handleGeneralSelect}
          error={errors.owner}
          isMulti={true}
        />
      </div>
    </form>
  );
};

export default TicketForm;
