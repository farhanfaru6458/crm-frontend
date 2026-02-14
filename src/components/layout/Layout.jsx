import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";
import styles from "./Layout.module.css";

export default function Layout() {
  return (
    <div className={styles.layout}>
      <Navbar />
      <div className={styles.body}>
        <Sidebar />
        <main className={styles.content}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
