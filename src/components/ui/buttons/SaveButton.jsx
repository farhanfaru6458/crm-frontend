import styles from "../../../styles/buttons/SaveButton.module.css";

const SaveButton = () => {
  return (
    <button type={"button"} className={`${styles.saveButton}`}>
      Save
    </button>
  );
};

export default SaveButton;
