import React, { useEffect, useMemo, useState } from "react";
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
import CustomSelect from "../../../components/ui/CustomSelect/CustomSelect";
import { useAuth } from "../../../context/AuthContext";

import { useSelector, useDispatch } from "react-redux";
import { fetchDeals, removeDeal, addDeal, updateDeal, bulkDeleteDeals, bulkAddDeals } from "../../../redux/dealsSlice";

export default function Deals() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { deals, loading } = useSelector((state) => state.deals);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [dealToDelete, setDealToDelete] = useState(null);
  const [editingDeal, setEditingDeal] = useState(null);
  const [formData, setFormData] = useState({});
  const [selectedDeals, setSelectedDeals] = useState([]);
  const [errors, setErrors] = useState({});

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [ownerFilter, setOwnerFilter] = useState("");
  const [stageFilter, setStageFilter] = useState("");
  const [closeDateFilter, setCloseDateFilter] = useState("");
  const itemsPerPage = 8;

  useEffect(() => {
    dispatch(fetchDeals());
  }, [dispatch]);

  // Filtering Logic
  const filteredDeals = (deals || []).filter((deal) => {
    const searchTerm = (search || "").toLowerCase();
    const matchesSearch =
      (deal.dealName || "").toLowerCase().includes(searchTerm) ||
      (deal.dealOwner || "").toLowerCase().includes(searchTerm);

    const matchesOwner = !ownerFilter || deal.dealOwner === ownerFilter;
    const matchesStage = !stageFilter || deal.dealStage === stageFilter;

    return matchesSearch && matchesOwner && matchesStage;
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
    setErrors({});
    setIsModalOpen(true);
  };

  const handleDelete = (row) => {
    setDealToDelete(row);
    setIsConfirmOpen(true);
  };

  const confirmDelete = async () => {
    try {
      if (dealToDelete) {
        if (Array.isArray(dealToDelete)) {
          // Bulk delete
          await dispatch(bulkDeleteDeals(dealToDelete)).unwrap();
          toast.success(`${dealToDelete.length} deals deleted successfully`);
          setSelectedDeals([]);
        } else {
          // Single delete
          await dispatch(removeDeal(dealToDelete._id)).unwrap();
          toast.success("Deal deleted successfully");
          dispatch(addNotification({
            id: Date.now(),
            message: `Deal ${dealToDelete.dealName} deleted successfully!`,
            type: "delete",
            timestamp: new Date().toLocaleString()
          }));
        }
        setDealToDelete(null);
      }
    } catch (error) {
      toast.error("Delete failed");
    }
    setIsConfirmOpen(false);
  };

  const handleBulkDelete = () => {
    setDealToDelete(selectedDeals);
    setIsConfirmOpen(true);
  };

  const handleOpenModal = () => {
    setEditingDeal(null);
    setFormData({
      dealOwner: user ? `${user.firstName} ${user.lastName}` : ""
    });
    setErrors({});
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleInputChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSaveDeal = async () => {
    const newErrors = {};
    if (!formData.dealName?.trim()) newErrors.dealName = "Deal name is required";
    if (!formData.dealStage) newErrors.dealStage = "Deal stage is required";
    if (!formData.amount) newErrors.amount = "Amount is required";
    if (!formData.dealOwner) newErrors.dealOwner = "Deal owner is required";
    if (!formData.closeDate) newErrors.closeDate = "Close date is required";
    if (!formData.priority) newErrors.priority = "Priority is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    try {
      if (editingDeal) {
        await dispatch(updateDeal(formData)).unwrap();
        toast.success("Deal updated successfully");
      } else {
        await dispatch(addDeal(formData)).unwrap();
        toast.success("Deal created successfully");
      }
      handleCloseModal();
    } catch (error) {
      toast.error(error?.message || "Operation failed");
    }
  };

  const handleImport = async (data) => {
    try {
      await dispatch(bulkAddDeals(data)).unwrap();
      toast.success(`${data.length} deals imported successfully!`);
      dispatch(addNotification({
        id: Date.now(),
        message: `${data.length} deals imported successfully!`,
        type: "create",
        timestamp: new Date().toLocaleString()
      }));
    } catch (error) {
      toast.error("Bulk import failed. Please check the CSV format.");
    }
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
          className={styles.dealLink}
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

  const owners = useMemo(() => {
    const uniqueOwners = [...new Set((deals || []).map(d => d.dealOwner).filter(Boolean))];
    return uniqueOwners.sort();
  }, [deals]);

  const stages = useMemo(() => {
    const uniqueStages = [...new Set((deals || []).map(d => d.dealStage).filter(Boolean))];
    return uniqueStages.sort();
  }, [deals]);

  return (
    <div className={styles.container}>
      <div className={styles.mainCard}>
        {/* Header */}
        <div className={styles.header}>
          <h1 className={styles.title}>Deals</h1>
          <div className={styles.headerActions}>
            {selectedDeals.length > 0 && (
              <button className={styles.bulkDeleteBtn} onClick={handleBulkDelete}>
                Delete Selected ({selectedDeals.length})
              </button>
            )}
            <ImportButton className={styles.importBtn} onImport={handleImport} />
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

        <div className={styles.filterRow}>
          <div className={styles.filterSelectWrapper}>
            <CustomSelect
              placeholder="Deal Owner"
              value={ownerFilter}
              onChange={(val) => { setOwnerFilter(val); setCurrentPage(1); }}
              options={owners}
            />
          </div>

          <div className={styles.filterSelectWrapper}>
            <CustomSelect
              placeholder="Deal Stage"
              value={stageFilter}
              onChange={(val) => { setStageFilter(val); setCurrentPage(1); }}
              options={stages}
            />
          </div>



          <div className={styles.selectWrapper}>
            <input
              type="date"
              className={styles.dateInput}
              value={closeDateFilter}
              onChange={(e) => { setCloseDateFilter(e.target.value); setCurrentPage(1); }}
            />

          </div>
        </div>

        {/* Table */}
        <div className={styles.tableCard}>
          <Table
            columns={columns}
            data={currentDeals}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onSelectionChange={setSelectedDeals}
            selectedRows={selectedDeals}
          />
        </div>
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={editingDeal ? "Edit Deal" : "Create Deal"}
        onSave={handleSaveDeal}
      >
        <DealForm formData={formData} onChange={handleInputChange} errors={errors} />
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
