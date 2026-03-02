import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/ui/Table";
import SearchInput from "../../../components/ui/SearchInput";
import Pagination from "../../../components/ui/Pagination";
import Modal from "../../../components/ui/Modal";
import CompanyForm from "../components/CompanyForm";
import styles from "./Companies.module.css";

import { useSelector, useDispatch } from "react-redux";
import {
  fetchCompanies,
  addCompany,
  updateCompany,
  removeCompany,
  bulkDeleteCompanies,
  bulkAddCompanies,
} from "../../../redux/companiesSlice";

import { addNotification } from "../../../redux/notificationsSlice";
import { toast } from "react-hot-toast";
import ImportButton from "../../../components/ui/buttons/ImportButton";
import ConfirmDialog from "../../../components/ui/ConfirmDialog";

const Companies = () => {
  const dispatch = useDispatch();
  const { companies, loading } = useSelector((state) => state.companies);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [companyToDelete, setCompanyToDelete] = useState(null);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedCompanies, setSelectedCompanies] = useState([]);
  const [errors, setErrors] = useState({});
  const itemsPerPage = 8;

  const [filters, setFilters] = useState({
    industry: "",
    city: "",
    country: "",
    createdAt: "",
  });

  const [formData, setFormData] = useState({});

  // 🔥 Fetch companies from backend
  useEffect(() => {
    dispatch(fetchCompanies());
  }, [dispatch]);

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
    setEditingCompany(null);
    setFormData({});
    setErrors({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (company) => {
    setEditingCompany(company);
    setFormData(company);
    setErrors({});
    setIsModalOpen(true);
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.domain?.trim()) newErrors.domain = "Domain is required";
    if (!formData.name?.trim()) newErrors.name = "Company name is required";
    if (!formData.owner?.trim()) newErrors.owner = "Company owner is required";
    if (!formData.industry) newErrors.industry = "Industry is required";
    if (!formData.type) newErrors.type = "Type is required";
    if (!formData.phone?.trim()) newErrors.phone = "Phone number is required";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      toast.error("Please fix the errors in the form");
      return;
    }

    if (editingCompany) {
      dispatch(updateCompany(formData));
      toast.success("Company updated successfully");
    } else {
      dispatch(addCompany(formData));
      toast.success("Company created successfully");
    }
    setIsModalOpen(false);
  };

  const handleImport = async (data) => {
    try {
      await dispatch(bulkAddCompanies(data)).unwrap();
      toast.success(`${data.length} companies imported successfully!`);
      dispatch(
        addNotification({
          id: Date.now(),
          message: `${data.length} companies imported successfully!`,
          type: "create",
          timestamp: new Date().toLocaleString(),
        })
      );
    } catch (error) {
      toast.error("Bulk import failed. Please check the CSV format.");
    }
  };

  const handleDelete = (id) => {
    setCompanyToDelete(id);
    setIsConfirmOpen(true);
  };

  const confirmDelete = () => {
    if (companyToDelete) {
      if (Array.isArray(companyToDelete)) {
        // Bulk delete
        dispatch(bulkDeleteCompanies(companyToDelete));
        toast.success(`${companyToDelete.length} companies deleted successfully`);
        setSelectedCompanies([]);
      } else {
        // Single delete
        dispatch(removeCompany(companyToDelete));
        toast.success("Company deleted successfully");

        dispatch(
          addNotification({
            id: Date.now(),
            message: `Company deleted successfully!`,
            type: "delete",
            timestamp: new Date().toLocaleString(),
          })
        );
      }
      setIsConfirmOpen(false);
      setCompanyToDelete(null);
    }
  };

  const handleBulkDelete = () => {
    setCompanyToDelete(selectedCompanies);
    setIsConfirmOpen(true);
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.owner?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesIndustry =
        !filters.industry || c.industry === filters.industry;
      const matchesCity = !filters.city || c.city === filters.city;
      const matchesCountry =
        !filters.country || c.country === filters.country;

      let matchesDate = true;
      if (filters.createdAt) {
        const filterDate = new Date(filters.createdAt).toDateString();
        const companyDate = new Date(c.createdAt).toDateString();
        matchesDate = filterDate === companyDate;
      }

      return (
        matchesSearch &&
        matchesIndustry &&
        matchesCity &&
        matchesCountry &&
        matchesDate
      );
    });
  }, [companies, searchTerm, filters]);

  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCompanies = filteredCompanies.slice(
    startIndex,
    startIndex + itemsPerPage
  );

  const columns = [
    {
      key: "name",
      label: "COMPANY NAME",
      width: "15%",
      render: (row) => (
        <Link to={`/companies/${row._id}`} className={styles.companyLink}>
          {row.name}
        </Link>
      ),
    },
    { key: "owner", label: "COMPANY OWNER", width: "15%" },
    { key: "phone", label: "PHONE NUMBER", width: "12%" },
    { key: "industry", label: "INDUSTRY", width: "12%" },
    { key: "city", label: "CITY", width: "10%" },
    { key: "country", label: "COUNTRY/REGION", width: "13%" },
    {
      key: "createdAt",
      label: "CREATED DATE",
      width: "18%",
      render: (row) =>
        new Date(row.createdAt).toLocaleString(),
    },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.mainCard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Companies</h1>
          <div className={styles.headerActions}>
            {selectedCompanies.length > 0 && (
              <button className={styles.bulkDeleteBtn} onClick={handleBulkDelete}>
                Delete Selected ({selectedCompanies.length})
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
              placeholder="Search phone, name, city"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={styles.search}
            />
            <Pagination
              totalPages={totalPages}
              currentPage={currentPage}
              onPageChange={(page) => setCurrentPage(page)}
            />
          </div>
          <div className={styles.dropdownFiltersRow}>
            <select
              className={styles.filterSelect}
              value={filters.industry}
              onChange={(e) => handleFilterChange("industry", e.target.value)}
            >
              <option value="">Industry Type</option>
              <option value="Real Estate">Real Estate</option>
              <option value="Technology">Technology</option>
              <option value="Healthcare">Healthcare</option>
              <option value="Legal Services">Legal Services</option>
              <option value="Finance">Finance</option>
            </select>

            <select
              className={styles.filterSelect}
              value={filters.city}
              onChange={(e) => handleFilterChange("city", e.target.value)}
            >
              <option value="">City</option>
              <option value="Bangalore">Bangalore</option>
              <option value="Toronto">Toronto</option>
              <option value="Amsterdam">Amsterdam</option>
              <option value="San Francisco">San Francisco</option>
              <option value="New York">New York</option>
              <option value="London">London</option>
              <option value="Sydney">Sydney</option>
              <option value="Berlin">Berlin</option>
              <option value="Mumbai">Mumbai</option>
              <option value="Singapore">Singapore</option>
              <option value="Dubai">Dubai</option>
            </select>

            <select
              className={styles.filterSelect}
              value={filters.country}
              onChange={(e) => handleFilterChange("country", e.target.value)}
            >
              <option value="">Country/Region</option>
              <option value="India">India</option>
              <option value="Canada">Canada</option>
              <option value="Netherlands">Netherlands</option>
              <option value="USA">USA</option>
              <option value="UK">UK</option>
              <option value="Australia">Australia</option>
              <option value="Germany">Germany</option>
              <option value="Singapore">Singapore</option>
              <option value="UAE">UAE</option>
            </select>

            <div className={styles.datePicker}>
              <input
                type="date"
                className={styles.dateInput}
                value={filters.createdAt}
                onChange={(e) =>
                  handleFilterChange("createdAt", e.target.value)
                }
              />
            </div>
          </div>
          {loading ? (
            <p style={{ padding: "20px" }}>Loading...</p>
          ) : (
            <Table
              columns={columns}
              data={currentCompanies}
              onEdit={handleOpenEdit}
              onDelete={(row) => handleDelete(row._id)}
              onSelectionChange={setSelectedCompanies}
              selectedRows={selectedCompanies}
            />
          )}
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCompany ? "Edit Company" : "Create Company"}
          onSave={handleSave}
        >
          <CompanyForm formData={formData} onChange={handleFormChange} errors={errors} />
        </Modal>

        <ConfirmDialog
          isOpen={isConfirmOpen}
          onClose={() => setIsConfirmOpen(false)}
          onConfirm={confirmDelete}
          title="Delete Company"
          message="Are you sure you want to delete this company?"
        />
      </div>
    </div>
  );
};

export default Companies;