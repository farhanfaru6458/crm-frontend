import styles from "./Sidebar.module.css";
import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  Building2,
  ClipboardList,
  Ticket
} from "lucide-react";

export default function Sidebar() {
  return (
    <aside className={styles.sidebar}>
      
      <NavLink
        to="/dashboard"
        className={({ isActive }) =>
          `${styles.menuItem} ${isActive ? styles.active : ""}`
        }
      >
        <div className={styles.iconCircle}>
          <LayoutDashboard size={20} />
        </div>
        <span>Dashboard</span>
      </NavLink>

      <NavLink
        to="/leads"
        className={({ isActive }) =>
          `${styles.menuItem} ${isActive ? styles.active : ""}`
        }
      >
        <div className={styles.iconCircle}>
          <Users size={20} />
        </div>
        <span>Leads</span>
      </NavLink>

      <NavLink
        to="/companies"
        className={({ isActive }) =>
          `${styles.menuItem} ${isActive ? styles.active : ""}`
        }
      >
        <div className={styles.iconCircle}>
          <Building2 size={20} />
        </div>
        <span>Companies</span>
      </NavLink>

      <NavLink
        to="/deals"
        className={({ isActive }) =>
          `${styles.menuItem} ${isActive ? styles.active : ""}`
        }
      >
        <div className={styles.iconCircle}>
          <ClipboardList size={20} />
        </div>
        <span>Deals</span>
      </NavLink>

      <NavLink
        to="/tickets"
        className={({ isActive }) =>
          `${styles.menuItem} ${isActive ? styles.active : ""}`
        }
      >
        <div className={styles.iconCircle}>
          <Ticket size={20} />
        </div>
        <span>Tickets</span>
      </NavLink>

    </aside>
  );
}
