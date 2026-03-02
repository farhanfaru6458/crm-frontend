import { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import styles from "./TicketForm.module.css";
import { ChevronDown } from "lucide-react";

// Custom searchable dropdown that stays inside the panel
const InlineSelect = ({ label, name, value, options, onChange, error, placeholder = "Choose" }) => {
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState("");
  const ref = useRef(null);

  const selectedLabel = options.find(o => o.value === value)?.label || "";

  const filtered = options.filter(o =>
    o.label.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
        setSearch("");
      }
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const handleSelect = (val) => {
    onChange(name, val);
    setOpen(false);
    setSearch("");
  };

  return (
    <div className={styles.customDropdown} ref={ref}>
      {label && <label className={styles.label}>{label}</label>}
      <button
        type="button"
        className={`${styles.dropdownTrigger} ${error ? styles.errorInput : ""} ${open ? styles.dropdownOpen : ""}`}
        onClick={() => setOpen(prev => !prev)}
      >
        <span className={value ? styles.selectedValue : styles.placeholder}>
          {value ? selectedLabel : placeholder}
        </span>
        <ChevronDown size={16} className={`${styles.chevronIcon} ${open ? styles.rotated : ""}`} />
      </button>

      {open && (
        <div className={styles.dropdownMenu}>
          <div className={styles.searchWrapper}>
            <input
              type="text"
              className={styles.searchInput}
              placeholder="Search..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
            />
          </div>
          <div className={styles.optionsList}>
            <div
              className={styles.option}
              onClick={() => handleSelect("")}
            >
              <span className={styles.noneOption}>{placeholder}</span>
            </div>
            {filtered.length === 0 ? (
              <div className={styles.noResults}>No results</div>
            ) : (
              filtered.map(opt => (
                <div
                  key={opt.value}
                  className={`${styles.option} ${opt.value === value ? styles.selectedOption : ""}`}
                  onClick={() => handleSelect(opt.value)}
                >
                  {opt.label}
                </div>
              ))
            )}
          </div>
        </div>
      )}
      {error && <span className={styles.errorText}>{error}</span>}
    </div>
  );
};

const TicketForm = ({ formData, onChange, errors = {} }) => {
  const deals = useSelector((state) => state.deals.deals);
  const companies = useSelector((state) => state.companies.companies);

  const dealOptions = deals.map(d => ({ value: d._id, label: d.dealName }));
  const companyOptions = companies.map(c => ({ value: c._id, label: c.name }));

  const handleChange = (e) => {
    const { name, value } = e.target;
    onChange(name, value);
  };

  const handleAssociation = (name, value) => {
    // Mutually exclusive: clear the other when one is set
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
          className={`${styles.input} ${errors.ticketName ? styles.errorInput : ""}`}
          placeholder="Enter ticket name"
          value={formData.ticketName || ""}
          onChange={handleChange}
        />
        {errors.ticketName && <span className={styles.errorText}>{errors.ticketName}</span>}
      </div>

      <div className={styles.row}>
        <InlineSelect
          label="Deal"
          name="associatedDealId"
          value={formData.associatedDealId || ""}
          options={dealOptions}
          onChange={handleAssociation}
          placeholder="Choose Deal"
        />
        <InlineSelect
          label="Company"
          name="associatedCompanyId"
          value={formData.associatedCompanyId || ""}
          options={companyOptions}
          onChange={handleAssociation}
          placeholder="Choose Company"
        />
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
          <label className={styles.label}>Ticket Status <span>*</span></label>
          <select
            name="status"
            className={`${styles.select} ${errors.status ? styles.errorInput : ""}`}
            value={formData.status || ""}
            onChange={handleChange}
          >
            <option value="">Choose</option>
            <option value="New">New</option>
            <option value="Waiting on us">Waiting on us</option>
            <option value="Waiting on contact">Waiting on contact</option>
          </select>
          {errors.status && <span className={styles.errorText}>{errors.status}</span>}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Source <span>*</span></label>
          <select
            name="source"
            className={`${styles.select} ${errors.source ? styles.errorInput : ""}`}
            value={formData.source || ""}
            onChange={handleChange}
          >
            <option value="">Choose</option>
            <option value="Chat">Chat</option>
            <option value="Email">Email</option>
            <option value="Phone">Phone</option>
          </select>
          {errors.source && <span className={styles.errorText}>{errors.source}</span>}
        </div>
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Priority <span>*</span></label>
        <select
          name="priority"
          className={`${styles.select} ${errors.priority ? styles.errorInput : ""}`}
          value={formData.priority || ""}
          onChange={handleChange}
        >
          <option value="">Choose</option>
          <option value="High">High</option>
          <option value="Medium">Medium</option>
          <option value="Low">Low</option>
        </select>
        {errors.priority && <span className={styles.errorText}>{errors.priority}</span>}
      </div>

      <div className={styles.field}>
        <label className={styles.label}>Ticket Owner <span>*</span></label>
        <select
          name="owner"
          className={`${styles.select} ${errors.owner ? styles.errorInput : ""}`}
          value={formData.owner || ""}
          onChange={handleChange}
        >
          <option value="">Choose</option>
          {["Jane Cooper", "Wade Warren", "Brooklyn Simmons", "Leslie Alexander", "Guy Hawkins", "Cameron Williamson"].map(owner => (
            <option key={owner} value={owner}>{owner}</option>
          ))}
        </select>
        {errors.owner && <span className={styles.errorText}>{errors.owner}</span>}
      </div>
    </form>
  );
};

export default TicketForm;
