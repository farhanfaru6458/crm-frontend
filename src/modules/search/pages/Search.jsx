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
        t.name?.toLowerCase().includes(lowerQuery) ||
        t.owner?.toLowerCase().includes(lowerQuery)
      )
      .map(t => ({ ...t, type: "Ticket", icon: <FaTicketAlt />, link: `/tickets/${t._id}`, displayName: t.name }));

    setResults([...leadResults, ...companyResults, ...dealResults, ...ticketResults]);
  }, [query, leads, companies, deals, tickets]);

  return (
    <div className={styles.searchContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>
          Search Results for <span className={styles.query}>"{query}"</span>
        </h1>
        <p className={styles.count}>{results.length} results found</p>
      </div>

      <div className={styles.resultsList}>
        {results.length === 0 ? (
          <div className={styles.noResults}>
            <div className={styles.noResultsIcon}>🔍</div>
            <p>No results found for your search query.</p>
            <span>Try searching for something else.</span>
          </div>
        ) : (
          results.map((item, index) => (
            <Link to={item.link} key={item.type + item._id + index} className={styles.resultItem}>
              <div className={styles.itemIcon}>{item.icon}</div>
              <div className={styles.itemContent}>
                <div className={styles.itemTop}>
                  <span className={styles.itemName}>{item.displayName}</span>
                  <span className={`${styles.itemType} ${styles[item.type.toLowerCase()]}`}>{item.type}</span>
                </div>
                <div className={styles.itemDetails}>
                  {item.type === "Lead" && <span>{item.email} • {item.owner}</span>}
                  {item.type === "Company" && <span>{item.industry} • {item.city}, {item.country}</span>}
                  {item.type === "Deal" && <span>{item.dealStage} • ${item.amount?.toLocaleString()}</span>}
                  {item.type === "Ticket" && <span>{item.status} • {item.priority} Priority</span>}
                </div>
              </div>
              <div className={styles.itemArrow}>→</div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}

