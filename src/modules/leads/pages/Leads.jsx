import React, { useState, useEffect } from "react";
import styles from "./Leads.module.css";
import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import SearchInput from "../../../components/ui/SearchInput";
import ImportButton from "../../../components/ui/buttons/ImportButton";
import CreateButton from "../../../components/ui/buttons/CreateButton";
import { useNavigate, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { fetchLeads, removeLead, addLead, updateLead, bulkDeleteLeads, bulkAddLeads } from "../../../redux/leadsSlice";
import { addNotification } from "../../../redux/notificationsSlice";
import { toast } from "react-hot-toast";
import Modal from "../../../components/ui/Modal";
import LeadForm from "../components/LeadForm";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import CustomSelect from "../../../components/ui/CustomSelect/CustomSelect";
import { useAuth } from "../../../context/AuthContext";

export default function Leads() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { leads, loading } = useSelector((state) => state.leads);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const [selectedLeads, setSelectedLeads] = useState([]);
  const [errors, setErrors] = useState({});
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchLeads()).unwrap().catch(err => {
      toast.error(`Fetch failed: ${err.message || err}`);
    });
  }, [dispatch]);

  const handleOpenCreate = () => {
    setEditingLead(null);
    setFormData({
      owner: user ? [`${user.firstName} ${user.lastName}`] : [],
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      status: "New"
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (lead) => {
    const names = (lead.name || "").split(" ");
    const leadWithNames = {
      ...lead,
      firstName: names[0] || "",
      lastName: names.slice(1).join(" ") || "",
      owner: Array.isArray(lead.owner) ? lead.owner : (lead.owner ? [lead.owner] : [])
    };
    setEditingLead(lead);
    setFormData(leadWithNames);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const handleSave = async () => {
    // Validation
    const newErrors = {};
    if (!formData.email?.trim()) newErrors.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = "Invalid email format";
    if (!formData.firstName?.trim()) newErrors.firstName = "First name is required";
    if (!formData.lastName?.trim()) newErrors.lastName = "Last name is required";
    if (!formData.phone?.trim()) newErrors.phone = "Phone number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    const combinedName = `${formData.firstName || ""} ${formData.lastName || ""}`.trim();
    const finalFormData = {
      ...formData,
      name: combinedName || "Unnamed Lead"
    };

    try {
      if (editingLead) {
        await dispatch(updateLead(finalFormData)).unwrap();
        toast.success("Lead updated successfully!");
        dispatch(addNotification({
          id: Date.now(),
          message: `Lead ${finalFormData.name} updated successfully!`,
          type: "update",
          timestamp: new Date().toLocaleString()
        }));
      } else {
        await dispatch(addLead(finalFormData)).unwrap();
        toast.success("Lead created successfully!");
        dispatch(addNotification({
          id: Date.now(),
          message: `Lead ${finalFormData.name} created successfully!`,
          type: "create",
          timestamp: new Date().toLocaleString()
        }));
      }
      setIsModalOpen(false);
    } catch (error) {
      toast.error(error?.message || "Operation failed");
    }
  }

  const handleImport = async (data) => {
    try {
      await dispatch(bulkAddLeads(data)).unwrap();
      toast.success(`${data.length} leads imported successfully!`);
      dispatch(addNotification({
        id: Date.now(),
        message: `${data.length} leads imported successfully!`,
        type: "create",
        timestamp: new Date().toLocaleString()
      }));
    } catch (error) {
      toast.error("Bulk import failed. Please check the CSV format.");
    }
  };

  // Filtering Logic
  const filteredLeads = (leads || []).filter((lead) => {
    const searchTerm = (search || "").toLowerCase();
    const matchesSearch =
      (lead.name || "").toLowerCase().includes(searchTerm) ||
      (lead.email || "").toLowerCase().includes(searchTerm) ||
      (lead.phone || "").includes(searchTerm);

    const matchesStatus = !statusFilter || lead.status === statusFilter;

    // Temporarily disable date filtering to see if it makes data appear
    return matchesSearch && matchesStatus;
  });

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

  const handleDelete = (row) => {
    setLeadToDelete(row);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (leadToDelete) {
      if (Array.isArray(leadToDelete)) {
        // Bulk delete
        try {
          await dispatch(bulkDeleteLeads(leadToDelete)).unwrap();
          toast.success(`${leadToDelete.length} leads deleted successfully`);
          setSelectedLeads([]);
        } catch (error) {
          toast.error("Bulk delete failed");
        }
      } else {
        // Single delete
        try {
          await dispatch(removeLead(leadToDelete._id)).unwrap();
          toast.success("Lead deleted successfully");
          dispatch(addNotification({
            id: Date.now(),
            message: `Lead ${leadToDelete.name} deleted successfully!`,
            type: "delete",
            timestamp: new Date().toLocaleString()
          }));
        } catch (error) {
          toast.error("Delete failed");
        }
      }
      setIsConfirmOpen(false);
      setLeadToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    setLeadToDelete(selectedLeads);
    setIsConfirmOpen(true);
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
          <div className={styles.headerActions}>
            {selectedLeads.length > 0 && (
              <button className={styles.bulkDeleteBtn} onClick={handleBulkDelete}>
                Delete Selected ({selectedLeads.length})
              </button>
            )}
            <ImportButton className={styles.importBtn} onImport={handleImport} />
            <button className={styles.addBtn} onClick={handleOpenCreate}>
              Create
            </button>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Controls: Search & Filters */}
        <div className={styles.content}>
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

          <div className={styles.filterRow}>
            <div className={styles.filterSelectWrapper}>
              <CustomSelect
                placeholder="Lead Status"
                value={statusFilter}
                onChange={(val) => { setStatusFilter(val); setCurrentPage(1); }}
                options={["Open", "New", "In Progress", "Converted", "Qualified", "Unqualified", "Contacted"]}
              />
            </div>
            <div className={styles.selectWrapper}>
              <input
                type="date"
                className={styles.dateInput}
                value={dateFilter}
                onChange={(e) => { setDateFilter(e.target.value); setCurrentPage(1); }}
              />

            </div>
          </div>

          {/* Table */}
          <div className={styles.tableCard}>
            <Table
              columns={columns}
              data={currentLeads}
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
              onSelectionChange={setSelectedLeads}
              selectedRows={selectedLeads}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        title={editingLead ? "Edit Lead" : "Create Lead"}
        onSave={handleSave}
      >
        <LeadForm formData={formData} onChange={handleInputChange} errors={errors} />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Lead"
        message={`Are you sure you want to delete ${leadToDelete?.name}?`}
      />
    </div>
  );
}
