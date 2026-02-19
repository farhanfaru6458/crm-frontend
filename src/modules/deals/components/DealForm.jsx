import { useSelector } from "react-redux";
import styles from "./DealForm.module.css";

const DealForm = ({ formData, onChange }) => {
  const leads = useSelector((state) => state.leads.leads);
  const qualifiedLeads = leads.filter((lead) => lead.status === "Qualified");

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  return (
    <form className={styles.form}>
      <div className={styles.field}>
        <label className={styles.label}>Associated Lead</label>
        <select
          name="associatedLeadId"
          className={styles.select}
          value={formData.associatedLeadId || ""}
          onChange={handleChange}
        >
          <option value="">Select Qualified Lead</option>
          {qualifiedLeads.map((lead) => (
            <option key={lead._id} value={lead._id}>
              {lead.name} ({lead.company})
            </option>
          ))}
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Deal Name *</label>
        <input
          type="text"
          name="dealName"
          className={styles.input}
          placeholder="Enter"
          value={formData.dealName || ""}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Deal Stage *</label>
        <select
          name="dealStage"
          className={styles.select}
          value={formData.dealStage || ""}
          onChange={handleChange}
        >
          <option value="">Choose</option>
          <option value="Proposal Sent">Proposal Sent</option>
          <option value="Negotiation">Negotiation</option>
          <option value="Closed Won">Closed Won</option>
          <option value="Closed Lost">Closed Lost</option>
        </select>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Amount *</label>
        <input
          type="number"
          name="amount"
          className={styles.input}
          placeholder="Enter"
          value={formData.amount || ""}
          onChange={handleChange}
        />
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Deal Owner *</label>
        <select
          name="dealOwner"
          className={styles.select}
          value={formData.dealOwner || ""}
          onChange={handleChange}
        >
          <option value="">Choose</option>
          <option value="Jane Cooper">Jane Cooper</option>
          <option value="Wade Warren">Wade Warren</option>
          <option value="Brooklyn Simmons">Brooklyn Simmons</option>
          <option value="Leslie Alexander">Leslie Alexander</option>
          <option value="Jenny Wilson">Jenny Wilson</option>
          <option value="Guy Hawkins">Guy Hawkins</option>
          <option value="Robert Fox">Robert Fox</option>
          <option value="Cameron Williamson">Cameron Williamson</option>
        </select>
      </div>

      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>Close Date *</label>
          <input
            type="date"
            name="closeDate"
            className={styles.input}
            value={formData.closeDate || ""}
            onChange={handleChange}
          />
        </div>
        <div className={styles.field}>
          <label className={styles.label}>Priority *</label>
          <select
            name="priority"
            className={styles.select}
            value={formData.priority || ""}
            onChange={handleChange}
          >
            <option value="">Choose</option>
            <option value="High">High</option>
            <option value="Medium">Medium</option>
            <option value="Low">Low</option>
          </select>
        </div>
      </div>
    </form>
  );
};

export default DealForm;
