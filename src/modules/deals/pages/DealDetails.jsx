import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateDeal } from "../../../redux/dealsSlice";
import { addNotification } from "../../../redux/notificationsSlice";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";
import { toast } from "react-hot-toast";

const DealDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const deals = useSelector(state => state.deals.deals);
  const dealData = deals.find(d => d._id === id);

  const [deal, setDeal] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (dealData) {
      setDeal(dealData);
      setActivities(generateActivities(dealData.dealName));
    }
  }, [dealData, id]);

  const generateActivities = (dealName) => [
    {
      id: 1,
      group: "Upcoming",
      type: "Task",
      title: `Follow up on requirements for ${dealName}`,
      time: "June 24, 2025 at 5:30PM",
      overdue: true,
      content: `Prepare quote for ${dealName}`,
      isTask: true,
      completed: false,
      priority: "High",
      taskType: "To-Do"
    },
    {
      id: 3,
      group: "June 2025",
      type: "Call",
      title: "Negotiation Call",
      time: "June 20, 2025 at 2:30PM",
      content: `Discussed pricing terms for ${dealName}.`,
    },
  ];

  const handleFieldChange = (field, value) => {
    setDeal(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    dispatch(updateDeal(deal));
  };

  const handleDeleteDeal = () => {
    toast.success(`${deal.dealName} deleted successfully.`);
    dispatch(addNotification({
      id: Date.now(),
      message: `Deal ${deal.dealName} deleted successfully!`,
      type: "delete",
      timestamp: new Date().toLocaleString()
    }));
    navigate("/deals");
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
      { key: "createdDate", label: "Created Date" },
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
    />
  );
};

export default DealDetails;
