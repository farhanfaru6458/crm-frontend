import React, { useState, useEffect } from "react";
import styles from "./Leads.module.css";
import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import SearchInput from "../../../components/ui/SearchInput";
import ImportButton from "../../../components/ui/buttons/ImportButton";
import CreateButton from "../../../components/ui/buttons/CreateButton";
import { useNavigate, Link } from "react-router-dom";

import { useSelector, useDispatch } from "react-redux";
import { setLeads, removeLead, addLead, updateLead } from "../../../redux/leadsSlice";
import { addNotification } from "../../../redux/notificationsSlice";
import { toast } from "react-hot-toast";
import Modal from "../../../components/ui/Modal";
import LeadForm from "../components/LeadForm";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

export default function Leads() {
  const dispatch = useDispatch();
  const leads = useSelector((state) => state.leads.leads);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [leadToDelete, setLeadToDelete] = useState(null);
  const [editingLead, setEditingLead] = useState(null);
  const [formData, setFormData] = useState({});
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFilter, setDateFilter] = useState("");
  const itemsPerPage = 8;

  const handleOpenCreate = () => {
    setEditingLead(null);
    setFormData({
      owner: [],
      firstName: "",
      lastName: "",
      email: "",
      phone: "",
      jobTitle: "",
      status: "New"
    });
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
    setIsModalOpen(true);
  };

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    const combinedName = `${formData.firstName || ""} ${formData.lastName || ""}`.trim();
    const finalFormData = {
      ...formData,
      name: combinedName || "Unnamed Lead"
    };

    if (editingLead) {
      dispatch(updateLead(finalFormData));
      toast.success("Lead updated successfully!");
      dispatch(addNotification({
        id: Date.now(),
        message: `Lead ${finalFormData.name} updated successfully!`,
        type: "update",
        timestamp: new Date().toLocaleString()
      }));
    } else {
      const newLead = {
        ...finalFormData,
        _id: Math.random().toString(36).substr(2, 9),
        createdDate: new Date().toLocaleDateString('en-GB'), // Matches 04/08/2025 format
        createdAt: new Date().toLocaleString(),
      };
      dispatch(addLead(newLead));
      toast.success("Lead created successfully!");
      dispatch(addNotification({
        id: Date.now(),
        message: `Lead ${newLead.name} created successfully!`,
        type: "create",
        timestamp: new Date().toLocaleString()
      }));
    }
    setIsModalOpen(false);
  };

  // Filtering Logic
  const filteredLeads = leads.filter((lead) => {
    const matchesSearch =
      lead.name.toLowerCase().includes(search.toLowerCase()) ||
      lead.email.toLowerCase().includes(search.toLowerCase()) ||
      lead.phone.includes(search);
    const matchesStatus = !statusFilter || lead.status === statusFilter;

    let matchesDate = true;
    if (dateFilter) {
      const [y, m, d] = dateFilter.split("-");
      const formattedFilterDate = `${d}/${m}/${y}`;
      matchesDate = lead.createdDate === formattedFilterDate;
    }

    return matchesSearch && matchesStatus && matchesDate;
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

  const confirmDelete = () => {
    if (leadToDelete) {
      dispatch(removeLead(leadToDelete._id));
      toast.success("Lead deleted successfully");
      dispatch(addNotification({
        id: Date.now(),
        message: `Lead ${leadToDelete.name} deleted successfully!`,
        type: "delete",
        timestamp: new Date().toLocaleString()
      }));
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
          <div className={styles.headerActions}>
            <ImportButton className={styles.importBtn} />
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

          {/* Filter Row (Status, Date) */}
          <div className={styles.filterRow}>
            <div className={styles.selectWrapper}>
              <select
                className={styles.select}
                value={statusFilter}
                onChange={(e) => { setStatusFilter(e.target.value); setCurrentPage(1); }}
              >
                <option value="">Lead Status</option>
                <option value="Open">Open</option>
                <option value="New">New</option>
                <option value="In Progress">In Progress</option>
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
              onSelectionChange={(selected) => console.log("Selected:", selected)}
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
        <LeadForm formData={formData} onChange={handleInputChange} />
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
