import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/ui/Table";
import SearchInput from "../../../components/ui/SearchInput";
import Pagination from "../../../components/ui/Pagination";
import Modal from "../../../components/ui/Modal";
import TicketForm from "../components/TicketForm";
import styles from "./Tickets.module.css";

import { useSelector, useDispatch } from "react-redux";
import { setTickets, removeTicket, addTicket, updateTicket } from "../../../redux/ticketsSlice";
import { addNotification } from "../../../redux/notificationsSlice";
import { toast } from "react-hot-toast";
import ImportButton from "../../../components/ui/buttons/ImportButton";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

const Tickets = () => {
  const dispatch = useDispatch();
  const tickets = useSelector((state) => state.tickets.tickets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  const [filters, setFilters] = useState({
    owner: "",
    status: "",
    source: "",
    priority: "",
  });

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
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
      dispatch(updateTicket(formData));
    } else {
      const newTicket = {
        ...formData,
        _id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toLocaleString(),
      };
      dispatch(addTicket(newTicket));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    setTicketToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (ticketToDelete) {
      dispatch(removeTicket(ticketToDelete));
      toast.success("Ticket deleted successfully");
      dispatch(addNotification({
        id: Date.now(),
        message: `Ticket deleted successfully!`,
        type: "delete",
        timestamp: new Date().toLocaleString()
      }));
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

  // Pagination Logic
  const totalPages = Math.ceil(filteredTickets.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentTickets = filteredTickets.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

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
      <div className={styles.mainCard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Tickets</h1>

          <div className={styles.headerActions}>
            <ImportButton className={styles.importBtn} />
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
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={handlePageChange}
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
              <option value="Jane Cooper">Jane Cooper</option>
              <option value="Wade Warren">Wade Warren</option>
              <option value="Brooklyn Simmons">Brooklyn Simmons</option>
              <option value="Leslie Alexander">Leslie Alexander</option>
              <option value="Guy Hawkins">Guy Hawkins</option>
              <option value="Cameron Williamson">Cameron Williamson</option>
            </select>

            <select
              className={styles.filterSelect}
              value={filters.status}
              onChange={(e) => handleFilterChange("status", e.target.value)}
            >
              <option value="">Ticket Status</option>
              <option value="New">New</option>
              <option value="Waiting on us">Waiting on us</option>
              <option value="Waiting on contact">Waiting on contact</option>
            </select>

            <select
              className={styles.filterSelect}
              value={filters.source}
              onChange={(e) => handleFilterChange("source", e.target.value)}
            >
              <option value="">Source</option>
              <option value="Chat">Chat</option>
              <option value="Email">Email</option>
              <option value="Phone">Phone</option>
            </select>

            <select
              className={styles.filterSelect}
              value={filters.priority}
              onChange={(e) => handleFilterChange("priority", e.target.value)}
            >
              <option value="">Priority</option>
              <option value="Critical">Critical</option>
              <option value="High">High</option>
              <option value="Medium">Medium</option>
              <option value="Low">Low</option>
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
            data={currentTickets}
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

        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Ticket"
          message="Are you sure you want to delete this ticket?"
        />
      </div>
    </div>
  );
};

export default Tickets;
