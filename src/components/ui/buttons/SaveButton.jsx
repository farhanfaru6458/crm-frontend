import styles from "../../../styles/buttons/SaveButton.module.css";

const SaveButton = ({ onClick, children }) => {
  return (
    <button type={"button"} className={`${styles.saveButton}`} onClick={onClick}>
      {children || "Save"}
    </button>
  );
};

export default SaveButton;
