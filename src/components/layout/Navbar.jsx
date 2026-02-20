import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { FaSearch, FaBell, FaSignOutAlt, FaUser, FaTrash } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useDispatch, useSelector } from "react-redux";
import { setQuery } from "../../redux/searchSlice";
import { useState } from "react";
import { clearNotifications } from "../../redux/notificationsSlice";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");
  const [isNotifyOpen, setIsNotifyOpen] = useState(false);
  const notifications = useSelector((state) => state.notifications.notifications);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const handleClearNotifications = (e) => {
    e.stopPropagation();
    dispatch(clearNotifications());
    setIsNotifyOpen(false);
  };

  return (
    <header className={styles.navbar}>
      <Link to="/dashboard" className={styles.logo}>CRM</Link>
      <div className={styles.right}>
        <div className={styles.searchWrapper}>
          <FaSearch className={styles.searchIcon} />
          <input
            type="text"
            placeholder="Search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                dispatch(setQuery(searchInput));
                navigate("/search");
              }
            }}
          />

        </div>

        <div className={styles.notificationWrapper}>
          <button className={styles.iconButton} onClick={() => setIsNotifyOpen(!isNotifyOpen)}>
            <FaBell />
            {notifications.length > 0 && <span className={styles.badge}>{notifications.length}</span>}
          </button>

          {isNotifyOpen && (
            <div className={styles.notificationDropdown}>
              <div className={styles.notificationHeader}>
                <span>Notifications</span>
                {notifications.length > 0 && (
                  <button onClick={handleClearNotifications} className={styles.clearBtn}>
                    <FaTrash /> Clear
                  </button>
                )}
              </div>
              <div className={styles.notificationList}>
                {notifications.length === 0 ? (
                  <div className={styles.emptyNotify}>No notifications</div>
                ) : (
                  notifications.map((n) => (
                    <div key={n.id} className={styles.notificationItem}>
                      <p className={styles.notifyMsg}>{n.message}</p>
                      <span className={styles.notifyTime}>{n.timestamp}</span>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}
        </div>

        {user && (
          <div className={styles.userProfile}>
            <Link to="/profile" className={styles.userInfo}>
              <span className={styles.userName}>{user.firstName} {user.lastName}</span>

              <div className={styles.avatar}>
                {(user.firstName?.[0] || user.email?.[0] || "U").toUpperCase()}
              </div>
            </Link>
            <button onClick={handleLogout} className={styles.logoutButton} title="Logout">
              <FaSignOutAlt />
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
