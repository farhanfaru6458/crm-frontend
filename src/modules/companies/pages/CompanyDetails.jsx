import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateCompany } from "../../../redux/companiesSlice";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";

const CompanyDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const companies = useSelector(state => state.companies.companies);
  const companyData = companies.find(c => c._id === id);

  const [company, setCompany] = useState(null);
  const [activities, setActivities] = useState([]);

  useEffect(() => {
    if (companyData) {
      setCompany(companyData);
      setActivities(generateActivities(companyData.name));
    }
  }, [companyData, id]);

  const generateActivities = (compName) => [
    {
      id: 1,
      group: "Upcoming",
      type: "Task",
      title: `Follow up with ${compName}`,
      time: "June 24, 2025 at 5:30PM",
      overdue: true,
      content: `Prepare quote for ${compName}`,
      isTask: true,
      completed: false,
      priority: "High",
      taskType: "To-Do"
    },
    {
      id: 3,
      group: "June 2025",
      type: "Call",
      title: "Discovery Call",
      time: "June 20, 2025 at 10:30AM",
      content: `Discussed potential partnership with ${compName}.`,
    },
  ];

  const handleFieldChange = (field, value) => {
    setCompany(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    dispatch(updateCompany(company));
  };

  const handleDeleteCompany = () => {
    alert(`${company.name} deleted successfully.`);
    navigate("/companies");
  };

  const config = {
    moduleName: "Companies",
    entityName: "Company",
    backLink: "/companies",
    titleField: "name",
    subTitleField: "industry",
    websiteField: "website",
    showAvatar: true,
    detailsFields: [
      { key: "name", label: "Company Name" },
      { key: "industry", label: "Industry" },
      { key: "website", label: "Website" },
      { key: "phone", label: "Phone number" },
      { key: "owner", label: "Company Owner" },
      { key: "city", label: "City" },
      { key: "country", label: "Country/Region" },
      { key: "employees", label: "No of Employees" },
      { key: "revenue", label: "Annual Revenue" },
      { key: "createdAt", label: "Created Date" },
    ],
    editFields: [
      { key: "name", label: "Company Name" },
      { key: "industry", label: "Industry" },
      { key: "website", label: "Website" },
      { key: "phone", label: "Phone number" },
    ],
  };

  if (!company) return <div>Loading...</div>;

  return (
    <GenericDetails
      entity={company}
      activities={activities}
      config={config}
      onFieldChange={handleFieldChange}
      onSaveEdit={handleSaveEdit}
      onDelete={handleDeleteCompany}
    />
  );
};

export default CompanyDetails;
