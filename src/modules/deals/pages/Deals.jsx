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

export default function Deals() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({});

  // Dummy data with MongoDB-like structure (_id)
  const [deals, setDeals] = useState([
    {
      _id: "1",
      dealName: "Website Revamp - Atlas Corp",
      dealStage: "Presentation Scheduled",
      closeDate: "Apr 8, 2025",
      dealOwner: "Jane Cooper",
      amount: 12500,
    },
    {
      _id: "2",
      dealName: "Mobile App for FitBuddy",
      dealStage: "Qualified to Buy",
      closeDate: "Apr 8, 2025",
      dealOwner: "Wade Warren",
      amount: 25000,
    },
    {
      _id: "3",
      dealName: "HR Software License - ZenoHR",
      dealStage: "Contract Sent",
      closeDate: "Apr 8, 2025",
      dealOwner: "Brooklyn Simmons",
      amount: 18750,
    },
    {
      _id: "4",
      dealName: "CRM Onboarding - NexTech",
      dealStage: "Closed Won",
      closeDate: "Apr 8, 2025",
      dealOwner: "Leslie Alexander",
      amount: 32000,
    },
    {
      _id: "5",
      dealName: "Marketing Suite - QuickAdz",
      dealStage: "Appointment Scheduled",
      closeDate: "Apr 8, 2025",
      dealOwner: "Jenny Wilson",
      amount: 14800,
    },
    {
      _id: "6",
      dealName: "Inventory Tool - GreenMart",
      dealStage: "Decision Maker Bought In",
      closeDate: "Apr 8, 2025",
      dealOwner: "Guy Hawkins",
      amount: 9300,
    },
    {
      _id: "7",
      dealName: "ERP Integration - BlueChip",
      dealStage: "Qualified to Buy",
      closeDate: "Apr 8, 2025",
      dealOwner: "Robert Fox",
      amount: 41000,
    },
    {
      _id: "8",
      dealName: "Loyalty Program - FoodieFox",
      dealStage: "Closed Lost",
      closeDate: "Apr 8, 2025",
      dealOwner: "Cameron Williamson",
      amount: 11000,
    },
  ]);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // Filtering Logic
  const filteredDeals = deals.filter(
    (deal) =>
      deal.dealName.toLowerCase().includes(search.toLowerCase()) ||
      deal.dealOwner.toLowerCase().includes(search.toLowerCase()),
  );

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
    console.log("Edit row:", row);
  };

  const handleDelete = (row) => {
    console.log("Delete row:", row);
  };

  const handleOpenModal = () => {
    setIsModalOpen(true);
    setFormData({}); // Reset form
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveDeal = () => {
    const newDeal = {
      _id: Date.now().toString(), // Temporary ID generation
      ...formData,
      amount: Number(formData.amount), // Ensure amount is number
    };

    // Format date for display if needed, or keep as YYYY-MM-DD
    // For consistency with dummy data (e.g., "Apr 8, 2025")
    if (newDeal.closeDate) {
      const dateObj = new Date(newDeal.closeDate);
      newDeal.closeDate = dateObj.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      });
    }

    setDeals((prev) => [newDeal, ...prev]);
    console.log("Saved Deal:", newDeal);
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
          <div className={styles.actions}>
            <ImportButton />
            <div className={styles.spacer}></div>
            <div onClick={handleOpenModal}>
              <CreateButton />
            </div>
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
            <select className={styles.select}>
              <option>Deal Owner</option>
              <option>Jane Cooper</option>
              <option>Wade Warren</option>
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
            <select className={styles.select}>
              <option>Deal Stage</option>
              <option>Qualified to Buy</option>
              <option>Closed Won</option>
              <option>Closed Lost</option>
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
              Close Date
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
        title="Create Deal"
        onSave={handleSaveDeal}
      >
        <DealForm formData={formData} onChange={handleInputChange} />
      </Modal>
    </div>
  );
}
