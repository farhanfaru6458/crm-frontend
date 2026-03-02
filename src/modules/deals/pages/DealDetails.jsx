import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import { fetchDeals, updateDeal, removeDeal } from "../../../redux/dealsSlice";
import { addNotification } from "../../../redux/notificationsSlice";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";
import { toast } from "react-hot-toast";

const API_BASE = "http://localhost:5000/api";
const ENTITY_TYPE = "Deal";

const DealDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const { deals } = useSelector(state => state.deals);
    const dealData = deals.find(d => d._id === id);

    const [deal, setDeal] = useState(null);
    const [activities, setActivities] = useState([]);

    const fetchDeal = async () => {
        try {
            const { data } = await axios.get(`${API_BASE}/deals/${id}`);
            setDeal(data.data);
        } catch (error) {
            toast.error("Failed to load deal details");
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
        fetchDeal();
        fetchActivities();
    }, [id]);

    useEffect(() => {
        if (dealData) {
            setDeal(dealData);
        }
    }, [dealData]);

    const handleFieldChange = (field, value) => {
        setDeal(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = async () => {
        try {
            const result = await dispatch(updateDeal(deal)).unwrap();
            setDeal(result);
            toast.success("Deal updated successfully");
        } catch (error) {
            toast.error("Update failed");
        }
    };

    const handleDeleteDeal = async () => {
        try {
            await dispatch(removeDeal(id)).unwrap();
            toast.success("Deal deleted successfully");
            dispatch(addNotification({
                id: Date.now(),
                message: `Deal ${deal.dealName} deleted successfully!`,
                type: "delete",
                timestamp: new Date().toLocaleString()
            }));
            navigate("/deals");
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat("en-US", {
            style: "currency",
            currency: "USD",
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    const config = {
        moduleName: "Deals",
        entityName: "Deal",
        backLink: "/deals",
        titleField: "dealName",
        showAvatar: false,
        subTitleRender: (entity) => `Amount: ${entity.amount} | Stage: ${entity.dealStage}`,
        detailsFields: [
            { key: "dealName", label: "Deal Name" },
            { key: "dealStage", label: "Deal Stage" },
            { key: "amount", label: "Amount", render: formatCurrency },
            { key: "closeDate", label: "Close Date" },
            { key: "dealOwner", label: "Deal Owner" },
            { key: "priority", label: "Priority" },
            { key: "createdDate", label: "Created Date", render: (val) => val ? new Date(val).toLocaleDateString() : 'N/A' },
        ],
        editFields: [
            { key: "dealName", label: "Deal Name" },
            { key: "amount", label: "Amount" },
            { key: "dealStage", label: "Stage" },
            { key: "closeDate", label: "Close Date" },
        ],
    };

    if (!deal) return <div>Loading...</div>;

    return (
        <GenericDetails
            entity={deal}
            activities={activities}
            config={config}
            onFieldChange={handleFieldChange}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDeleteDeal}
            onCreateActivity={handleCreateActivity}
            onUpdateActivity={handleUpdateActivity}
            onToggleTask={handleToggleTask}
        />
    );
};

export default DealDetails;
