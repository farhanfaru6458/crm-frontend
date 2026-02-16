import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";

const MOCK_LEADS = [
  {
    _id: "1",
    name: "Esther Howard",
    title: "Marketing Coordinator",
    company: "Acme Co",
    email: "esther@acme.com",
    phone: "078 5432 8505",
    leadStatus: "New",
    owner: "Jane Cooper",
    createdDate: "04/08/2025 2:31 PM GMT+5:30",
  },
  {
    _id: "2",
    name: "Cameron Williamson",
    title: "Sales Manager",
    company: "Globex",
    email: "cameron@globex.com",
    phone: "077 5465 8785",
    leadStatus: "Contacted",
    owner: "Wade Warren",
    createdDate: "04/08/2025 2:45 PM GMT+5:30",
  },
];

const DEFAULT_LEAD = MOCK_LEADS[0];

const LeadDetails = () => {
  const { id } = useParams();
  const [lead, setLead] = useState(DEFAULT_LEAD);
  const [activities, setActivities] = useState([]);

  const generateActivities = (leadName) => [
    {
      id: 1,
      group: "Upcoming",
      type: "Task",
      title: `Task assigned to Maria Johnson`,
      time: "June 24, 2025 at 5:30PM",
      overdue: true,
      content: `Follow up with ${leadName}`,
      isTask: true,
      completed: false,
      priority: "High",
      taskType: "Call",
    },
    {
      id: 2,
      group: "June 2025",
      type: "Call",
      title: "Call from Maria Johnson",
      time: "June 24, 2025 at 5:30PM",
      content: `Initial contact with ${leadName}.`,
    },
  ];

  useEffect(() => {
    const found = MOCK_LEADS.find((l) => l._id === id);
    if (found) {
      setLead(found);
      setActivities(generateActivities(found.name));
    } else {
      setLead(DEFAULT_LEAD);
      setActivities(generateActivities(DEFAULT_LEAD.name));
    }
  }, [id]);

  const handleFieldChange = (field, value) => {
    setLead((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    console.log("Saved Lead:", lead);
  };

  const config = {
    moduleName: "Leads",
    entityName: "Lead",
    backLink: "/leads",
    titleField: "name",
    subTitleField: "title",
    showAvatar: true,
    detailsFields: [
      { key: "name", label: "Name" },
      { key: "title", label: "Title" },
      { key: "company", label: "Company" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "leadStatus", label: "Lead Status" },
      { key: "owner", label: "Lead Owner" },
      { key: "createdDate", label: "Created Date" },
    ],
    editFields: [
      { key: "name", label: "Name" },
      { key: "title", label: "Title" },
      { key: "company", label: "Company" },
      { key: "email", label: "Email" },
      { key: "phone", label: "Phone" },
      { key: "leadStatus", label: "Status" },
    ],
  };

  return (
    <GenericDetails
      entity={lead}
      activities={activities}
      config={config}
      onFieldChange={handleFieldChange}
      onSaveEdit={handleSaveEdit}
    />
  );
};

export default LeadDetails;
