import styles from "./OtpRedirectLoader.module.css";
import { ShieldCheck } from "lucide-react";

export default function OtpRedirectLoader({ email }) {
    return (
        <div className={styles.overlay}>
            <div className={styles.card}>
                <div className={styles.iconRing}>
                    <ShieldCheck size={36} className={styles.icon} />
                </div>
                <h3 className={styles.title}>Sending OTP</h3>
                <p className={styles.subtitle}>
                    We're sending a 6-digit code to<br />
                    <strong>{email}</strong>
                </p>
                <div className={styles.dotsRow}>
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                    <span className={styles.dot} />
                </div>
            </div>
        </div>
    );
}
