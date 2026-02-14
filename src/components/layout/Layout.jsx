import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.wrapper}>

            <Navbar />

            <div className={styles.layout}>
        <Sidebar />

        <div className={styles.content}>
          <Outlet />
        </div>
      </div>

    </div>
  );
}
