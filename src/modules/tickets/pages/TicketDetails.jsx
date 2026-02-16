import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";

const MOCK_TICKETS = [
  {
    _id: "1",
    name: "Payment Failure Issue",
    description: "Customer unable to complete payment.",
    status: "New",
    owner: "Jane Cooper",
    priority: "High",
    source: "Email",
    createdAt: "04/08/2025 2:31 PM GMT+5:30",
  },
  {
    _id: "2",
    name: "Product Inquiry",
    status: "Waiting on us",
    priority: "Medium",
    source: "Email",
    owner: "Wade Warren",
    createdAt: "Apr 8, 2025 2:35 PM",
  },
];

const DEFAULT_TICKET = MOCK_TICKETS[0];

const TicketDetails = () => {
  const { id } = useParams();
  const [ticket, setTicket] = useState(DEFAULT_TICKET);
  const [activities, setActivities] = useState([]);

  const generateActivities = (ticketName) => [
    {
      id: 1,
      group: "Upcoming",
      type: "Task",
      title: `Task assigned to Maria Johnson`,
      time: "June 24, 2025 at 5:30PM",
      overdue: true,
      content: `Investigate ${ticketName}`,
      isTask: true,
      completed: false,
      priority: "High",
      taskType: "To-Do",
    },
    {
      id: 2,
      group: "June 2025",
      type: "Note",
      title: "Note by Maria Johnson",
      time: "June 24, 2025 at 5:30PM",
      content: `Customer reported issue via email.`,
    },
  ];

  useEffect(() => {
    const found = MOCK_TICKETS.find((t) => t._id === id);
    if (found) {
      setTicket(found);
      setActivities(generateActivities(found.name));
    } else {
      setTicket(DEFAULT_TICKET);
      setActivities(generateActivities(DEFAULT_TICKET.name));
    }
  }, [id]);

  const handleFieldChange = (field, value) => {
    setTicket((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    console.log("Saved Ticket:", ticket);
  };

  const config = {
    moduleName: "Tickets",
    entityName: "Ticket",
    backLink: "/tickets",
    titleField: "name",
    subTitleField: "status",
    showAvatar: true,
    detailsFields: [
      { key: "name", label: "Ticket Name" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
      { key: "source", label: "Source" },
      { key: "owner", label: "Owner" },
      { key: "createdAt", label: "Created Date" },
    ],
    editFields: [
      { key: "name", label: "Ticket Name" },
      { key: "status", label: "Status" },
      { key: "priority", label: "Priority" },
      { key: "source", label: "Source" },
    ],
  };

  return (
    <GenericDetails
      entity={ticket}
      activities={activities}
      config={config}
      onFieldChange={handleFieldChange}
      onSaveEdit={handleSaveEdit}
    />
  );
};

export default TicketDetails;
