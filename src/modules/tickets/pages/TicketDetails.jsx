import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateTicket, removeTicket } from "../../../redux/ticketsSlice";
import { addNotification } from "../../../redux/notificationsSlice";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";
import { toast } from "react-hot-toast";
import axios from "../../../services/axiosInstance";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [ticket, setTicket] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchActivities = async (entityId) => {
    try {
      const { data } = await axios.get(`/activities/Ticket/${entityId}`);
      if (data && data.success) {
        setActivities(data.data || []);
      }
    } catch (err) {
      console.error("Failed to fetch activities:", err);
    }
  };

  useEffect(() => {
    const fetchTicketById = async () => {
      try {
        const { data } = await axios.get(`/tickets/${id}`);
        setTicket(data);
        setLoading(false);
        fetchActivities(id);
      } catch (err) {
        toast.error("Ticket not found");
        navigate("/tickets");
      }
    };
    fetchTicketById();
  }, [id, navigate]);

  const handleCreateActivity = async (activityData) => {
    try {
      const { data } = await axios.post(`/activities/Ticket/${id}`, activityData);
      if (data.success) {
        setActivities(prev => [data.data, ...prev]);
        toast.success(`${activityData.type} logged successfully`);
      }
    } catch (err) {
      toast.error("Failed to log activity");
    }
  };

  const handleFieldChange = (field, value) => {
    setTicket(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    dispatch(updateTicket(ticket))
      .unwrap()
      .then(() => toast.success("Ticket updated successfully"))
      .catch((err) => toast.error(err || "Update failed"));
  };

  const handleDeleteTicket = () => {
    dispatch(removeTicket(id))
      .unwrap()
      .then(() => {
        toast.success(`Ticket deleted successfully.`);
        dispatch(addNotification({
          id: Date.now(),
          message: `Ticket deleted successfully!`,
          type: "delete",
          timestamp: new Date().toLocaleString()
        }));
        navigate("/tickets");
      })
      .catch((err) => toast.error(err || "Delete failed"));
  };

  const config = {
    moduleName: "Tickets",
    entityName: "Ticket",
    backLink: "/tickets",
    titleField: "ticketName",
    subTitleRender: (entity) => `Status: ${entity.status} | Priority: ${entity.priority}`,
    showAvatar: false,
    detailsFields: [
      { key: "ticketName", label: "Ticket Name" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
      { key: "source", label: "Source" },
      { key: "owner", label: "Owner" },
      { key: "createdAt", label: "Created Date", render: (row) => new Date(row.createdAt).toLocaleDateString() },
    ],
    editFields: [
      { key: "ticketName", label: "Ticket Name" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
      { key: "source", label: "Source" },
      { key: "owner", label: "Owner" },
    ],
  };

  if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>;

  return (
    <GenericDetails
      entity={ticket}
      activities={activities}
      config={config}
      onFieldChange={handleFieldChange}
      onSaveEdit={handleSaveEdit}
      onDelete={handleDeleteTicket}
      onCreateActivity={handleCreateActivity}
    />
  );
};

export default TicketDetails;
