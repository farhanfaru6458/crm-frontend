import { useSelector } from "react-redux";
import styles from "./TicketForm.module.css";

const TicketForm = ({ formData, onChange }) => {
  const deals = useSelector((state) => state.deals.deals);
  const companies = useSelector((state) => state.companies.companies);

  const handleChange = (e) => {
    const { name, value } = e.target;

    // Mutually exclusive selection for Deal and Company
    if (name === "associatedDealId" && value) {
      onChange("associatedCompanyId", "");
    } else if (name === "associatedCompanyId" && value) {
      onChange("associatedDealId", "");
    }

    onChange(name, value);
  };

  return (
    <form className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Ticket Name *</label>
        <input
          type="text"
          name="ticketName"
          className={styles.input}
          placeholder="Enter"
          value={formData.ticketName || ""}
          onChange={handleChange}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Deal</label>
          <select
            name="associatedDealId"
            className={styles.select}
            value={formData.associatedDealId || ""}
            onChange={handleChange}
          >
            <option value="">Choose Deal</option>
            {deals.map(deal => (
              <option key={deal._id} value={deal._id}>{deal.dealName}</option>
            ))}
          </select>
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Company</label>
          <select
            name="associatedCompanyId"
            className={styles.select}
            value={formData.associatedCompanyId || ""}
            onChange={handleChange}
          >
            <option value="">Choose Company</option>
            {companies.map(company => (
              <option key={company._id} value={company._id}>{company.name}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label>Description</label>
        <textarea
          name="description"
          placeholder="Enter"
          value={formData.description || ""}
          onChange={handleChange}
        />
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label>
            Ticket Status <span>*</span>
          </label>
          <select
            name="status"
            value={formData.status || ""}
            onChange={handleChange}
          >
            <option value="">Choose</option>
            <option value="New">New</option>
            <option value="Waiting on us">Waiting on us</option>
            <option value="Waiting on contact">Waiting on contact</option>
          </select>
        </div>

        <div className={styles.field}>
          <label>
            Source <span>*</span>
          </label>
          <select
            name="source"
            value={formData.source || ""}
            onChange={handleChange}
          >
            <option value="">Choose</option>
            <option value="Chat">Chat</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
          </select>
        </div>
      </div>

      <div className={styles.field}>
        <label>
          Priority <span>*</span>
        </label>
        <select
          name="priority"
          value={formData.priority || ""}
          onChange={handleChange}
        >
          <option value="">Choose</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
      </div>

      <div className={styles.field}>
        <label>
          Ticket Owner <span>*</span>
        </label>
        <select
          name="owner"
          value={formData.owner || ""}
          onChange={handleChange}
        >
          <option value="">Choose</option>
          {["Jane Cooper", "Wade Warren", "Brooklyn Simmons", "Leslie Alexander"].map(owner => (
            <option key={owner} value={owner}>{owner}</option>
          ))}
        </select>
      </div>

    </form>
  );
};

export default TicketForm;
