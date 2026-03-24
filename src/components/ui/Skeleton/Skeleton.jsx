import styles from "./Skeleton.module.css";

/* Base shimmer block */
export function SkeletonBlock({ width = "100%", height = "16px", radius = "6px", style = {} }) {
  return (
    <div
      className={styles.shimmer}
      style={{ width, height, borderRadius: radius, ...style }}
    />
  );
}

/* Table skeleton — renders N rows × N columns */
export function TableSkeleton({ rows = 7, cols = 5 }) {
  return (
    <div className={styles.tableSkeletonWrapper}>
      {/* Header */}
      <div className={styles.tableSkeletonHeader}>
        {Array.from({ length: cols }).map((_, i) => (
          <SkeletonBlock key={i} width={i === 0 ? "24px" : "auto"} height="14px" style={{ flex: i === 0 ? "0 0 24px" : 1 }} />
        ))}
      </div>
      {/* Rows */}
      {Array.from({ length: rows }).map((_, ri) => (
        <div key={ri} className={styles.tableSkeletonRow}>
          <SkeletonBlock width="16px" height="16px" radius="4px" style={{ flex: "0 0 16px" }} />
          <SkeletonBlock height="14px" style={{ flex: 2 }} />
          <SkeletonBlock height="14px" style={{ flex: 2 }} />
          <SkeletonBlock height="14px" style={{ flex: 1.5 }} />
          <SkeletonBlock height="14px" style={{ flex: 1 }} />
          {cols > 4 && <SkeletonBlock height="24px" width="60px" radius="12px" />}
        </div>
      ))}
    </div>
  );
}

/* Metric stat card skeleton */
export function StatCardSkeleton() {
  return (
    <div className={styles.statCard}>
      <div style={{ display: "flex", flexDirection: "column", gap: "10px", flex: 1 }}>
        <SkeletonBlock width="60%" height="13px" />
        <SkeletonBlock width="40%" height="28px" radius="6px" />
      </div>
      <SkeletonBlock width="44px" height="44px" radius="12px" />
    </div>
  );
}

/* Bar chart skeleton */
export function ChartSkeleton({ bars = 12 }) {
  return (
    <div className={styles.chartSkeleton}>
      <div className={styles.chartSkeletonBars}>
        {Array.from({ length: bars }).map((_, i) => {
          const h = 20 + Math.abs(Math.sin(i * 1.3)) * 65;
          return (
            <div key={i} className={styles.chartSkeletonBarWrapper}>
              <div className={styles.chartSkeletonLightBar} style={{ height: `${h + 10}%` }} />
              <div className={styles.chartSkeletonMainBar} style={{ height: `${h}%` }} />
              <SkeletonBlock width="20px" height="10px" />
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* Funnel / progress row skeleton */
export function FunnelSkeleton({ rows = 5 }) {
  return (
    <div className={styles.funnelSkeleton}>
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className={styles.funnelRow}>
          <SkeletonBlock width="110px" height="13px" />
          <SkeletonBlock height="10px" style={{ flex: 1 }} radius="999px" />
          <SkeletonBlock width="28px" height="13px" />
        </div>
      ))}
    </div>
  );
}

/* Full dashboard skeleton */
export function DashboardSkeleton() {
  return (
    <div className={styles.dashboardSkeleton}>
      {/* Title */}
      <SkeletonBlock width="160px" height="28px" radius="8px" />

      {/* Stat cards grid */}
      <div className={styles.statGrid}>
        {[...Array(4)].map((_, i) => <StatCardSkeleton key={i} />)}
      </div>

      {/* Middle section */}
      <div className={styles.middleSkeleton}>
        <div className={styles.funnelCard}>
          <SkeletonBlock width="200px" height="18px" style={{ marginBottom: "20px" }} />
          <FunnelSkeleton rows={5} />
        </div>
        <div className={styles.chartCard}>
          <SkeletonBlock width="140px" height="18px" style={{ marginBottom: "20px" }} />
          <ChartSkeleton bars={12} />
        </div>
      </div>

      {/* Table section */}
      <div className={styles.tableSkeletonCard}>
        <SkeletonBlock width="220px" height="18px" style={{ marginBottom: "20px" }} />
        <TableSkeleton rows={5} cols={4} />
      </div>
    </div>
  );
}

/* Profile page skeleton */
export function ProfileSkeleton() {
  return (
    <div className={styles.profileSkeleton}>
      <div className={styles.profileHeader}>
        <SkeletonBlock width="80px" height="80px" radius="50%" />
        <SkeletonBlock width="150px" height="24px" style={{ marginTop: "16px" }} />
        <SkeletonBlock width="180px" height="14px" style={{ marginTop: "8px" }} />
      </div>
      <div className={styles.profileDetails}>
        {[...Array(6)].map((_, i) => (
          <div key={i} className={styles.profileRow}>
            <SkeletonBlock width="100px" height="14px" />
            <SkeletonBlock width="200px" height="14px" />
          </div>
        ))}
      </div>
    </div>
  );
}

/* Search result item skeleton */
export function SearchItemSkeleton() {
  return (
    <div className={styles.searchItemSkeleton}>
      <SkeletonBlock width="40px" height="40px" radius="8px" />
      <div style={{ flex: 1 }}>
        <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "8px" }}>
          <SkeletonBlock width="40%" height="16px" />
          <SkeletonBlock width="60px" height="16px" radius="12px" />
        </div>
        <SkeletonBlock width="70%" height="12px" />
      </div>
    </div>
  );
}

/* Entity Details page skeleton */
export function DetailsSkeleton() {
  return (
    <div className={styles.detailsSkeleton}>
      <div className={styles.detailsGrid}>
        {/* Sidebar */}
        <div className={styles.detailsSidebarSkeleton}>
          <div className={styles.detailsHeaderSkeleton}>
            <SkeletonBlock width="64px" height="64px" radius="50%" />
            <SkeletonBlock width="140px" height="24px" style={{ marginTop: "16px" }} />
            <SkeletonBlock width="180px" height="14px" style={{ marginTop: "8px" }} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
            {[...Array(5)].map((_, i) => (
              <div key={i}>
                <SkeletonBlock width="40%" height="12px" style={{ marginBottom: "6px" }} />
                <SkeletonBlock width="80%" height="14px" />
              </div>
            ))}
          </div>
        </div>

        {/* Feed section */}
        <div className={styles.detailsFeedSkeleton}>
          <div style={{ display: "flex", gap: "12px", marginBottom: "24px" }}>
            {[...Array(5)].map((_, i) => (
              <SkeletonBlock key={i} width="70px" height="30px" radius="15px" />
            ))}
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
            {[...Array(3)].map((_, i) => (
              <div key={i} style={{ display: "flex", gap: "16px" }}>
                <SkeletonBlock width="36px" height="36px" radius="50%" />
                <div style={{ flex: 1 }}>
                  <SkeletonBlock width="30%" height="14px" style={{ marginBottom: "10px" }} />
                  <SkeletonBlock width="100%" height="70px" radius="8px" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right section */}
        <div className={styles.detailsRightSkeleton}>
          <div style={{ backgroundColor: "#f8fafc", padding: "20px", borderRadius: "12px" }}>
            <SkeletonBlock width="100px" height="16px" style={{ marginBottom: "16px" }} />
            <SkeletonBlock width="100%" height="80px" radius="8px" />
          </div>
        </div>
      </div>
    </div>
  );
}


