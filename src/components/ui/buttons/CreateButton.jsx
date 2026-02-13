import styles from "../../../styles/buttons/CreateButton.module.css";

const CreateButton = () => {
  return (
    <button type={"button"} className={`${styles.createButton}`}>
      Create
    </button>
  );
};

export default CreateButton;
