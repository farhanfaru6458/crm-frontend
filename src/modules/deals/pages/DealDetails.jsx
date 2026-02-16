import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";

const MOCK_DEALS = [
  {
    _id: "1",
    dealName: "Website Revamp - Atlas Corp",
    dealStage: "Presentation Scheduled",
    closeDate: "Apr 8, 2025",
    dealOwner: "Jane Cooper",
    amount: 12500,
    priority: "High",
    createdDate: "04/08/2025 2:31 PM GMT+5:30",
  },
  {
    _id: "2",
    dealName: "Mobile App for FitBuddy",
    dealStage: "Qualified to Buy",
    closeDate: "Apr 8, 2025",
    dealOwner: "Wade Warren",
    amount: 25000,
    priority: "Medium",
    createdDate: "04/08/2025 2:45 PM GMT+5:30",
  },
];

const DEFAULT_DEAL = MOCK_DEALS[0];

const DealDetails = () => {
  const { id } = useParams();
  const [deal, setDeal] = useState(DEFAULT_DEAL);
  const [activities, setActivities] = useState([]);

  const generateActivities = (dealName) => [
    {
      id: 1,
      group: "Upcoming",
      type: "Task",
      title: `Task assigned to Maria Johnson`,
      time: "June 24, 2025 at 5:30PM",
      overdue: true,
      content: `Prepare quote for ${dealName}`,
      isTask: true,
      completed: false,
      priority: "High",
      taskType: "To-Do",
    },
    {
      id: 2,
      group: "Upcoming",
      type: "Task",
      title: `Task assigned to Maria Johnson`,
      time: "June 24, 2025 at 5:30PM",
      overdue: true,
      content: `Follow up on requirements for ${dealName}`,
      isTask: true,
      completed: false,
      priority: "Medium",
      taskType: "Follow-up",
    },
    {
      id: 3,
      group: "June 2025",
      type: "Call",
      title: "Call from Maria Johnson",
      time: "June 24, 2025 at 5:30PM",
      content: `Discussed requirement for ${dealName}.`,
    },
  ];

  useEffect(() => {
    const found = MOCK_DEALS.find((c) => c._id === id);
    if (found) {
      setDeal(found);
      setActivities(generateActivities(found.dealName));
    } else {
      setDeal(DEFAULT_DEAL);
      setActivities(generateActivities(DEFAULT_DEAL.dealName));
    }
  }, [id]);

  const handleFieldChange = (field, value) => {
    setDeal((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    console.log("Saved Deal:", deal);
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

    showAvatar: true,
    detailsFields: [
      { key: "dealName", label: "Deal Name" },
      { key: "dealStage", label: "Deal Stage" },
      { key: "amount", label: "Amount", render: formatCurrency },
      { key: "closeDate", label: "Close Date" },
      { key: "dealOwner", label: "Deal Owner" },
      { key: "priority", label: "Priority" },
      { key: "createdDate", label: "Created Date" },
    ],
    editFields: [
      { key: "dealName", label: "Deal Name" },
      { key: "amount", label: "Amount" },
      { key: "dealStage", label: "Stage" },
      { key: "closeDate", label: "Close Date" },
    ],
  };

  return (
    <GenericDetails
      entity={deal}
      activities={activities}
      config={config}
      onFieldChange={handleFieldChange}
      onSaveEdit={handleSaveEdit}
    />
  );
};

export default DealDetails;
