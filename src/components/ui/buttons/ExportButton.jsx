
import styles from "../../../styles/buttons/ImportButton.module.css"; // Reuse import button styles or create new
import { exportToCSV } from "../../../utils/exportUtils";

const ExportButton = ({ data, filename = "export.csv" }) => {
  const handleExport = () => {
    exportToCSV(data, filename);
  };

  return (
    <button type={"button"} className={`${styles.importButton}`} onClick={handleExport}>
        <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }}
        >
            <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
      Export
    </button>
  );
};

export default ExportButton;
