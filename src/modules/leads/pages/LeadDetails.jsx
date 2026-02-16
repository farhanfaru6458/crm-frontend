import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";

const MOCK_LEADS = [
    {
        _id: "1",
        name: "Maria Johnson",
        email: "maria.j@clientedge.com",
        phone: "+1 234 567 890",
        jobTitle: "Marketing Manager",
        company: "ClientEdge",
        status: "New",
        owner: "Jane Cooper",
        city: "Toronto",
        country: "Canada",
        createdAt: "04/08/2025 2:35 PM GMT+5:30",
    },
    {
        _id: "2",
        name: "Michael Chen",
        email: "m.chen@techsolutions.io",
        phone: "+1 987 654 321",
        jobTitle: "Software Engineer",
        company: "TechSolutions",
        status: "In Progress",
        owner: "Wade Warren",
        city: "Amsterdam",
        country: "Netherlands",
        createdAt: "04/10/2025 10:15 AM GMT+5:30",
    },
    {
        _id: "3",
        name: "Sarah Williams",
        email: "sarah.w@trustsphere.com",
        phone: "+1 555 123 456",
        jobTitle: "Operations Lead",
        company: "TrustSphere",
        status: "Open",
        owner: "Brooklyn Simmons",
        city: "Bangalore",
        country: "India",
        createdAt: "04/12/2025 9:00 AM GMT+5:30",
    },
];

const LeadDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [lead, setLead] = useState(MOCK_LEADS.find(l => l._id === id) || MOCK_LEADS[0]);
    const [activities, setActivities] = useState([]);

    const generateActivities = (leadName) => [
        {
            id: 1,
            group: "Upcoming",
            type: "Task",
            title: `Task assigned to ${leadName}`,
            time: "June 24, 2025 at 5:30PM",
            overdue: true,
            content: `Follow up with ${leadName} regarding the proposal`,
            isTask: true,
            completed: false,
            priority: "High",
            taskType: "To-Do"
        },
        {
            id: 2,
            group: "Upcoming",
            type: "Meeting",
            title: `Meeting with ${leadName}`,
            time: "June 26, 2025 at 10:00AM",
            content: "Product demo and requirements gathering.",
            duration: "45 mins",
            attendees: "2",
            organizedBy: "Jane Cooper"
        },
        {
            id: 3,
            group: "June 2025",
            type: "Call",
            title: `Call with ${leadName}`,
            time: "June 20, 2025 at 2:30PM",
            content: `Inital discovery call. ${leadName} mentioned they are looking for a new CRM solution by Q3.`,
        },
        {
            id: 4,
            group: "June 2025",
            type: "Note",
            title: "Note by Jane Cooper",
            time: "June 19, 2025 at 11:15AM",
            content: "Lead prefers communication via email for technical specs.",
        },
    ];

    useEffect(() => {
        const found = MOCK_LEADS.find(l => l._id === id);
        if (found) {
            setLead(found);
            setActivities(generateActivities(found.name));
        } else {
            setLead(MOCK_LEADS[0]);
            setActivities(generateActivities(MOCK_LEADS[0].name));
        }
    }, [id]);

    const handleFieldChange = (field, value) => {
        setLead(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = () => {
        // Logic to save the lead
        console.log("Saved lead:", lead);
    };

    const handleDeleteLead = () => {
        // In a real app, you'd call an API here
        alert(`${lead.name} deleted successfully.`);
        navigate("/leads");
    };

    const config = {
        moduleName: "Leads",
        entityName: "Lead",
        backLink: "/leads",
        titleField: "name",
        subTitleRender: (entity) => `${entity.jobTitle} at ${entity.company}`,
        showAvatar: true,
        detailsFields: [
            { key: "name", label: "Name" },
            { key: "email", label: "Email" },
            { key: "phone", label: "Phone" },
            { key: "company", label: "Company" },
            { key: "status", label: "Status" },
            { key: "owner", label: "Owner" },
            { key: "city", label: "City" },
            { key: "country", label: "Country" },
            { key: "createdAt", label: "Created Date" },
        ],
        editFields: [
            { key: "name", label: "Lead Name" },
            { key: "email", label: "Email" },
            { key: "jobTitle", label: "Job Title" },
            { key: "company", label: "Company" },
            { key: "phone", label: "Phone" },
        ],
    };

    return (
        <GenericDetails
            entity={lead}
            activities={activities}
            config={config}
            onFieldChange={handleFieldChange}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDeleteLead}
        />
    );
};

export default LeadDetails;
