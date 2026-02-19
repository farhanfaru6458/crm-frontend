import { Link, useNavigate } from "react-router-dom";
import styles from "./Navbar.module.css";
import { FaSearch, FaBell, FaSignOutAlt, FaUser } from "react-icons/fa";
import { useAuth } from "../../context/AuthContext";
import { useDispatch } from "react-redux";
import { setQuery } from "../../redux/searchSlice";
import { useState } from "react";
export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [searchInput, setSearchInput] = useState("");

  const handleLogout = () => {
    logout();
    navigate("/login");
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

        <button className={styles.iconButton}>
          <FaBell />
        </button>

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
