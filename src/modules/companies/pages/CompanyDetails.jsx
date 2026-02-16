import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";

const MOCK_COMPANIES = [
  {
    _id: "1",
    name: "ClientEdge",
    industry: "Legal Services",
    website: "clientedge.com",
    domain: "clientedge.com",
    phone: "078 5432 8505",
    owner: "Jane Cooper",
    city: "Toronto",
    country: "Canada",
    employees: "50-100",
    revenue: "10,00,000",
    createdAt: "04/08/2025 2:35 PM GMT+5:30",
  },
  {
    _id: "2",
    name: "Relatia",
    industry: "Healthcare",
    website: "relatia.io",
    domain: "relatia.io",
    phone: "077 5465 8785",
    owner: "Wade Warren",
    city: "Amsterdam",
    country: "Netherlands",
    employees: "10-20",
    revenue: "5,00,000",
    createdAt: "04/08/2025 2:35 PM GMT+5:30",
  },
  {
    _id: "3",
    name: "TrustSphere",
    industry: "Real Estate",
    website: "trustsphere.com",
    domain: "trustsphere.com",
    phone: "078 5432 8505",
    owner: "Brooklyn Simmons",
    city: "Bangalore",
    country: "India",
    employees: "100-120",
    revenue: "20,00,00,000.00",
    createdAt: "04/08/2025 2:31 PM GMT+5:30",
  },
];

const CompanyDetails = () => {
  const { id } = useParams();
  const [company, setCompany] = useState(
    MOCK_COMPANIES.find((c) => c._id === id) || MOCK_COMPANIES[2],
  );
  const [activities, setActivities] = useState([]);

  const generateActivities = (compName) => [
    {
      id: 1,
      group: "Upcoming",
      type: "Task",
      title: `Task assigned to Maria Johnson`,
      time: "June 24, 2025 at 5:30PM",
      overdue: true,
      content: `Prepare quote for ${compName}`,
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
      content: `Prepare quote for ${compName}`,
      isTask: true,
      completed: false,
      priority: "High",
      taskType: "To-Do",
    },
    {
      id: 3,
      group: "June 2025",
      type: "Call",
      title: "Call from Maria Johnson",
      time: "June 24, 2025 at 5:30PM",
      content: `Brought Maria through our latest product line. She's interested and is going to get back to me.`,
    },
    {
      id: 4,
      group: "June 2025",
      type: "Meeting",
      title: `Meeting Maria Johnson and Jane Cooper`,
      time: "June 24, 2025 at 5:30PM",
      content: "Let's discuss our new product line.",
      duration: "1 hr",
      attendees: "2",
      organizedBy: "Maria",
    },
    {
      id: 5,
      group: "June 2025",
      type: "Email tracking",
      title: "Email tracking",
      time: "June 24, 2025 at 5:30PM",
      content: "Jane Cooper opened Hello there",
    },
    {
      id: 6,
      group: "June 2025",
      type: "Note",
      title: "Note by Maria Johnson",
      time: "June 24, 2025 at 5:30PM",
      content: "Sample Note",
    },
  ];

  useEffect(() => {
    const found = MOCK_COMPANIES.find((c) => c._id === id);
    if (found) {
      setCompany(found);
      setActivities(generateActivities(found.name));
    } else {
      setCompany(MOCK_COMPANIES[2]);
      setActivities(generateActivities(MOCK_COMPANIES[2].name));
    }
  }, [id]);

  const handleFieldChange = (field, value) => {
    setCompany((prev) => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = () => {
    console.log("Saved Company:", company);
    // Implement save logic here
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
      { key: "domain", label: "Company Domain Name" },
      { key: "name", label: "Company Name" },
      { key: "industry", label: "Industry" },
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

  return (
    <GenericDetails
      entity={company}
      activities={activities}
      config={config}
      onFieldChange={handleFieldChange}
      onSaveEdit={handleSaveEdit}
    />
  );
};

export default CompanyDetails;
