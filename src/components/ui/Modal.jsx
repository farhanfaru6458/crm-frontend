import { useEffect } from "react";
import { createPortal } from "react-dom";
import styles from "../../styles/Modal.module.css";
import CancelButton from "./buttons/CancelButton";
import SaveButton from "./buttons/SaveButton";

const Modal = ({ isOpen, onClose, title, children, footer, onSave }) => {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return createPortal(
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <div className={styles.header}>
          <h2 className={styles.title}>{title}</h2>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="w-6 h-6"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18 18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <div className={styles.body}>{children}</div>

        {footer !== null && (
          <div className={styles.footer}>
            {footer || (
              <>
                <CancelButton onClick={onClose} />
                <SaveButton onClick={onSave} />
              </>
            )}
          </div>
        )}
      </div>
    </div>,
    document.body,
  );
};

export default Modal;
