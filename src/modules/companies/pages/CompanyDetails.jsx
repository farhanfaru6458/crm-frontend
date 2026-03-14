import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { useSelector, useDispatch } from "react-redux";
import { fetchLeads } from "../../../redux/leadsSlice";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";
import { toast } from "react-hot-toast";

const API_BASE = "http://localhost:5000/api";
const ENTITY_TYPE = "Company";
const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const dispatch = useDispatch();
  const { leads } = useSelector((state) => state.leads);

  const [company, setCompany] = useState(null);
  const [activities, setActivities] = useState([]);

  // ================= FETCH COMPANY =================
  const fetchCompany = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/companies/${id}`);
      setCompany(data.data);
    } catch (error) {
      toast.error("Failed to load company");
    }
  };

  // ================= FETCH ACTIVITIES =================
  const fetchActivities = async () => {
    try {
      const { data } = await axios.get(`${API_BASE}/activities/${ENTITY_TYPE}/${id}`)

      setActivities(data.data);
    } catch (error) {
      toast.error("Failed to load activities");
    }
  };

  useEffect(() => {
    if (leads.length === 0) dispatch(fetchLeads());
    fetchCompany();
    fetchActivities();
  }, [id, dispatch]);

  useEffect(() => {
    if (company && !company.email && leads.length > 0) {
        const companyLead = leads.find(l => l.company && l.company.toLowerCase() === company.name.toLowerCase());
        if (companyLead && companyLead.email) {
            setCompany(prev => prev.email === companyLead.email ? prev : { ...prev, email: companyLead.email });
        }
    }
  }, [company, leads]);

  // ================= COMPANY EDIT =================
  const handleFieldChange = (field, value) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async () => {
    try {
      const { data } = await axios.put(
        `${API_BASE}/companies/${id}`,
        company
      );
      setCompany(data.data);
      toast.success("Company updated successfully");
    } catch (error) {
      toast.error("Update failed");
    }
  };

  const handleDeleteCompany = async () => {
    try {
      await axios.delete(`${API_BASE}/companies/${id}`);
      toast.success("Company deleted");
      navigate("/companies");
    } catch (error) {
      toast.error("Delete failed");
    }
  };

  // ================= CREATE ACTIVITY =================
  const handleCreateActivity = async (activityData) => {
    try {
      await axios.post(
        `${API_BASE}/activities/${ENTITY_TYPE}/${id}`,
        activityData
      );
      fetchActivities();
    } catch (error) {
      toast.error("Activity creation failed");
    }
  };

  // ================= UPDATE ACTIVITY =================
  const handleUpdateActivity = async (activityId, updates) => {
    try {
      await axios.put(
        `${API_BASE}/activities/${activityId}`,
        updates
      );
      fetchActivities();
    } catch (error) {
      toast.error("Activity update failed");
    }
  };

  // ================= TOGGLE TASK =================
  const handleToggleTask = async (taskId) => {
    try {
      await axios.put(`${API_BASE}/tasks/${taskId}/toggle`);
      fetchActivities();
    } catch (error) {
      toast.error("Task update failed");
    }
  };

  if (!company) return <div>Loading...</div>;

  // ================= CONFIG FOR GENERIC DETAILS =================
  const config = {
    moduleName: "Companies",
    entityName: "Company",
    backLink: "/companies",
    titleField: "name",
    subTitleField: "industry",
    websiteField: "domain",
    showAvatar: true,

    detailsFields: [
      { key: "name", label: "Company Name" },
      { key: "email", label: "Email" },
      { key: "industry", label: "Industry" },
      { key: "domain", label: "Domain" },
      { key: "phone", label: "Phone Number" },
      { key: "owner", label: "Company Owner" },
      { key: "city", label: "City" },
      { key: "country", label: "Country/Region" },
      { key: "type", label: "Type" },
      { key: "employees", label: "No of Employees" },
      { key: "revenue", label: "Annual Revenue" },
      { key: "createdAt", label: "Created Date" },
    ],

    editFields: [
      { key: "name", label: "Company Name" },
      { key: "email", label: "Email", type: "email" },
      { key: "industry", label: "Industry" },
      { key: "phone", label: "Phone Number" },
      { key: "city", label: "City" },
      { key: "country", label: "Country/Region" },
    ],
  };

  return (
    <GenericDetails
      entity={company}
      activities={activities}
      config={config}
      onFieldChange={handleFieldChange}
      onSaveEdit={handleSaveEdit}
      onDelete={handleDeleteCompany}
      onCreateActivity={handleCreateActivity}
      onUpdateActivity={handleUpdateActivity}
      onToggleTask={handleToggleTask}
    />
  );
};

export default CompanyDetails;