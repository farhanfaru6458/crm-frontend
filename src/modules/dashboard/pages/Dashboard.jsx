import styles from "./Dashboard.module.css";
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react";

export default function Dashboard() {
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
              <option>Weekly</option>
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
          <button className={styles.exportBtn}>Export CSV</button>
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
              <tr>
                <td>Ethan Harper</td>
                <td>25</td>
                <td>10</td>
                <td>
                  <div className={styles.revenueCell}>
                    $12,000
                    <span className={styles.positive}>+3.4%</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td>Olivia Bennett</td>
                <td>30</td>
                <td>15</td>
                <td>
                  <div className={styles.revenueCell}>
                    $15,000
                    <span className={styles.negative}>-0.1%</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td>Liam Carter</td>
                <td>22</td>
                <td>12</td>
                <td>
                  <div className={styles.revenueCell}>
                    $10,000
                    <span className={styles.positive}>+3.4%</span>
                  </div>
                </td>
              </tr>

              <tr>
                <td>Sophia Evans</td>
                <td>28</td>
                <td>14</td>
                <td>
                  <div className={styles.revenueCell}>
                    $14,000
                    <span className={styles.negative}>-0.1%</span>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
