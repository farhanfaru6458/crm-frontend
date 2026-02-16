import React, { useState, useEffect } from "react";
import styles from "./Leads.module.css";
import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import SearchInput from "../../../components/ui/SearchInput";
import ImportButton from "../../../components/ui/buttons/ImportButton";
import CreateButton from "../../../components/ui/buttons/CreateButton";
import { useNavigate, Link } from "react-router-dom";

export default function Leads() {
  const [leads, setLeads] = useState([
    {
      _id: "1",
      name: "Maria Johnson",
      email: "maria.j@clientedge.com",
      phone: "+1 234 567 890",
      createdDate: "04/08/2025",
      status: "New",
      owner: "Jane Cooper",
    },
    {
      _id: "2",
      name: "Michael Chen",
      email: "m.chen@techsolutions.io",
      phone: "+1 987 654 321",
      createdDate: "05/08/2025",
      status: "In Progress",
      owner: "Wade Warren",
    },
    {
      _id: "3",
      name: "Sarah Williams",
      email: "sarah.w@trustsphere.com",
      phone: "+1 555 123 456",
      createdDate: "06/08/2025",
      status: "Open",
      owner: "Brooklyn Simmons",
    }
  ]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Adjust based on design height

  // Filtering Logic
  const filteredLeads = leads.filter(
    (lead) =>
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search),
  );

  // Pagination Logic
  const totalPages = Math.ceil(filteredLeads.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentLeads = filteredLeads.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setCurrentPage(1); // Reset to first page on search
  };

  const handleEdit = (row) => {
    console.log("Edit row:", row);
  };

  const handleDelete = (row) => {
    if (window.confirm(`Are you sure you want to delete ${row.name}?`)) {
      setLeads(leads.filter((lead) => lead._id !== row._id));
    }
  };

  const columns = [
    {
      key: "name",
      label: "NAME",
      render: (row) => (
        <Link to={`/leads/${row._id}`} className={styles.leadLink}>
          {row.name}
        </Link>
      )
    },
    { key: "email", label: "EMAIL" },
    { key: "phone", label: "PHONE NUMBER" },
    { key: "createdDate", label: "CREATED DATE" },
    {
      key: "status",
      label: "LEAD STATUS",
      render: (row) => (
        <span
          className={`${styles.statusBadge} ${styles[row.status.toLowerCase().replace(" ", "")]
            }`}
        >
          {row.status}
        </span>
      ),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.mainCard}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Leads</h1>
          <div className={styles.actions}>
            <ImportButton />
            <div className={styles.spacer}></div>
            <CreateButton />
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Controls: Search & Filters */}
        <div className={styles.controls}>
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search phone, name, email"
            className={styles.searchInput}
          />
          <div className={styles.paginationInfo}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Filter Row (Status, Date) */}
        <div className={styles.filterRow}>
          <div className={styles.selectWrapper}>
            <select className={styles.select}>
              <option>Lead Status</option>
              <option>Open</option>
              <option>New</option>
              <option>In Progress</option>
            </select>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.selectIcon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="m19.5 8.25-7.5 7.5-7.5-7.5"
              />
            </svg>
          </div>
          <div className={styles.selectWrapper}>
            <div className={styles.dateDisplay}>
              Created Date
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={styles.calendarIcon}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className={styles.tableCard}>
          <Table
            columns={columns}
            data={currentLeads}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelectionChange={(selected) => console.log("Selected:", selected)}
          />
        </div>
      </div>
    </div>
  );
}
