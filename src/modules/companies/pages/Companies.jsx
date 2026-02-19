import React, { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import Table from "../../../components/ui/Table";
import SearchInput from "../../../components/ui/SearchInput";
import Pagination from "../../../components/ui/Pagination";
import Modal from "../../../components/ui/Modal";
import CompanyForm from "../components/CompanyForm";
import styles from "./Companies.module.css";

import { useSelector, useDispatch } from "react-redux";
import { setCompanies, removeCompany, addCompany, updateCompany } from "../../../redux/companiesSlice";
import ImportButton from "../../../components/ui/buttons/ImportButton";

const Companies = () => {
  const dispatch = useDispatch();
  const companies = useSelector((state) => state.companies.companies);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCompany, setEditingCompany] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;
  const [filters, setFilters] = useState({
    industry: "",
    city: "",
    country: "",
  });

  const [formData, setFormData] = useState({});

  // Handlers
  const handleFormChange = (name, value) => {
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleOpenCreate = () => {
    setEditingCompany(null);
    setFormData({});
    setIsModalOpen(true);
  };

  const handleOpenEdit = (company) => {
    setEditingCompany(company);
    setFormData(company);
    setIsModalOpen(true);
  };

  const handleSave = () => {
    if (editingCompany) {
      // Update
      dispatch(updateCompany(formData));
    } else {
      // Create
      const newCompany = {
        ...formData,
        _id: Math.random().toString(36).substr(2, 9),
        createdAt: new Date().toLocaleString(),
      };
      dispatch(addCompany(newCompany));
    }
    setIsModalOpen(false);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this company?")) {
      dispatch(removeCompany(id));
    }
  };

  const handleFilterChange = (name, value) => {
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  // Filtered Data
  const filteredCompanies = useMemo(() => {
    return companies.filter((c) => {
      const matchesSearch =
        c.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.owner.toLowerCase().includes(searchTerm.toLowerCase()) ||
        c.phone.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesIndustry = !filters.industry || c.industry === filters.industry;
      const matchesCity = !filters.city || c.city === filters.city;
      const matchesCountry = !filters.country || c.country === filters.country;

      return matchesSearch && matchesIndustry && matchesCity && matchesCountry;
    });
  }, [companies, searchTerm, filters]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredCompanies.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const currentCompanies = filteredCompanies.slice(startIndex, startIndex + itemsPerPage);

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
    { key: "createdAt", label: "CREATED DATE", width: "18%" },
  ];

  return (
    <div className={styles.container}>
      <div className={styles.mainCard}>
        <header className={styles.header}>
          <h1 className={styles.title}>Companies</h1>
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
            data={currentCompanies}
            onEdit={handleOpenEdit}
            onDelete={(row) => handleDelete(row._id)}
          />
        </div>

        <Modal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          title={editingCompany ? "Edit Company" : "Create Company"}
          onSave={handleSave}
        >
          <CompanyForm formData={formData} onChange={handleFormChange} />
        </Modal>
      </div>
    </div>
  );
};

export default Companies;


