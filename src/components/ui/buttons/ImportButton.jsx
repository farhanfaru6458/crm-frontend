import React, { useRef } from "react";
import Papa from "papaparse";
import { toast } from "react-hot-toast";
import styles from "../../../styles/buttons/ImportButton.module.css";

const ImportButton = ({ className, onImport }) => {
  const fileInputRef = useRef(null);

  const handleClick = () => {
    fileInputRef.current.click();
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.type !== "text/csv" && !file.name.endsWith(".csv")) {
        toast.error("Please upload a CSV file");
        return;
      }

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          if (onImport) {
            onImport(results.data);
          }
          // Reset the input value to allow the same file to be imported again if needed
          e.target.value = "";
        },
        error: (error) => {
          console.error("CSV Parsing Error:", error);
          toast.error("Failed to parse CSV file");
        }
      });
    }
  };

  return (
    <>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept=".csv"
        style={{ display: "none" }}
      />
      <button
        type="button"
        className={`${styles.importButton} ${className || ""}`}
        onClick={handleClick}
      >
        Import
      </button>
    </>
  );
};

export default ImportButton;
