import React from "react";
import styles from "../../styles/Pagination.module.css";

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = new Set([1, 2, 3, totalPages - 1, totalPages]);

    if (currentPage > 1 && currentPage < totalPages) {
      pages.add(currentPage - 1);
      pages.add(currentPage);
      pages.add(currentPage + 1);
    }

    // Clean up out of bounds (0 or > totalPages) just in case
    const sortedPages = Array.from(pages)
      .filter((p) => p > 0 && p <= totalPages)
      .sort((a, b) => a - b);

    const result = [];
    for (let i = 0; i < sortedPages.length; i++) {
      const page = sortedPages[i];
      if (i > 0) {
        const prevPage = sortedPages[i - 1];
        if (page - prevPage > 1) {
          result.push("...");
        }
      }
      result.push(page);
    }

    return result;
  };

  const pages = getPageNumbers();

  return (
    <div className={styles.paginationContainer}>
      <button
        className={styles.navButton}
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={styles.arrowIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18"
          />
        </svg>
        <span>Previous</span>
      </button>

      {pages.map((page, index) => (
        <React.Fragment key={index}>
          {page === "..." ? (
            <span className={styles.dots}>...</span>
          ) : (
            <button
              className={`${styles.pageButton} ${currentPage === page ? styles.active : ""}`}
              onClick={() => onPageChange(page)}
            >
              {page}
            </button>
          )}
        </React.Fragment>
      ))}

      <button
        className={styles.navButton}
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
      >
        <span>Next</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1.5}
          stroke="currentColor"
          className={styles.arrowIcon}
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3"
          />
        </svg>
      </button>
    </div>
  );
};

export default Pagination;
