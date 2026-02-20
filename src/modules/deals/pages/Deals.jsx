import React, { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Deals.module.css";
import Table from "../../../components/ui/Table";
import Pagination from "../../../components/ui/Pagination";
import SearchInput from "../../../components/ui/SearchInput";
import ImportButton from "../../../components/ui/buttons/ImportButton";
import CreateButton from "../../../components/ui/buttons/CreateButton";

import Modal from "../../../components/ui/Modal";
import DealForm from "../components/DealForm";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";
import { toast } from "react-hot-toast";
import { addNotification } from "../../../redux/notificationsSlice";

import { useSelector, useDispatch } from "react-redux";
import { setDeals, removeDeal, addDeal, updateDeal } from "../../../redux/dealsSlice";

export default function Deals() {
  const dispatch = useDispatch();
  const deals = useSelector((state) => state.deals.deals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({});

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ownerFilter, setOwnerFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [closeDateFilter, setCloseDateFilter] = useState("");
  const itemsPerPage = 8;

  // Filtering Logic
  const filteredDeals = deals.filter((deal) => {
    const matchesSearch =
      deal.dealName.toLowerCase().includes(search.toLowerCase()) ||
      deal.dealOwner.toLowerCase().includes(search.toLowerCase());
    const matchesOwner = !ownerFilter || deal.dealOwner === ownerFilter;
    const matchesStage = !stageFilter || deal.dealStage === stageFilter;
    const matchesDate = !closeDateFilter || deal.closeDate === closeDateFilter;
    return matchesSearch && matchesOwner && matchesStage && matchesDate;
  });

  // Pagination Logic
  const totalPages = Math.ceil(filteredDeals.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentDeals = filteredDeals.slice(
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
    setEditingDeal(row);
    setFormData(row);
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    setDealToDelete(row);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (dealToDelete) {
      dispatch(removeDeal(dealToDelete._id));
      toast.success("Deal deleted successfully");
      dispatch(addNotification({
        id: Date.now(),
        message: `Deal ${dealToDelete.dealName} deleted successfully!`,
        type: "delete",
        timestamp: new Date().toLocaleString()
      }));
    }
  };

  const handleOpenModal = () => {
    setEditingDeal(null);
    setFormData({}); // Reset form
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDeal = () => {
    if (editingDeal) {
      dispatch(updateDeal(formData));
    } else {
      const newDeal = {
        _id: Date.now().toString(),
        ...formData,
        amount: Number(formData.amount),
      };

      if (newDeal.closeDate) {
        const dateObj = new Date(newDeal.closeDate);
        newDeal.closeDate = dateObj.toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        });
      }

      dispatch(addDeal(newDeal));
    }
    handleCloseModal();
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const columns = [
    {
      key: "dealName",
      label: "DEAL NAME",
      render: (row) => (
        <Link
          to={`/deals/${row._id}`}
          style={{ textDecoration: "none", color: "#111827", fontWeight: 600 }}
        >
          {row.dealName}
        </Link>
      ),
    },
    { key: "dealStage", label: "DEAL STAGE" },
    { key: "closeDate", label: "CLOSE DATE" },
    { key: "dealOwner", label: "DEAL OWNER" },
    {
      key: "amount",
      label: "AMOUNT",
      render: (row) => formatCurrency(row.amount),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.mainCard}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Deals</h1>
          <div className={styles.headerActions}>
            <ImportButton className={styles.importBtn} />
            <button className={styles.addBtn} onClick={handleOpenModal}>
              Create
            </button>
          </div>
        </div>

        <hr className={styles.divider} />

        {/* Controls: Search & Filters */}
        <div className={styles.controls}>
          <SearchInput
            value={search}
            onChange={handleSearchChange}
            placeholder="Search phone, name, city"
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

        {/* Filter Row */}
        <div className={styles.filterRow}>
          <div className={styles.selectWrapper}>
            <select
              className={styles.select}
              value={ownerFilter}
              onChange={(e) => { setOwnerFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Deal Owner</option>
              <option value="Jane Cooper">Jane Cooper</option>
              <option value="Wade Warren">Wade Warren</option>
              <option value="Brooklyn Simmons">Brooklyn Simmons</option>
              <option value="Leslie Alexander">Leslie Alexander</option>
              <option value="Jenny Wilson">Jenny Wilson</option>
              <option value="Guy Hawkins">Guy Hawkins</option>
              <option value="Robert Fox">Robert Fox</option>
              <option value="Cameron Williamson">Cameron Williamson</option>
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
            <select
              className={styles.select}
              value={stageFilter}
              onChange={(e) => { setStageFilter(e.target.value); setCurrentPage(1); }}
            >
              <option value="">Deal Stage</option>
              <option value="Presentation Scheduled">Presentation Scheduled</option>
              <option value="Qualified to Buy">Qualified to Buy</option>
              <option value="Contract Sent">Contract Sent</option>
              <option value="Appointment Scheduled">Appointment Scheduled</option>
              <option value="Decision Maker Bought In">Decision Maker Bought In</option>
              <option value="Closed Won">Closed Won</option>
              <option value="Closed Lost">Closed Lost</option>
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
            data={currentDeals}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelectionChange={(selected) => console.log("Selected:", selected)}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDeal ? "Edit Deal" : "Create Deal"}
        onSave={handleSaveDeal}
      >
        <DealForm formData={formData} onChange={handleInputChange} />
      </Modal>

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={confirmDelete}
        title="Delete Deal"
        message={`Are you sure you want to delete ${dealToDelete?.dealName}?`}
      />
    </div>
  );
}
