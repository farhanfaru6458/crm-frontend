import styles from "../../../styles/buttons/ImportButton.module.css";

const ImportButton = ({ className }) => {
  return (
    <button type={"button"} className={`${styles.importButton} ${className || ""}`}>
      Import
    </button>
  );
};

export default ImportButton;
