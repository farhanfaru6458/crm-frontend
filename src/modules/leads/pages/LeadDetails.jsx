import React, { useState, useEffect, useRef } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import styles from "./LeadDetails.module.css";

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
    const [activeTab, setActiveTab] = useState("Activity");
    const fileInputRef = useRef(null);

    // Drawer/Modal States
    const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
    const [isCallDrawerOpen, setIsCallDrawerOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isEditLeadDrawerOpen, setIsEditLeadDrawerOpen] = useState(false);
    const [isMeetingDrawerOpen, setIsMeetingDrawerOpen] = useState(false);
    const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);

    const [lead, setLead] = useState(MOCK_LEADS.find(l => l._id === id) || MOCK_LEADS[0]);
    const [activities, setActivities] = useState([]);
    const [attachments, setAttachments] = useState([]);

    const handleFileChange = (e) => {
        if (e.target.files) {
            const newFiles = Array.from(e.target.files).map(file => ({
                id: Math.random().toString(36).substr(2, 9),
                name: file.name,
                size: (file.size / 1024).toFixed(2) + " KB",
                type: file.type,
                date: new Date().toLocaleDateString()
            }));
            setAttachments(prev => [...prev, ...newFiles]);
        }
    };

    const triggerFileInput = () => {
        fileInputRef.current?.click();
    };

    const deleteAttachment = (id) => {
        setAttachments(prev => prev.filter(a => a.id !== id));
    };

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

    const toggleTask = (taskId) => {
        setActivities(
            activities.map((a) =>
                a.id === taskId ? { ...a, completed: !a.completed } : a
            )
        );
    };

    const tabs = ["Activity", "Notes", "Emails", "Calls", "Tasks", "Meetings"];

    const icons = {
        Note: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
            </svg>
        ),
        Email: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
        ),
        Call: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
        ),
        Task: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
            </svg>
        ),
        Meeting: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        ),
    };

    const feedIcons = {
        Task: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
            </svg>
        ),
        Call: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
            </svg>
        ),
        Meeting: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
            </svg>
        ),
        "Email tracking": (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
            </svg>
        ),
        Note: (
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M19 9l-7 7-7-7" />
            </svg>
        ),
    };

    const filteredActivities = activities.filter((a) => {
        if (activeTab === "Activity") return true;
        if (activeTab === "Notes") return a.type === "Note";
        if (activeTab === "Emails") return a.type === "Email tracking" || a.type === "Email";
        if (activeTab === "Calls") return a.type === "Call";
        if (activeTab === "Tasks") return a.type === "Task";
        if (activeTab === "Meetings") return a.type === "Meeting";
        return true;
    });

    const handleEditSave = (e) => {
        e.preventDefault();
        setIsEditLeadDrawerOpen(false);
    };

    const handleFieldChange = (field, value) => {
        setLead(prev => ({ ...prev, [field]: value }));
    };

    const handleDeleteLead = () => {
        if (window.confirm(`Are you sure you want to delete ${lead.name}?`)) {
            // In a real app, you'd call an API here
            alert(`${lead.name} deleted successfully.`);
            navigate("/leads");
        }
    };

    return (
        <div className={styles.container}>
            <Link to="/leads" className={styles.breadcrumb}>
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
                </svg>
                Leads
            </Link>

            <div className={styles.mainLayout}>
                <aside className={styles.leftSidebar}>
                    <div className={styles.card}>
                        <div className={styles.profileTop}>
                            <div className={styles.avatarCircle}>{lead.name.split(' ').map(n => n[0]).join('')}</div>
                            <div>
                                <h2 className={styles.leadTitle}>{lead.name}</h2>
                                <p className={styles.jobSub}>{lead.jobTitle} at {lead.company}</p>
                                <div className={styles.emailLinkRow}>
                                    {lead.email}
                                    <svg className={styles.copyIcon} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2" />
                                    </svg>
                                </div>
                            </div>
                        </div>

                        <div className={styles.actionButtons}>
                            <button className={styles.toolBtn} onClick={() => setIsNoteDrawerOpen(true)}>
                                {icons.Note}
                                <span className={styles.toolLabel}>Note</span>
                            </button>
                            <button className={styles.toolBtn} onClick={() => setIsEmailModalOpen(true)}>
                                {icons.Email}
                                <span className={styles.toolLabel}>Email</span>
                            </button>
                            <button className={styles.toolBtn} onClick={() => setIsCallDrawerOpen(true)}>
                                {icons.Call}
                                <span className={styles.toolLabel}>Call</span>
                            </button>
                            <button className={styles.toolBtn} onClick={() => setIsTaskDrawerOpen(true)}>
                                {icons.Task}
                                <span className={styles.toolLabel}>Task</span>
                            </button>
                            <button className={styles.toolBtn} onClick={() => setIsMeetingDrawerOpen(true)}>
                                {icons.Meeting}
                                <span className={styles.toolLabel}>Meeting</span>
                            </button>
                        </div>

                        <div className={styles.sectionCollapse} onClick={() => setIsEditLeadDrawerOpen(true)}>
                            <span className={styles.sectionTitle}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ transform: "rotate(-90deg)" }}>
                                    <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                About this Lead
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.editIcon}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                            </svg>
                        </div>

                        <div className={styles.detailsList}>
                            {[
                                { id: "name", label: "Name", value: lead.name },
                                { id: "email", label: "Email", value: lead.email },
                                { id: "phone", label: "Phone", value: lead.phone },
                                { id: "company", label: "Company", value: lead.company },
                                { id: "status", label: "Status", value: lead.status },
                                { id: "owner", label: "Owner", value: lead.owner },
                                { id: "city", label: "City", value: lead.city },
                                { id: "country", label: "Country", value: lead.country },
                                { id: "createdAt", label: "Created Date", value: lead.createdAt },
                            ].map((item, idx) => (
                                <div key={idx} className={styles.detailItem}>
                                    <span className={styles.detailLabel}>{item.label}</span>
                                    <span className={styles.detailValue}>{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </aside>

                <section className={styles.centerContent}>
                    <div className={styles.activityCard}>
                        <div className={styles.activityHeader}>
                            <div className={styles.activitySearchWrapper}>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                </svg>
                                <input type="text" placeholder="Search activities" />
                            </div>
                        </div>

                        <div className={styles.tabsContainer}>
                            {tabs.map((tab) => (
                                <div
                                    key={tab}
                                    className={`${styles.tab} ${activeTab === tab ? styles.activeTab : ""}`}
                                    onClick={() => setActiveTab(tab)}
                                >
                                    {tab}
                                </div>
                            ))}
                        </div>

                        <div className={styles.tabContent}>
                            {(activeTab === "Calls" || activeTab === "Tasks" || activeTab === "Meetings") && (
                                <div className={styles.callsHeader}>
                                    <h3 className={styles.groupTitle}>{activeTab === "Activity" ? "" : activeTab}</h3>
                                    {activeTab === "Calls" && <button className={styles.makeCallBtn} onClick={() => setIsCallDrawerOpen(true)}>Log a Phone Call</button>}
                                    {activeTab === "Tasks" && <button className={styles.makeCallBtn} onClick={() => setIsTaskDrawerOpen(true)}>Create Task</button>}
                                    {activeTab === "Meetings" && <button className={styles.makeCallBtn} onClick={() => setIsMeetingDrawerOpen(true)}>Schedule Meeting</button>}
                                </div>
                            )}

                            <div className={styles.feed}>
                                {["Upcoming", "June 2025"].map((group) => {
                                    const groupItems = filteredActivities.filter((a) => a.group === group);
                                    if (groupItems.length === 0) return null;

                                    return (
                                        <div key={group} className={styles.feedGroup}>
                                            <h3 className={styles.groupTitle}>{activeTab === "Activity" ? group : ""}</h3>
                                            {groupItems.map((item) => (
                                                <div key={item.id} className={styles.feedItem}>
                                                    <div className={styles.itemHeader}>
                                                        <span className={styles.itemType}>
                                                            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" style={{ transform: "rotate(-90deg)", color: "#5a4bff" }}>
                                                                <path d="M19 9l-7 7-7-7" />
                                                            </svg>
                                                            {item.title}
                                                        </span>
                                                        <div className={styles.itemMeta}>
                                                            {item.overdue && !item.completed && (
                                                                <span className={styles.overdue}>
                                                                    <svg width="14" height="14" fill="currentColor" viewBox="0 0 24 24" style={{ marginRight: '4px' }}>
                                                                        <path d="M19 4h-1V2h-2v2H8V2H6v2H5c-1.11 0-1.99.9-1.99 2L3 20c0 1.1.89 2 2 2h14c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 16H5V10h14v10zm0-12H5V6h14v2z" />
                                                                    </svg>
                                                                    Overdue :
                                                                </span>
                                                            )}
                                                            {item.time}
                                                        </div>
                                                    </div>
                                                    <div className={styles.itemBody}>
                                                        {item.type === "Task" ? (
                                                            <div className={styles.taskFull}>
                                                                <div className={styles.taskAction}>
                                                                    <div
                                                                        className={styles.circleCheckbox}
                                                                        style={{
                                                                            background: item.completed ? "#5a4bff" : "transparent",
                                                                            borderColor: item.completed ? "#5a4bff" : "#cbd5e1",
                                                                        }}
                                                                        onClick={() => toggleTask(item.id)}
                                                                    ></div>
                                                                    <p className={styles.itemText} style={{ textDecoration: item.completed ? "line-through" : "none" }}>
                                                                        {item.content}
                                                                    </p>
                                                                </div>
                                                                <div className={styles.infoBox}>
                                                                    <div className={styles.infoField}>
                                                                        <label>Due Date & Time</label>
                                                                        <span>{item.time}</span>
                                                                    </div>
                                                                    <div className={styles.infoField}>
                                                                        <label>Priority</label>
                                                                        <span>{item.priority}</span>
                                                                    </div>
                                                                    <div className={styles.infoField}>
                                                                        <label>Type</label>
                                                                        <span>{item.taskType}</span>
                                                                    </div>
                                                                </div>
                                                                <p className={styles.subNote}>Please follow up on the requirements discussed in the discovery call. They are highly interested.</p>
                                                            </div>
                                                        ) : item.type === "Meeting" ? (
                                                            <div className={styles.meetingFull}>
                                                                <p className={styles.organizedBy}>Organized by {item.organizedBy}</p>
                                                                <div className={styles.infoBox}>
                                                                    <div className={styles.infoField}>
                                                                        <label>Date & Time</label>
                                                                        <span>{item.time}</span>
                                                                    </div>
                                                                    <div className={styles.infoField}>
                                                                        <label>Duration</label>
                                                                        <span>{item.duration}</span>
                                                                    </div>
                                                                    <div className={styles.infoField}>
                                                                        <label>Attendees</label>
                                                                        <span>{item.attendees}</span>
                                                                    </div>
                                                                </div>
                                                                <p className={styles.itemText}>{item.content}</p>
                                                            </div>
                                                        ) : (
                                                            <>
                                                                <p className={styles.itemText}>{item.content}</p>
                                                                {item.type === "Call" && (activeTab === "Calls" || activeTab === "Activity") && (
                                                                    <div className={styles.outcomeRow}>
                                                                        <div className={styles.outcomeField}>
                                                                            <label>Outcome *</label>
                                                                            <select disabled><option>Choose</option></select>
                                                                        </div>
                                                                        <div className={styles.outcomeField}>
                                                                            <label>Duration *</label>
                                                                            <div className={styles.durationInput}>
                                                                                <select disabled><option>Choose</option></select>
                                                                                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                )}
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                </section>

                <aside className={styles.rightSidebar}>
                    <div className={styles.aiSummaryCard}>
                        <div className={styles.aiHeader}>
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none"><path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z" fill="currentColor" /></svg>
                            AI Lead Summary
                        </div>
                        <div className={styles.aiContent}>{lead.name} is a {lead.jobTitle} at {lead.company}. They are currently in the {lead.status} stage. Follow-up is required to move them forward.</div>
                    </div>
                    <div className={styles.attachmentsSection}>
                        <div className={styles.attachHeader}>
                            <div className={styles.attachTitle}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                Attachments
                            </div>
                            <span className={styles.addBtn} onClick={triggerFileInput}>+ Add</span>
                            <input
                                type="file"
                                ref={fileInputRef}
                                style={{ display: 'none' }}
                                onChange={handleFileChange}
                                multiple
                            />
                        </div>
                        {attachments.length === 0 ? (
                            <p className={styles.emptyAttach}>No attachments found for this lead.</p>
                        ) : (
                            <div className={styles.attachmentList}>
                                {attachments.map(file => (
                                    <div key={file.id} className={styles.attachmentItem}>
                                        <div className={styles.fileIcon}>
                                            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" /><path d="M14 2v6h6" /></svg>
                                        </div>
                                        <div className={styles.fileInfo}>
                                            <span className={styles.fileName}>{file.name}</span>
                                            <span className={styles.fileSize}>{file.size}</span>
                                        </div>
                                        <button className={styles.deleteFileBtn} onClick={() => deleteAttachment(file.id)}>×</button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </aside>
            </div>

            {/* DRAWERS */}
            {isNoteDrawerOpen && (
                <>
                    <div className={styles.drawerOverlay} onClick={() => setIsNoteDrawerOpen(false)}></div>
                    <div className={styles.rightDrawer}>
                        <div className={styles.drawerHeader}><h3>Create Note</h3><button onClick={() => setIsNoteDrawerOpen(false)}>×</button></div>
                        <div className={styles.drawerBody}>
                            <div className={styles.field}>
                                <label>Note <span>*</span></label>
                                <textarea className={styles.simpleTextarea} placeholder="Enter your note here..."></textarea>
                            </div>
                        </div>
                        <div className={styles.drawerFooter}>
                            <button className={styles.cancelBtn} onClick={() => setIsNoteDrawerOpen(false)}>Cancel</button>
                            <button className={styles.saveBtn} onClick={() => setIsNoteDrawerOpen(false)}>Save</button>
                        </div>
                    </div>
                </>
            )}

            {isTaskDrawerOpen && (
                <>
                    <div className={styles.drawerOverlay} onClick={() => setIsTaskDrawerOpen(false)}></div>
                    <div className={styles.rightDrawer}>
                        <div className={styles.drawerHeader}><h3>Create Task</h3><button onClick={() => setIsTaskDrawerOpen(false)}>×</button></div>
                        <div className={styles.drawerBody}>
                            <div className={styles.field}><label>Task Name <span>*</span></label><input type="text" placeholder="Enter" /></div>
                            <div className={styles.row}>
                                <div className={styles.field}><label>Due Date <span>*</span></label>
                                    <div className={styles.iconInput}><input type="date" /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                </div>
                                <div className={styles.field}><label>Time <span>*</span></label>
                                    <div className={styles.iconInput}><input type="time" /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                </div>
                            </div>
                            <div className={styles.field}><label>Note <span>*</span></label><textarea className={styles.simpleTextarea} placeholder="Enter note details..."></textarea></div>
                        </div>
                        <div className={styles.drawerFooter}>
                            <button className={styles.cancelBtn} onClick={() => setIsTaskDrawerOpen(false)}>Cancel</button>
                            <button className={styles.saveBtn} onClick={() => setIsTaskDrawerOpen(false)}>Save</button>
                        </div>
                    </div>
                </>
            )}

            {isMeetingDrawerOpen && (
                <>
                    <div className={styles.drawerOverlay} onClick={() => setIsMeetingDrawerOpen(false)}></div>
                    <div className={styles.rightDrawer}>
                        <div className={styles.drawerHeader}><h3>Schedule Meeting</h3><button onClick={() => setIsMeetingDrawerOpen(false)}>×</button></div>
                        <div className={styles.drawerBody}>
                            <div className={styles.field}><label>Title <span>*</span></label><input type="text" placeholder="Enter" /></div>
                            <div className={styles.field}><label>Start Date <span>*</span></label>
                                <div className={styles.iconInput}><input type="date" /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.field}><label>Start Time <span>*</span></label>
                                    <div className={styles.iconInput}><input type="time" /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                </div>
                                <div className={styles.field}><label>End Time <span>*</span></label>
                                    <div className={styles.iconInput}><input type="time" /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                </div>
                            </div>
                            <div className={styles.field}><label>Note <span>*</span></label><textarea className={styles.simpleTextarea} placeholder="Enter meeting details..."></textarea></div>
                        </div>
                        <div className={styles.drawerFooter}>
                            <button className={styles.cancelBtn} onClick={() => setIsMeetingDrawerOpen(false)}>Cancel</button>
                            <button className={styles.saveBtn} onClick={() => setIsMeetingDrawerOpen(false)}>Save</button>
                        </div>
                    </div>
                </>
            )}

            {isCallDrawerOpen && (
                <>
                    <div className={styles.drawerOverlay} onClick={() => setIsCallDrawerOpen(false)}></div>
                    <div className={styles.rightDrawer}>
                        <div className={styles.drawerHeader}><h3>Log Call</h3><button onClick={() => setIsCallDrawerOpen(false)}>×</button></div>
                        <div className={styles.drawerBody}>
                            <div className={styles.field}><label>Connected <span>*</span></label><input type="text" value={lead.name} readOnly /></div>
                            <div className={styles.field}><label>Call Outcome <span>*</span></label><select><option>Choose</option><option>Busy</option><option>Connected</option></select></div>
                            <div className={styles.row}>
                                <div className={styles.field}><label>Date <span>*</span></label>
                                    <div className={styles.iconInput}><input type="date" /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                </div>
                                <div className={styles.field}><label>Time <span>*</span></label>
                                    <div className={styles.iconInput}><input type="time" /><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                </div>
                            </div>
                            <div className={styles.field}><label>Note <span>*</span></label><textarea className={styles.simpleTextarea} placeholder="Enter call notes..."></textarea></div>
                        </div>
                        <div className={styles.drawerFooter}>
                            <button className={styles.cancelBtn} onClick={() => setIsCallDrawerOpen(false)}>Cancel</button>
                            <button className={styles.saveBtn} onClick={() => setIsCallDrawerOpen(false)}>Save</button>
                        </div>
                    </div>
                </>
            )}

            {isEditLeadDrawerOpen && (
                <>
                    <div className={styles.drawerOverlay} onClick={() => setIsEditLeadDrawerOpen(false)}></div>
                    <div className={styles.rightDrawer}>
                        <div className={styles.drawerHeader}><h3>Edit Lead</h3><button onClick={() => setIsEditLeadDrawerOpen(false)}>×</button></div>
                        <div className={styles.drawerBody}>
                            <div className={styles.field}><label>Lead Name</label><input type="text" value={lead.name} onChange={(e) => handleFieldChange("name", e.target.value)} /></div>
                            <div className={styles.field}><label>Email</label><input type="email" value={lead.email} onChange={(e) => handleFieldChange("email", e.target.value)} /></div>
                            <div className={styles.field}><label>Job Title</label><input type="text" value={lead.jobTitle} onChange={(e) => handleFieldChange("jobTitle", e.target.value)} /></div>
                            <div className={styles.field}><label>Company</label><input type="text" value={lead.company} onChange={(e) => handleFieldChange("company", e.target.value)} /></div>
                            <div className={styles.field}><label>Phone</label><input type="text" value={lead.phone} onChange={(e) => handleFieldChange("phone", e.target.value)} /></div>
                        </div>
                        <div className={styles.drawerFooter}>
                            <button className={styles.deleteBtn} onClick={handleDeleteLead}>Delete Lead</button>
                            <div style={{ flex: 1 }}></div>
                            <button className={styles.cancelBtn} onClick={() => setIsEditLeadDrawerOpen(false)}>Cancel</button>
                            <button className={styles.saveBtn} onClick={handleEditSave}>Save</button>
                        </div>
                    </div>
                </>
            )}

            {isEmailModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.emailModal}>
                        <div className={styles.emailHeader}><h3>New Email</h3><button onClick={() => setIsEmailModalOpen(false)}>×</button></div>
                        <div className={styles.emailBody}>
                            <div className={styles.emailRow}><label>Recipients</label><input type="text" /><div className={styles.emailActions}><span>Cc</span> <span>Bcc</span></div></div>
                            <div className={styles.emailRow}><label>Subject</label><input type="text" /></div>
                            <div className={styles.emailEditor}><textarea placeholder="Body Text"></textarea></div>
                        </div>
                        <div className={styles.emailFooter}>
                            <div className={styles.footerLeft}>
                                <button className={styles.sendBtn}>Send</button>
                                <div className={styles.footerIcons}><span onClick={triggerFileInput}>Clip</span></div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default LeadDetails;
