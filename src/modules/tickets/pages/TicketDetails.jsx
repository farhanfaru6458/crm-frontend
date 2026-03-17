import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateTicket, removeTicket } from "../../../redux/ticketsSlice";
import { fetchCompanies } from "../../../redux/companiesSlice";
import { fetchDeals } from "../../../redux/dealsSlice";
import { fetchLeads } from "../../../redux/leadsSlice";
import { addNotification } from "../../../redux/notificationsSlice";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";
import { toast } from "react-hot-toast";
import axios from "../../../services/axiosInstance";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { deals } = useSelector(state => state.deals);
  const { companies } = useSelector(state => state.companies);
  const { leads } = useSelector(state => state.leads);

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
    if (companies.length === 0) dispatch(fetchCompanies());
    if (deals.length === 0) dispatch(fetchDeals());
    if (leads.length === 0) dispatch(fetchLeads());
    
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
  }, [id, navigate, dispatch]);



  const handleCreateActivity = async (activityData) => {
    try {
      await axios.post(`/activities/Ticket/${id}`, activityData);
      fetchActivities(id);
      toast.success(`${activityData.type} logged successfully`);
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
      { 
        key: "associatedDealId", 
        label: "Associated Deal", 
        render: (deal) => {
          const d = typeof deal === 'object' ? deal : deals.find(x => x._id === deal);
          return d ? d.dealName : "None";
        }
      },
      { 
        key: "associatedCompanyId", 
        label: "Associated Company", 
        render: (co) => {
          const c = typeof co === 'object' ? co : companies.find(x => x._id === co);
          return c ? c.name : "None";
        }
      },
      { 
        key: "leadName", 
        label: "Associated Contact Info", 
        render: () => {
          if (!ticket) return "N/A";
          const currentDealId = typeof ticket.associatedDealId === 'object' ? ticket.associatedDealId?._id : ticket.associatedDealId;
          if (currentDealId) {
            const d = deals.find(d => d._id === currentDealId);
            if (d) {
               const currentLeadId = typeof d.associatedLeadId === 'object' ? d.associatedLeadId?._id : d.associatedLeadId;
               const l = leads.find(l => l._id === currentLeadId);
               return l ? `${l.name} (${l.email})` : "N/A";
            }
          }
          const currentCoId = typeof ticket.associatedCompanyId === 'object' ? ticket.associatedCompanyId?._id : ticket.associatedCompanyId;
          if (currentCoId) {
            const co = companies.find(c => c._id === currentCoId);
            if (co) {
               const l = leads.find(l => l.company && l.company.toLowerCase() === co.name.toLowerCase());
               return l ? `${l.name} (${l.email})` : "N/A";
            }
          }
          return "N/A";
        }
      },
      { key: "email", label: "Email" },
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
      { key: "email", label: "Email" },
      { 
        key: "associatedDealId", 
        label: "Deal", 
        type: "select",
        options: deals.map(d => ({ value: d._id, label: d.dealName }))
      },
      { 
        key: "associatedCompanyId", 
        label: "Company", 
        type: "select",
        options: companies.map(c => ({ value: c._id, label: c.name }))
      },
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
