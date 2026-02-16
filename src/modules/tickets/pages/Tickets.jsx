import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/ui/Table";
import SearchInput from "../../../components/ui/SearchInput";
import Pagination from "../../../components/ui/Pagination";
import Modal from "../../../components/ui/Modal";
import TicketForm from "../components/TicketForm";
import styles from "./Tickets.module.css";

const INITIAL_TICKETS = [
  {
    _id: "1",
    name: "Payment Failure Issue",
    status: "Waiting on contact",
    priority: "High",
    source: "Chat",
    owner: "Jane Cooper",
    createdAt: "Apr 8, 2025 2:35 PM",
  },
  {
    _id: "2",
    name: "Product Inquiry",
    status: "Waiting on us",
    priority: "Medium",
    source: "Email",
    owner: "Wade Warren",
    createdAt: "Apr 8, 2025 2:35 PM",
  },
  {
    _id: "3",
    name: "Subscription Upgrade",
    status: "New",
    priority: "High",
    source: "Chat",
    owner: "Brooklyn Simmons",
    createdAt: "Apr 8, 2025 2:35 PM",
  },
  {
    _id: "4",
    name: "Refund Request - Order #456",
    status: "New",
    priority: "Low",
    source: "Phone",
    owner: "Leslie Alexander",
    createdAt: "Apr 8, 2025 2:35 PM",
  },
  {
    _id: "5",
    name: "Login Not Working",
    status: "Waiting On Us",
    priority: "Critical",
    source: "Phone",
    owner: "Guy Hawkins",
    createdAt: "Apr 8, 2025 2:35 PM",
  },
  {
    _id: "6",
    name: "SLA Violation Complaint",
    status: "Closed",
    priority: "Medium",
    source: "Chat",
    owner: "Camero Williamson",
    createdAt: "Apr 8, 2025 2:35 PM",
  },
];

const Tickets = () => {
  const [tickets, setTickets] = useState(INITIAL_TICKETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  const [filters, setFilters] = useState({
    owner: "",
    status: "",
    source: "",
    priority: "",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

   // Handlers
  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    setEditingTicket(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ticket) => {
    setEditingTicket(ticket);
    setFormData(ticket);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingTicket) {
      setTickets((prev) =>
        prev.map((t) => (t._id === editingTicket._id ? { ...formData } : t)),
      );
    } else {
      const newTicket = {
        ...formData,
        _id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toLocaleString(),
      };
      setTickets((prev) => [newTicket, ...prev]);
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this ticket?")) {
      setTickets((prev) => prev.filter((t) => t._id !== id));
    }
  };

  const filteredTickets = useMemo(() => {
    return tickets.filter((t) => {
      const matchesSearch =
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.source.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOwner = !filters.owner || t.owner === filters.owner;
      const matchesStatus = !filters.status || t.status === filters.status;
      const matchesSource = !filters.source || t.source === filters.source;
      const matchesPriority =
        !filters.priority || t.priority === filters.priority;

      return (
        matchesSearch &&
        matchesOwner &&
        matchesStatus &&
        matchesSource &&
        matchesPriority
      );
    });
  }, [tickets, searchTerm, filters]);

  const columns = [
    {
      key: "name",
      label: "TICKET NAME",
      render: (row) => (
        <Link to={`/tickets/${row._id}`} className={styles.ticketLink}>
          {row.name}
        </Link>
      ),
    },
    { key: "status", label: "STATUS" },
    { key: "priority", label: "PRIORITY" },
    { key: "source", label: "SOURCE" },
    { key: "owner", label: "OWNER" },
    { key: "createdAt", label: "CREATED DATE" },
  ];

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <h1 className={styles.title}>Tickets</h1>

        <div className={styles.headerActions}>
          <button className={styles.importBtn}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className={styles.icon}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3"
              />
            </svg>
            Import
          </button>
          <button className={styles.addBtn} onClick={handleOpenCreate}>
            Create
          </button>
        </div>
      </header>

      <div className={styles.content}>
        <div className={styles.topFiltersRow}>
          <SearchInput
            placeholder="Search ticket, owner, source"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className={styles.search}
          />

          <Pagination
            totalPages={1}
            currentPage={currentPage}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        {/* FILTER DROPDOWN ROW */}
        <div className={styles.dropdownFiltersRow}>
          <select
            className={styles.filterSelect}
            value={filters.owner}
            onChange={(e) => handleFilterChange("owner", e.target.value)}
          >
            <option value="">Ticket Owner</option>
            <option>Jane Cooper</option>
            <option>Wade Warren</option>
            <option>Brooklyn Simmons</option>
            <option>Leslie Alexander</option>
            <option>Guy Hawkins</option>
            <option>Camero Williamson</option>
          </select>

          <select
            className={styles.filterSelect}
            value={filters.status}
            onChange={(e) => handleFilterChange("status", e.target.value)}
          >
            <option value="">Ticket Status</option>
            <option>New</option>
            <option>Waiting on us</option>
            <option>Waiting on contact</option>
          </select>

          <select
            className={styles.filterSelect}
            value={filters.source}
            onChange={(e) => handleFilterChange("source", e.target.value)}
          >
            <option value="">Source</option>
            <option>Chat</option>
            <option>Email</option>
            <option>Phone</option>
          </select>

          <select
            className={styles.filterSelect}
            value={filters.priority}
            onChange={(e) => handleFilterChange("priority", e.target.value)}
          >
            <option value="">Priority</option>
            <option>Critical</option>
            <option>High</option>
            <option>Medium</option>
            <option>Low</option>
          </select>

          <div className={styles.datePicker}>
            <span>Created Date</span>
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

        <Table
          columns={columns}
          data={filteredTickets}
          onEdit={handleOpenEdit}
          onDelete={(row) => handleDelete(row._id)}
        />
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingTicket ? "Edit Ticket" : "Create Ticket"}
        onSave={handleSave}
      >
        <TicketForm formData={formData} onChange={handleFormChange} />
      </Modal>
    </div>
  );
};

export default Tickets;
