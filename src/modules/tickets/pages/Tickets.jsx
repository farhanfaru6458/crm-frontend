import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/ui/Table";
import SearchInput from "../../../components/ui/SearchInput";
import Pagination from "../../../components/ui/Pagination";
import Modal from "../../../components/ui/Modal";
import TicketForm from "../components/TicketForm";
import styles from "./Tickets.module.css";
import CustomSelect from "../../../components/ui/CustomSelect/CustomSelect";
import { useAuth } from "../../../context/AuthContext";

import { useSelector, useDispatch } from "react-redux";
import { fetchTickets, removeTicket, addTicket, updateTicket, bulkDeleteTickets, bulkAddTickets } from "../../../redux/ticketsSlice";
import { fetchDeals } from "../../../redux/dealsSlice";
import { fetchCompanies } from "../../../redux/companiesSlice";
import { addNotification } from "../../../redux/notificationsSlice";
import { toast } from "react-hot-toast";
import ImportButton from "../../../components/ui/buttons/ImportButton";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

const Tickets = () => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { tickets, loading } = useSelector((state) => state.tickets);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [ticketToDelete, setTicketToDelete] = useState(null);
  const [editingTicket, setEditingTicket] = useState(null);
  const [formData, setFormData] = useState({});
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTickets, setSelectedTickets] = useState([]);
  const [errors, setErrors] = useState({});
  const itemsPerPage = 8;

  const [filters, setFilters] = useState({
    owner: "",
    status: "",
    source: "",
    priority: "",
    createdAt: "",
  });

  useEffect(() => {
    dispatch(fetchTickets());
    dispatch(fetchDeals());
    dispatch(fetchCompanies());
  }, [dispatch]);

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Handlers
  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleOpenCreate = () => {
    setEditingTicket(null);
    setFormData({
      owner: user ? `${user.firstName} ${user.lastName}` : ""
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (ticket) => {
    setEditingTicket(ticket);
    setFormData(ticket);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.ticketName?.trim()) newErrors.ticketName = "Ticket name is required";
    if (!formData.status) newErrors.status = "Status is required";
    if (!formData.source) newErrors.source = "Source is required";
    if (!formData.priority) newErrors.priority = "Priority is required";
    if (!formData.owner) newErrors.owner = "Owner is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    if (editingTicket) {
      dispatch(updateTicket(formData))
        .unwrap()
        .then(() => {
          toast.success("Ticket updated successfully");
          setIsModalOpen(false);
        })
        .catch((err) => toast.error(err || "Failed to update ticket"));
    } else {
      dispatch(addTicket(formData))
        .unwrap()
        .then(() => {
          toast.success("Ticket created successfully");
          setIsModalOpen(false);
        })
        .catch((err) => toast.error(err || "Failed to create ticket"));
    }
  };

  const handleImport = (data) => {
    dispatch(bulkAddTickets(data))
      .unwrap()
      .then(() => {
        toast.success(`${data.length} tickets imported successfully!`);
        dispatch(addNotification({
          id: Date.now(),
          message: `${data.length} tickets imported successfully!`,
          type: "create",
          timestamp: new Date().toLocaleString()
        }));
      })
      .catch((err) => toast.error(err || "Batch import failed"));
  };

  const handleDelete = (id) => {
    setTicketToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (ticketToDelete) {
      if (Array.isArray(ticketToDelete)) {
        // Bulk delete
        dispatch(bulkDeleteTickets(ticketToDelete))
          .unwrap()
          .then(() => {
            toast.success(`${ticketToDelete.length} tickets deleted successfully`);
            setSelectedTickets([]);
          })
          .catch((err) => toast.error(err || "Batch delete failed"));
      } else {
        // Single delete
        dispatch(removeTicket(ticketToDelete))
          .unwrap()
          .then(() => {
            toast.success("Ticket deleted successfully");
            dispatch(addNotification({
              id: Date.now(),
              message: `Ticket deleted successfully!`,
              type: "delete",
              timestamp: new Date().toLocaleString()
            }));
          })
          .catch((err) => toast.error(err || "Delete failed"));
      }
      setIsConfirmOpen(false);
      setTicketToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    setTicketToDelete(selectedTickets);
    setIsConfirmOpen(true);
  };

  const filteredTickets = useMemo(() => {
    return (tickets || []).filter((t) => {
      const ticketName = t.ticketName || t.name || "";
      const owner = t.owner || "";
      const source = t.source || "";
      const status = t.status || "";
      const priority = t.priority || "";

      const matchesSearch =
        ticketName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        source.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesOwner = !filters.owner || owner === filters.owner;
      const matchesStatus = !filters.status || status === filters.status;
      const matchesSource = !filters.source || source === filters.source;
      const matchesPriority =
        !filters.priority || priority === filters.priority;

      let matchesDate = true;
      if (filters.createdAt) {
        matchesDate = t.createdAt && new Date(t.createdAt).toDateString() === new Date(filters.createdAt).toDateString();
      }

      return (
        matchesSearch &&
        matchesOwner &&
        matchesStatus &&
        matchesSource &&
        matchesPriority &&
        matchesDate
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
      key: "ticketName",
      label: "TICKET NAME",
      render: (row) => (
        <Link to={`/tickets/${row._id}`} className={styles.ticketLink}>
          {row.ticketName || row.name}
        </Link>
      ),
    },
    { key: "status", label: "STATUS" },
    { key: "priority", label: "PRIORITY" },
    { key: "source", label: "SOURCE" },
    { key: "owner", label: "OWNER" },
    {
      key: "createdAt",
      label: "CREATED DATE",
      render: (row) => new Date(row.createdAt).toLocaleDateString()
    },
  ];

  const owners = useMemo(() => {
    const uniqueOwners = [...new Set((tickets || []).map(t => t.owner).filter(Boolean))];
    return uniqueOwners.sort();
  }, [tickets]);

  const statuses = useMemo(() => {
    return [...new Set((tickets || []).map(t => t.status).filter(Boolean))].sort();
  }, [tickets]);

  const sources = useMemo(() => {
    return [...new Set((tickets || []).map(t => t.source).filter(Boolean))].sort();
  }, [tickets]);

  const priorities = useMemo(() => {
    const uniquePriorities = [...new Set((tickets || []).map(t => t.priority).filter(Boolean))];
    return uniquePriorities.sort();
  }, [tickets]);

  return (
    <div className={styles.container}>
      <div className={styles.mainCard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Tickets</h1>

          <div className={styles.headerActions}>
            {selectedTickets.length > 0 && (
              <button className={styles.bulkDeleteBtn} onClick={handleBulkDelete}>
                Delete Selected ({selectedTickets.length})
              </button>
            )}
            <ImportButton className={styles.importBtn} onImport={handleImport} />
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
            <div className={styles.filterSelectWrapper}>
              <CustomSelect
                placeholder="Ticket Owner"
                value={filters.owner}
                onChange={(val) => handleFilterChange("owner", val)}
                options={owners}
              />
            </div>

            <div className={styles.filterSelectWrapper}>
              <CustomSelect
                placeholder="Ticket Status"
                value={filters.status}
                onChange={(val) => handleFilterChange("status", val)}
                options={statuses}
              />
            </div>

            <div className={styles.filterSelectWrapper}>
              <CustomSelect
                placeholder="Source"
                value={filters.source}
                onChange={(val) => handleFilterChange("source", val)}
                options={sources}
              />
            </div>

            <div className={styles.filterSelectWrapper}>
              <CustomSelect
                placeholder="Priority"
                value={filters.priority}
                onChange={(val) => handleFilterChange("priority", val)}
                options={priorities}
              />
            </div>

            <div className={styles.datePicker}>
              <input
                type="date"
                className={styles.dateInput}
                value={filters.createdAt}
                onChange={(e) => handleFilterChange("createdAt", e.target.value)}
              />

            </div>
          </div>

          {loading ? (
            <div className={styles.loading}>Loading tickets...</div>
          ) : (
            <Table
              columns={columns}
              data={currentTickets}
              onEdit={handleOpenEdit}
              onDelete={(row) => handleDelete(row._id)}
              onSelectionChange={setSelectedTickets}
              selectedRows={selectedTickets}
            />
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingTicket ? "Edit Ticket" : "Create Ticket"}
          onSave={handleSave}
        >
          <TicketForm formData={formData} onChange={handleFormChange} errors={errors} />
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
