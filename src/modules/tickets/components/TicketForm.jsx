import React from "react";
import styles from "./TicketForm.module.css";

const TicketForm = ({ formData, onChange }) => {
    const handleChange = (e) => {
        const { name, value } = e.target;
        onChange(name, value);
    };

    return (
        <form className={styles.form}>
            <div className={styles.field}>
                <label className={styles.label}>Ticket Name *</label>
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
              <option>Jane Cooper</option>
              <option>Wade Warren</option>
              <option>Brooklyn Simmons</option>
              <option>Leslie Alexander</option>
            </select>
          </div>    

     </form>
    );
};

export default TicketForm;
