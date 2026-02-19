import styles from "./Dashboard.module.css";
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react";

const TEAM_PERFORMANCE_DATA = [
  {
    employee: "Ethan Harper",
    activeDeals: 25,
    closedDeals: 10,
    revenue: 12000,
    trend: "+3.4%",
    isPositive: true,
  },
  {
    employee: "Olivia Bennett",
    activeDeals: 30,
    closedDeals: 15,
    revenue: 15000,
    trend: "-0.1%",
    isPositive: false,
  },
  {
    employee: "Liam Carter",
    activeDeals: 22,
    closedDeals: 12,
    revenue: 10000,
    trend: "+3.4%",
    isPositive: true,
  },
  {
    employee: "Sophia Evans",
    activeDeals: 28,
    closedDeals: 14,
    revenue: 14000,
    trend: "-0.1%",
    isPositive: false,
  },
];

export default function Dashboard() {
  const handleExportCSV = () => {
    const headers = ["Employee", "Active Deals", "Closed Deals", "Revenue", "Trend"];
    const rows = TEAM_PERFORMANCE_DATA.map((item) => [
      item.employee,
      item.activeDeals,
      item.closedDeals,
      item.revenue,
      item.trend,
    ]);

    const csvContent = [
      headers.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "team_performance.csv");
    link.style.visibility = "hidden";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <div className={styles.dashboard}>
      {/* ================= TOP CARDS ================= */}
      <div className={styles.cardGrid}>
        <div className={styles.metricCard}>
          <div>
            <p>Total Leads</p>
            <h2>1,250</h2>
          </div>
          <div className={`${styles.iconCircle} ${styles.purple}`}>
            <Users size={20} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div>
            <p>Active Deals</p>
            <h2>136</h2>
          </div>
          <div className={`${styles.iconCircle} ${styles.green}`}>
            <Briefcase size={20} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div>
            <p>Closed Deals</p>
            <h2>136</h2>
          </div>
          <div className={`${styles.iconCircle} ${styles.red}`}>
            <TrendingUp size={20} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div>
            <p>Monthly Revenue</p>
            <h2>45,000</h2>
          </div>
          <div className={`${styles.iconCircle} ${styles.yellow}`}>
            <DollarSign size={20} />
          </div>
        </div>
      </div>

      {/* ================= MIDDLE SECTION ================= */}
      <div className={styles.middleSection}>
        {/* Conversion Card */}
        <div className={styles.conversionCard}>
          <h3>Contact to Deal Conversion</h3>

          <div className={styles.progressItem}>
            <span>Contact</span>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progress} ${styles.purpleBar}`}
                style={{ width: "60%" }}
              ></div>
            </div>
          </div>

          <div className={styles.progressItem}>
            <span>Qualified Lead</span>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progress} ${styles.blueBar}`}
                style={{ width: "40%" }}
              ></div>
            </div>
          </div>

          <div className={styles.progressItem}>
            <span>Proposal Sent</span>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progress} ${styles.yellowBar}`}
                style={{ width: "70%" }}
              ></div>
            </div>
          </div>

          <div className={styles.progressItem}>
            <span>Negotiation</span>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progress} ${styles.purpleBar}`}
                style={{ width: "65%" }}
              ></div>
            </div>
          </div>

          <div className={styles.progressItem}>
            <span>Closed Won</span>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progress} ${styles.greenBar}`}
                style={{ width: "50%" }}
              ></div>
            </div>
          </div>

          <div className={styles.progressItem}>
            <span>Closed Lost</span>
            <div className={styles.progressBar}>
              <div
                className={`${styles.progress} ${styles.redBar}`}
                style={{ width: "30%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Sales Report Card */}
        <div className={styles.salesCard}>
          <div className={styles.salesHeader}>
            <h3>Sales Reports</h3>

            <select className={styles.salesSelect}>
              <option>Monthly</option>
              <option>Yearly</option>
            </select>
          </div>

          <div className={styles.chartContainer}>
            <div className={styles.yAxis}>
              <span>$10000</span>
              <span>$5000</span>
              <span>$1000</span>
              <span>$500</span>
              <span>$200</span>
              <span>$0</span>
            </div>

            <div className={styles.chartBars}>
              {[
                { main: 40, light: 65 },
                { main: 70, light: 85 },
                { main: 30, light: 55 },
                { main: 50, light: 75 },
                { main: 20, light: 45 },
                { main: 25, light: 50 },
                { main: 35, light: 60 },
                { main: 45, light: 70 },
                { main: 80, light: 95 },
                { main: 50, light: 65 },
                { main: 55, light: 72 },
                { main: 48, light: 68 },
              ].map((bar, index) => (
                <div key={index} className={styles.barWrapper}>
                  {/* Light Background Bar */}
                  <div
                    className={styles.lightBar}
                    style={{ height: `${bar.light}%` }}
                  ></div>

                  {/* Main Purple Bar */}
                  <div
                    className={styles.mainBar}
                    style={{ height: `${bar.main}%` }}
                  ></div>

                  <span className={styles.month}>
                    {
                      [
                        "Jan",
                        "Feb",
                        "Mar",
                        "Apr",
                        "May",
                        "Jun",
                        "Jul",
                        "Aug",
                        "Sep",
                        "Oct",
                        "Nov",
                        "Dec",
                      ][index]
                    }
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ================= TABLE SECTION ================= */}
      <div className={styles.tableCard}>
        <div className={styles.tableHeader}>
          <h3>Team Performance Tracking</h3>
          <button className={styles.exportBtn} onClick={handleExportCSV}>Export CSV</button>
        </div>

        <div className={styles.tableWrapper}>
          <table>
            <thead>
              <tr>
                <th>Employee</th>
                <th>Active Deals</th>
                <th>Closed Deals</th>
                <th>Revenue</th>
              </tr>
            </thead>

            <tbody>
              {TEAM_PERFORMANCE_DATA.map((row, index) => (
                <tr key={index}>
                  <td>{row.employee}</td>
                  <td>{row.activeDeals}</td>
                  <td>{row.closedDeals}</td>
                  <td>
                    <div className={styles.revenueCell}>
                      {formatCurrency(row.revenue)}
                      <span
                        className={
                          row.isPositive ? styles.positive : styles.negative
                        }
                      >
                        {row.trend}
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
