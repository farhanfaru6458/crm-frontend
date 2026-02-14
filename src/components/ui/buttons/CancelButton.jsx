import styles from "../../../styles/buttons/CancelButton.module.css";

const CancelButton = ({ onClick, children }) => {
  return (
    <button type={"button"} className={`${styles.cancelButton}`} onClick={onClick}>
      {children || "Cancel"}
    </button>
  );
};

export default CancelButton;
