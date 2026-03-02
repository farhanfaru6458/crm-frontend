import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { fetchLeads, updateLead, removeLead } from "../../../redux/leadsSlice";
import { addDeal } from "../../../redux/dealsSlice";
import { addNotification } from "../../../redux/notificationsSlice";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";
import { toast } from "react-hot-toast";

const API_BASE = "http://localhost:5000/api";
const ENTITY_TYPE = "Lead";

const LeadDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { leads } = useSelector(state => state.leads);
    const leadData = leads.find(l => l._id === id);

    const [lead, setLead] = useState(null);
    const [activities, setActivities] = useState([]);

    const fetchLead = async () => {
        try {
            const { data } = await axios.get(`${API_BASE}/leads/${id}`);
            setLead(data.data);
        } catch (error) {
            toast.error("Failed to load lead details");
        }
    };

    const fetchActivities = async () => {
        try {
            const { data } = await axios.get(`${API_BASE}/activities/${ENTITY_TYPE}/${id}`);
            setActivities(data.data);
        } catch (error) {
            toast.error("Failed to load activities");
        }
    };

    useEffect(() => {
        fetchLead();
        fetchActivities();
    }, [id]);

    useEffect(() => {
        if (leadData) {
            setLead(leadData);
        }
    }, [leadData]);

    const handleFieldChange = (field, value) => {
        setLead(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = async () => {
        try {
            const result = await dispatch(updateLead(lead)).unwrap();
            setLead(result);
            toast.success("Lead updated successfully");
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleDeleteLead = async () => {
        try {
            await dispatch(removeLead(id)).unwrap();
            toast.success("Lead deleted successfully");
            dispatch(addNotification({
                id: Date.now(),
                message: `Lead ${lead.name} deleted successfully!`,
                type: "delete",
                timestamp: new Date().toLocaleString()
            }));
            navigate("/leads");
        } catch (error) {
            toast.error("Delete failed");
        }
    };

    const handleCreateActivity = async (activityData) => {
        try {
            await axios.post(`${API_BASE}/activities/${ENTITY_TYPE}/${id}`, activityData);
            fetchActivities();
        } catch (error) {
            toast.error("Activity creation failed");
        }
    };

    const handleUpdateActivity = async (activityId, updates) => {
        try {
            await axios.put(`${API_BASE}/activities/${activityId}`, updates);
            fetchActivities();
        } catch (error) {
            toast.error("Activity update failed");
        }
    };

    const handleToggleTask = async (taskId) => {
        try {
            await axios.put(`${API_BASE}/tasks/${taskId}/toggle`);
            fetchActivities();
        } catch (error) {
            toast.error("Task update failed");
        }
    };

    const config = {
        moduleName: "Leads",
        entityName: "Lead",
        backLink: "/leads",
        titleField: "name",
        subTitleRender: (entity) => `${entity.jobTitle || "Lead"} at ${entity.company || "Unknown Company"}`,
        showAvatar: true,
        detailsFields: [
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "company", label: "Company" },
            { key: "status", label: "Status" },
            { key: "owner", label: "Owner" },
            { key: "city", label: "City" },
            { key: "country", label: "Country" },
            { key: "createdAt", label: "Created Date", render: (val) => new Date(val).toLocaleDateString() },
        ],
        editFields: [
            { key: "name", label: "Lead Name" },
            { key: "email", label: "Email" },
            { key: "jobTitle", label: "Job Title" },
            { key: "company", label: "Company" },
            { key: "phone", label: "Phone" },
        ],
    };

    const handleConvertLead = (convertData) => {
        const newDeal = {
            dealName: convertData.dealName,
            dealStage: convertData.dealStage,
            amount: convertData.amount,
            closeDate: convertData.closeDate,
            dealOwner: convertData.dealOwner,
            associatedLeadId: lead._id
        };

        dispatch(addDeal(newDeal));
        const updatedLead = { ...lead, status: "Converted" };
        dispatch(updateLead(updatedLead));

        toast.success(`Lead converted to Deal successfully!`);
        navigate("/deals");
    };

    if (!lead) return <div>Loading...</div>;

    return (
        <GenericDetails
            entity={lead}
            activities={activities}
            config={config}
            onFieldChange={handleFieldChange}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDeleteLead}
            onCreateActivity={handleCreateActivity}
            onUpdateActivity={handleUpdateActivity}
            onToggleTask={handleToggleTask}
            showConvertButton={lead.status !== "Converted"}
            onConvert={handleConvertLead}
        />
    );
};

export default LeadDetails;
