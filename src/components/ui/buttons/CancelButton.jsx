import styles from "../../../styles/buttons/CancelButton.module.css";

const CancelButton = () => {
  return (
    <button type={"button"} className={`${styles.cancelButton}`}>
      Cancel
    </button>
  );
};

export default CancelButton;
