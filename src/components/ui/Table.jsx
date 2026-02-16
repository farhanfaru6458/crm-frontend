import React, { useState, useEffect } from "react";
import styles from "../../styles/Table.module.css";

const Table = ({
  columns = [],
  data = [],
  onSelectionChange,
  selectedRows = [],
  onEdit,
  onDelete,
}) => {
  const [internalSelectedRows, setInternalSelectedRows] = useState([]);

  // Use props if provided, otherwise internal state
  const currentSelectedRows = onSelectionChange
    ? selectedRows
    : internalSelectedRows;

  const handleSelectAll = (e) => {
    const isChecked = e.target.checked;
    const newSelectedRows = isChecked ? data.map((row) => row._id) : [];

    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    } else {
      setInternalSelectedRows(newSelectedRows);
    }
  };

  const handleSelectRow = (id) => {
    const isSelected = currentSelectedRows.includes(id);
    let newSelectedRows;

    if (isSelected) {
      newSelectedRows = currentSelectedRows.filter((rowId) => rowId !== id);
    } else {
      newSelectedRows = [...currentSelectedRows, id];
    }

    if (onSelectionChange) {
      onSelectionChange(newSelectedRows);
    } else {
      setInternalSelectedRows(newSelectedRows);
    }
  };

  const isAllSelected =
    data.length > 0 && currentSelectedRows.length === data.length;
  const isIndeterminate =
    currentSelectedRows.length > 0 && currentSelectedRows.length < data.length;

  return (
    <div className={styles.tableContainer}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th className={`${styles.th} w-12`}>
              <input
                type="checkbox"
                className={styles.checkbox}
                checked={isAllSelected}
                ref={(input) => {
                  if (input) input.indeterminate = isIndeterminate;
                }}
                onChange={handleSelectAll}
              />
            </th>
            {columns.map((col) => (
              <th key={col.key} className={styles.th}>
                {col.label}
              </th>
            ))}
            {(onEdit || onDelete) && <th className={styles.th}>Actions</th>}
          </tr>
        </thead>
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td colSpan={columns.length + 2} className={styles.noData}>
                No records found
              </td>
            </tr>
          ) : (
            data.map((row) => (
              <tr key={row._id} className={styles.tr}>
                <td className={styles.td}>
                  <input
                    type="checkbox"
                    className={styles.checkbox}
                    checked={currentSelectedRows.includes(row._id)}
                    onChange={() => handleSelectRow(row._id)}
                  />
                </td>
                {columns.map((col) => (
                  <td key={`${row._id}-${col.key}`} className={styles.td}>
                    {col.render ? col.render(row) : row[col.key]}
                  </td>
                ))}
                {(onEdit || onDelete) && (
                  <td className={styles.td}>
                    <div className={styles.actions}>
                      {onEdit && (
                        <button
                          onClick={() => onEdit(row)}
                          className={styles.actionBtn}
                          title="Edit"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={styles.editIcon}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0 1 15.75 21H5.25A2.25 2.25 0 0 1 3 18.75V8.25A2.25 2.25 0 0 1 5.25 6H10"
                            />
                          </svg>
                        </button>
                      )}
                      {onDelete && (
                        <button
                          onClick={() => onDelete(row)}
                          className={styles.actionBtn}
                          title="Delete"
                        >
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={1.5}
                            stroke="currentColor"
                            className={styles.deleteIcon}
                          >
                            <path
                              strokeLinecap="round"
                              strokeLinejoin="round"
                              d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456-1.293 3.65 3.65m0 0a48.11 48.11 0 0 1-3.476-.3837L3.89 5.0805c-.34-.059-.68-.114-1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0"
                            />
                          </svg>
                        </button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
