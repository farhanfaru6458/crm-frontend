import React from "react";
import Modal from "./Modal";
import styles from "../../styles/ConfirmDialog.module.css";

const ConfirmDialog = ({ isOpen, onClose, onConfirm, title, message }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title || "Confirm Action"}
            footer={
                <div className={styles.footer}>
                    <button className={styles.cancelBtn} onClick={onClose}>
                        Cancel
                    </button>
                    <button
                        className={styles.confirmBtn}
                        onClick={() => {
                            onConfirm();
                            onClose();
                        }}
                    >
                        Confirm
                    </button>
                </div>
            }
        >
            <p className={styles.message}>{message || "Are you sure you want to proceed?"}</p>
        </Modal>
    );
};

export default ConfirmDialog;
