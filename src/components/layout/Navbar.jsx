import styles from "./Navbar.module.css";
import { FaSearch, FaBell } from "react-icons/fa";

export default function Navbar() {
  return (
    <header className={styles.navbar}>
      <div className={styles.logo}>CRM</div>

      <div className={styles.right}>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input type="text" placeholder="Search" />
        </div>

        <button className={styles.iconButton}>
          <FaBell />
        </button>

        <div className={styles.avatar}>A</div>
      </div>
    </header>
  );
}
