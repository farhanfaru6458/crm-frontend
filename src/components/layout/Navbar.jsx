import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { FaSearch, FaBell, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

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

        {user && (
          <div className={styles.userProfile}>
            <Link to="/profile" className={styles.userInfo}>
              <span className={styles.userName}>{user.firstName} {user.lastName}</span>
            </Link>
            <div className={styles.avatar}>
              {(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
            </div>
            <button onClick={handleLogout} className={styles.logoutButton} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
