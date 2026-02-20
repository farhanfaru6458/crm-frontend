import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateTicket } from "../../../redux/ticketsSlice";
import { addNotification } from "../../../redux/notificationsSlice";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";
import { toast } from "react-hot-toast";

const TicketDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const tickets = useSelector(state => state.tickets.tickets);
  const ticketData = tickets.find(t => t._id === id);

  const [ticket, setTicket] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (ticketData) {
      setTicket(ticketData);
      setActivities(generateActivities(ticketData.name));
    }
  }, [ticketData, id]);

  const generateActivities = (ticketName) => [
    {
      id: 1,
      group: "Upcoming",
      type: "Task",
      title: `Task assigned to IT Team`,
      time: "June 24, 2025 at 5:30PM",
      overdue: true,
      content: `Investigate ${ticketName}`,
      isTask: true,
      completed: false,
      priority: "High",
      taskType: "To-Do"
    },
    {
      id: 2,
      group: "Recent",
      type: "Call",
      title: "Discovery Call",
      time: "June 23, 2025 at 11:00 AM",
      content: `Initial discovery call for ${ticketName}. Customer explained the issue in detail.`,
      outcome: "Connected",
      duration: "15 mins"
    },
    {
      id: 3,
      group: "June 2025",
      type: "Note",
      title: "Note by Support System",
      time: "June 22, 2025 at 9:30 AM",
      content: `Internal ticket created for ${ticketData?.source || 'Source'} issue.`,
    },
  ];

  const handleFieldChange = (field, value) => {
    setTicket(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    dispatch(updateTicket(ticket));
  };

  const handleDeleteTicket = () => {
    toast.success(`${ticket.name} deleted successfully.`);
    dispatch(addNotification({
      id: Date.now(),
      message: `Ticket ${ticket.name} deleted successfully!`,
      type: "delete",
      timestamp: new Date().toLocaleString()
    }));
    navigate("/tickets");
  };

  const config = {
    moduleName: "Tickets",
    entityName: "Ticket",
    backLink: "/tickets",
    titleField: "name",
    subTitleRender: (entity) => `Status: ${entity.status} | Priority: ${entity.priority}`,
    showAvatar: true,
    detailsFields: [
      { key: "name", label: "Ticket Name" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
      { key: "source", label: "Source" },
      { key: "owner", label: "Owner" },
      { key: "createdAt", label: "Created Date" },
    ],
    editFields: [
      { key: "name", label: "Ticket Name" },
      { key: "description", label: "Description" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
      { key: "source", label: "Source" },
      { key: "owner", label: "Owner" },
    ],
  };

  if (!ticket) return <div>Loading...</div>;

  return (
    <GenericDetails
      entity={ticket}
      activities={activities}
      config={config}
      onFieldChange={handleFieldChange}
      onSaveEdit={handleSaveEdit}
      onDelete={handleDeleteTicket}
    />
  );
};

export default TicketDetails;
