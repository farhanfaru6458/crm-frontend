import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Search.module.css";
import { FaUser, FaBuilding, FaHandshake, FaTicketAlt } from "react-icons/fa";

export default function Search() {
  const query = useSelector((state) => state.search.query);

  const leads = useSelector((state) => state.leads.leads);
  const companies = useSelector((state) => state.companies.companies);
  const deals = useSelector((state) => state.deals.deals);
  const tickets = useSelector((state) => state.tickets.tickets);

  const [results, setResults] = useState([]);

  useEffect(() => {
    if (!query) {
      setResults([]);
      return;
    }

    const lowerQuery = query.toLowerCase();

    const leadResults = leads
      .filter(l =>
        l.name?.toLowerCase().includes(lowerQuery) ||
        l.email?.toLowerCase().includes(lowerQuery)
      )
      .map(l => ({ ...l, type: "Lead", icon: <FaUser />, link: `/leads/${l._id}`, displayName: l.name }));

    const companyResults = companies
      .filter(c =>
        c.name?.toLowerCase().includes(lowerQuery) ||
        c.domain?.toLowerCase().includes(lowerQuery)
      )
      .map(c => ({ ...c, type: "Company", icon: <FaBuilding />, link: `/companies/${c._id}`, displayName: c.name }));

    const dealResults = deals
      .filter(d =>
        d.dealName?.toLowerCase().includes(lowerQuery) ||
        d.dealOwner?.toLowerCase().includes(lowerQuery)
      )
      .map(d => ({ ...d, type: "Deal", icon: <FaHandshake />, link: `/deals/${d._id}`, displayName: d.dealName }));

    const ticketResults = tickets
      .filter(t =>
        (t.ticketName || t.name)?.toLowerCase().includes(lowerQuery) ||
        (Array.isArray(t.owner) ? t.owner.some(o => o.toLowerCase().includes(lowerQuery)) : t.owner?.toLowerCase().includes(lowerQuery))
      )
      .map(t => ({ ...t, type: "Ticket", icon: <FaTicketAlt />, link: `/tickets/${t._id}`, displayName: t.ticketName || t.name }));

    // Grouping results
    const combined = [...leadResults, ...companyResults, ...dealResults, ...ticketResults];
    const grouped = combined.reduce((acc, item) => {
      if (!acc[item.type]) acc[item.type] = [];
      acc[item.type].push(item);
      return acc;
    }, {});

    setResults(grouped);
  }, [query, leads, companies, deals, tickets]);

  const totalCount = Object.values(results).reduce((sum, grp) => sum + grp.length, 0);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Search Results for <span className={styles.query}>"{query}"</span>
        </h1>
        <p className={styles.count}>{totalCount} results found</p>
      </div>

      <div className={styles.groupedResults}>
        {totalCount === 0 ? (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <p>No results found for your search query.</p>
            <span>Try searching for something else.</span>
          </div>
        ) : (
          Object.entries(results).map(([type, items]) => (
            <div key={type} className={styles.groupSection}>
              <h2 className={styles.groupTitle}>{type}s ({items.length})</h2>
              <div className={styles.resultsList}>
                {items.map((item, index) => (
                  <Link to={item.link} key={item.type + item._id + index} className={styles.resultItem}>
                    <div className={styles.itemIcon}>{item.icon}</div>
                    <div className={styles.itemContent}>
                      <div className={styles.itemTop}>
                        <span className={styles.itemName}>{item.displayName}</span>
                        <span className={`${styles.itemType} ${styles[item.type.toLowerCase()]}`}>{item.type}</span>
                      </div>
                      <div className={styles.itemDetails}>
                        {item.type === "Lead" && <span>{item.email} • {Array.isArray(item.owner) ? item.owner.join(", ") : item.owner}</span>}
                        {item.type === "Company" && <span>{item.industry} • {item.city}, {item.country}</span>}
                        {item.type === "Deal" && <span>{item.dealStage} • ${item.amount?.toLocaleString()}</span>}
                        {item.type === "Ticket" && <span>{item.status} • {item.priority} Priority</span>}
                      </div>
                    </div>
                    <div className={styles.itemArrow}>→</div>
                  </Link>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

