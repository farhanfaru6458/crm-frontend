import styles from "../../../styles/buttons/ImportButton.module.css";

const ImportButton = () => {
  return (
    <button type={"button"} className={`${styles.importButton}`}>
      Import
    </button>
  );
};

export default ImportButton;
