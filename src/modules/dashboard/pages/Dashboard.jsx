import React, { useEffect, useMemo, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./Dashboard.module.css";
import { Users, Briefcase, DollarSign, TrendingUp } from "lucide-react";
import { fetchLeads } from "../../../redux/leadsSlice";
import { fetchDeals } from "../../../redux/dealsSlice";
import { fetchCompanies } from "../../../redux/companiesSlice";
import CustomSelect from "../../../components/ui/CustomSelect/CustomSelect";

export default function Dashboard() {
  const dispatch = useDispatch();
  const [reportFilter, setReportFilter] = useState("Monthly");
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const { leads } = useSelector((state) => state.leads);
  const { deals } = useSelector((state) => state.deals);
  const { loading: loadingLeads } = useSelector((state) => state.leads);
  const { loading: loadingDeals } = useSelector((state) => state.deals);

  useEffect(() => {
    dispatch(fetchLeads());
    dispatch(fetchDeals());
    dispatch(fetchCompanies());
  }, [dispatch]);

  // Calculate Metrics
  const metrics = useMemo(() => {
    const currentMonth = new Date().getMonth();

    // Filter by selected year
    const yearLeads = (leads || []).filter(l => {
      const date = new Date(l.createdAt);
      return date.getFullYear() === selectedYear;
    });

    const yearDeals = (deals || []).filter(d => {
      const date = new Date(d.createdAt || d.updatedAt);
      return date.getFullYear() === selectedYear;
    });

    const totalLeads = yearLeads.length;
    const activeDeals = yearDeals.filter(d =>
      d.dealStage !== "Closed Won" && d.dealStage !== "Closed Lost"
    ).length;
    const closedDeals = yearDeals.filter(d => d.dealStage === "Closed Won").length;

    const monthlyRevenue = yearDeals
      .filter(d => {
        const date = new Date(d.createdAt || d.updatedAt);
        return d.dealStage === "Closed Won" && date.getMonth() === currentMonth;
      })
      .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

    return { totalLeads, activeDeals, closedDeals, monthlyRevenue };
  }, [leads, deals, selectedYear]);

  // Team Performance Data from Real Deals
  const teamPerformance = useMemo(() => {
    const performance = {};
    const yearDeals = (deals || []).filter(d => {
      const date = new Date(d.createdAt || d.updatedAt);
      return date.getFullYear() === selectedYear;
    });

    yearDeals.forEach(deal => {
      const owner = deal.dealOwner || "Unassigned";
      if (!performance[owner]) {
        performance[owner] = {
          employee: owner,
          activeDeals: 0,
          closedDeals: 0,
          revenue: 0,
          trend: "+0.0%",
          isPositive: true
        };
      }
      if (deal.dealStage === "Closed Won") {
        performance[owner].closedDeals += 1;
        performance[owner].revenue += (Number(deal.amount) || 0);
      } else if (deal.dealStage !== "Closed Lost") {
        performance[owner].activeDeals += 1;
      }
    });

    const results = Object.values(performance).sort((a, b) => b.revenue - a.revenue);
    return results.length > 0 ? results : [
      { employee: "No data for this year", activeDeals: 0, closedDeals: 0, revenue: 0, trend: "0%", isPositive: true }
    ];
  }, [deals, selectedYear]);

  // Conversion Funnel Data
  const conversionFunnel = useMemo(() => {
    const yearLeads = (leads || []).filter(l => new Date(l.createdAt).getFullYear() === selectedYear);
    const yearDeals = (deals || []).filter(d => new Date(d.createdAt || d.updatedAt).getFullYear() === selectedYear);

    const counts = {
      "Contact": yearLeads.length,
      "Qualified Lead": yearLeads.filter(l => l.status === "Qualified" || l.status === "Converted").length,
      "Proposal Sent": yearDeals.filter(d => d.dealStage === "Proposal Sent").length,
      "Negotiation": yearDeals.filter(d => d.dealStage === "Negotiation").length,
      "Closed Won": yearDeals.filter(d => d.dealStage === "Closed Won").length,
      "Closed Lost": yearDeals.filter(d => d.dealStage === "Closed Lost").length
    };

    const max = Math.max(...Object.values(counts), 1);
    const bars = [
      { label: "Contact", color: styles.purpleBar, count: counts["Contact"] },
      { label: "Qualified Lead", color: styles.blueBar, count: counts["Qualified Lead"] },
      { label: "Proposal Sent", color: styles.yellowBar, count: counts["Proposal Sent"] },
      { label: "Negotiation", color: styles.purpleBar, count: counts["Negotiation"] },
      { label: "Closed Won", color: styles.greenBar, count: counts["Closed Won"] },
      { label: "Closed Lost", color: styles.redBar, count: counts["Closed Lost"] },
    ];

    return bars.map(bar => ({
      ...bar,
      width: `${(bar.count / max) * 100}%`
    }));
  }, [leads, deals, selectedYear]);

  // Sales Chart Data
  const salesChart = useMemo(() => {
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

    if (reportFilter === "Yearly") {
      const years = [2020, 2021, 2022, 2023, 2024, 2025, 2026];
      const yearlyData = years.map(year => {
        const yearDeals = (deals || []).filter(d => {
          const date = new Date(d.createdAt || d.updatedAt);
          return date.getFullYear() === year;
        });

        const revenue = yearDeals
          .filter(d => d.dealStage === "Closed Won")
          .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

        const pipeline = yearDeals
          .filter(d => d.dealStage === "Negotiation" || d.dealStage === "Proposal Sent")
          .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

        return { label: year.toString(), revenue, pipeline };
      });

      const maxVal = Math.max(...yearlyData.map(d => d.revenue + d.pipeline), 10000);
      return yearlyData.map(d => ({
        label: d.label,
        revenue: d.revenue,
        pipeline: d.pipeline,
        main: (d.revenue / maxVal) * 80,
        light: ((d.revenue + d.pipeline) / maxVal) * 95
      }));
    }

    const monthlyData = months.map((m, i) => {
      const monthDeals = (deals || []).filter(d => {
        const date = new Date(d.createdAt || d.updatedAt);
        return date.getMonth() === i && date.getFullYear() === selectedYear;
      });

      const revenue = monthDeals
        .filter(d => d.dealStage === "Closed Won")
        .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

      const pipeline = monthDeals
        .filter(d => d.dealStage === "Negotiation" || d.dealStage === "Proposal Sent")
        .reduce((sum, d) => sum + (Number(d.amount) || 0), 0);

      return { label: m, revenue, pipeline };
    });

    const maxVal = Math.max(...monthlyData.map(d => d.revenue + d.pipeline), 10000);
    return monthlyData.map(d => ({
      label: d.label,
      revenue: d.revenue,
      pipeline: d.pipeline,
      main: (d.revenue / maxVal) * 80 + 2,
      light: ((d.revenue + d.pipeline) / maxVal) * 95 + 5
    }));
  }, [deals, reportFilter, selectedYear]);

  const handleExportCSV = () => {
    const headers = ["Employee", "Active Deals", "Closed Deals", "Revenue"];
    const rows = teamPerformance.map((item) => [
      item.employee,
      item.activeDeals,
      item.closedDeals,
      item.revenue,
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

  if (loadingLeads && loadingDeals && leads.length === 0) {
    return <div className={styles.loading}>Loading dynamic insights...</div>;
  }

  return (
    <div className={styles.dashboard}>
      {/* ================= TOP CARDS ================= */}
      <div className={styles.cardGrid}>
        <div className={styles.metricCard}>
          <div>
            <p>Total Leads</p>
            <h2>{metrics.totalLeads.toLocaleString()}</h2>
          </div>
          <div className={`${styles.iconCircle} ${styles.purple}`}>
            <Users size={20} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div>
            <p>Active Deals</p>
            <h2>{metrics.activeDeals}</h2>
          </div>
          <div className={`${styles.iconCircle} ${styles.green}`}>
            <Briefcase size={20} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div>
            <p>Closed Deals</p>
            <h2>{metrics.closedDeals}</h2>
          </div>
          <div className={`${styles.iconCircle} ${styles.red}`}>
            <TrendingUp size={20} />
          </div>
        </div>

        <div className={styles.metricCard}>
          <div>
            <p>Monthly Revenue</p>
            <h2>{formatCurrency(metrics.monthlyRevenue)}</h2>
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
          <h3>Lead to Closed Conversion</h3>
          {conversionFunnel.map((item, idx) => (
            <div key={idx} className={styles.progressItem}>
              <div className={styles.progressLabel}>
                <span>{item.label}</span>
                <span className={styles.countText}>{item.count}</span>
              </div>
              <div className={styles.progressBar}>
                <div
                  className={`${styles.progress} ${item.color}`}
                  style={{ width: item.width }}
                ></div>
              </div>
            </div>
          ))}
        </div>

        {/* Sales Report Card */}
        <div className={styles.salesCard}>
          <div className={styles.salesHeader}>
            <h3>Sales Reports</h3>
            <div className={styles.salesOptions}>
              {reportFilter === "Monthly" && (
                <div className={styles.filterWrapper}>
                  <CustomSelect
                    value={selectedYear}
                    options={[2020, 2021, 2022, 2023, 2024, 2025, 2026]}
                    onChange={(val) => setSelectedYear(Number(val))}
                  />
                </div>
              )}
              <div className={styles.filterWrapper}>
                <CustomSelect
                  value={reportFilter}
                  options={["Monthly", "Yearly"]}
                  onChange={(val) => setReportFilter(val)}
                />
              </div>
            </div>
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
              {salesChart.map((bar, index) => (
                <div key={index} className={styles.barWrapper}>
                  <div className={styles.tooltip}>
                    <div>Revenue: {formatCurrency(bar.revenue)}</div>
                    <div>Pipeline: {formatCurrency(bar.pipeline)}</div>
                    <div>Total: {formatCurrency(bar.revenue + bar.pipeline)}</div>
                  </div>
                  <div
                    className={styles.lightBar}
                    style={{ height: `${bar.light}%` }}
                  ></div>
                  <div
                    className={styles.mainBar}
                    style={{ height: `${bar.main}%` }}
                  ></div>
                  <span className={styles.month}>{bar.label}</span>
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
                <th>Owner</th>
                <th>Active Deals</th>
                <th>Closed Won</th>
                <th>Total Revenue</th>
              </tr>
            </thead>

            <tbody>
              {teamPerformance.map((row, index) => (
                <tr key={index}>
                  <td className={styles.ownerName}>{row.employee}</td>
                  <td>{row.activeDeals}</td>
                  <td>{row.closedDeals}</td>
                  <td>
                    <div className={styles.revenueCell}>
                      {formatCurrency(row.revenue)}
                      <span className={row.isPositive ? styles.positive : styles.negative}>
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
