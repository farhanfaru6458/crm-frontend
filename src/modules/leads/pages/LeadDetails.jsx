import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { updateLead } from "../../../redux/leadsSlice";
import { addDeal } from "../../../redux/dealsSlice";
import { addNotification } from "../../../redux/notificationsSlice";
import GenericDetails from "../../../components/common/GenericDetails/GenericDetails";
import { toast } from "react-hot-toast";

const LeadDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const leads = useSelector(state => state.leads.leads);
    const leadData = leads.find(l => l._id === id);

    const [lead, setLead] = useState(null);
    const [activities, setActivities] = useState([]);

    useEffect(() => {
        if (leadData) {
            setLead(leadData);
            setActivities(generateActivities(leadData.name));
        }
    }, [leadData, id]);

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

    const handleFieldChange = (field, value) => {
        setLead(prev => ({ ...prev, [field]: value }));
    };

    const handleSaveEdit = () => {
        dispatch(updateLead(lead));
    };

    const handleDeleteLead = () => {
        // In a real app, you'd call an API here
        toast.success(`${lead.name} deleted successfully.`);
        dispatch(addNotification({
            id: Date.now(),
            message: `Lead ${lead.name} deleted successfully!`,
            type: "delete",
            timestamp: new Date().toLocaleString()
        }));
        navigate("/leads");
    };

    const config = {
        moduleName: "Leads",
        entityName: "Lead",
        backLink: "/leads",
        titleField: "name",
        subTitleRender: (entity) => `${entity.jobTitle || "Lead"} at ${entity.company || "Unknown Company"}`,
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

    const handleConvertLead = (convertData) => {
        // Create the deal
        const newDeal = {
            _id: Date.now().toString(),
            dealName: convertData.dealName,
            dealStage: convertData.dealStage,
            amount: convertData.amount,
            closeDate: convertData.closeDate,
            dealOwner: convertData.dealOwner,
            associatedLeadId: lead._id
        };

        dispatch(addDeal(newDeal));

        // Update lead status
        const updatedLead = { ...lead, status: "Converted" };
        dispatch(updateLead(updatedLead));

        toast.success(`Lead converted to Deal successfully!`);
        navigate("/deals");
    };

    if (!lead) return <div>Loading...</div>;

    return (
        <GenericDetails
            entity={lead}
            activities={activities}
            config={config}
            onFieldChange={handleFieldChange}
            onSaveEdit={handleSaveEdit}
            onDelete={handleDeleteLead}
            showConvertButton={lead.status !== "Converted"}
            onConvert={handleConvertLead}
        />
    );
};

export default LeadDetails;
