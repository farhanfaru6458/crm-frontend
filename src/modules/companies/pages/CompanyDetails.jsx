import React, { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import styles from "./CompanyDetails.module.css";

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
    const [activeTab, setActiveTab] = useState("Activity");

    // Drawer/Modal States
    const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
    const [isCallDrawerOpen, setIsCallDrawerOpen] = useState(false);
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [isEditCompanyDrawerOpen, setIsEditCompanyDrawerOpen] = useState(false);
    const [isMeetingDrawerOpen, setIsMeetingDrawerOpen] = useState(false);
    const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);

    const [company, setCompany] = useState(MOCK_COMPANIES.find(c => c._id === id) || MOCK_COMPANIES[2]);
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
            taskType: "To-Do"
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
            taskType: "To-Do"
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
            organizedBy: "Maria"
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
        const found = MOCK_COMPANIES.find(c => c._id === id);
        if (found) {
            setCompany(found);
            setActivities(generateActivities(found.name));
        } else {
            setCompany(MOCK_COMPANIES[2]);
            setActivities(generateActivities(MOCK_COMPANIES[2].name));
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
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
                />
            </svg>
        ),
        Email: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                />
            </svg>
        ),
        Call: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                />
            </svg>
        ),
        Task: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4"
                />
            </svg>
        ),
        Meeting: (
            <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
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
        if (activeTab === "Emails") return a.type === "Email tracking";
        if (activeTab === "Calls") return a.type === "Call";
        if (activeTab === "Tasks") return a.type === "Task";
        if (activeTab === "Meetings") return a.type === "Meeting";
        return true;
    });

    const handleEditSave = (e) => {
        e.preventDefault();
        setIsEditCompanyDrawerOpen(false);
    };

    const handleFieldChange = (field, value) => {
        setCompany(prev => ({ ...prev, [field]: value }));
    };

    return (
        <div className={styles.container}>
            <Link to="/companies" className={styles.breadcrumb}>
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={2}
                    stroke="currentColor"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15.75 19.5L8.25 12l7.5-7.5"
                    />
                </svg>
                Companies
            </Link>

            <div className={styles.mainLayout}>
                <aside className={styles.leftSidebar}>
                    <div className={styles.card}>
                        <div className={styles.profileTop}>
                            <div className={styles.avatarSquare}></div>
                            <div>
                                <h2 className={styles.companyTitle}>{company.name}</h2>
                                <p className={styles.industrySub}>{company.industry}</p>
                                <div className={styles.websiteLinkRow}>
                                    {company.website}
                                    <svg
                                        className={styles.copyIcon}
                                        fill="none"
                                        stroke="currentColor"
                                        viewBox="0 0 24 24"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            strokeWidth={2}
                                            d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                                        />
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

                        <div className={styles.sectionCollapse} onClick={() => setIsEditCompanyDrawerOpen(true)}>
                            <span className={styles.sectionTitle}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ transform: "rotate(-90deg)" }}>
                                    <path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                </svg>
                                About this Company
                            </span>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={styles.editIcon}>
                                <path strokeLinecap="round" strokeLinejoin="round" d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125" />
                            </svg>
                        </div>

                        <div className={styles.detailsList}>
                            {[
                                { id: "domain", label: "Company Domain Name", value: company.domain },
                                { id: "name", label: "Company Name", value: company.name },
                                { id: "industry", label: "Industry", value: company.industry },
                                { id: "phone", label: "Phone number", value: company.phone },
                                { id: "owner", label: "Company Owner", value: company.owner },
                                { id: "city", label: "City", value: company.city },
                                { id: "country", label: "Country/Region", value: company.country },
                                { id: "employees", label: "No of Employees", value: company.employees },
                                { id: "revenue", label: "Annual Revenue", value: company.revenue },
                                { id: "createdAt", label: "Created Date", value: company.createdAt },
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
                                    {activeTab === "Calls" && <button className={styles.makeCallBtn} onClick={() => setIsCallDrawerOpen(true)}>Make a Phone Call</button>}
                                    {activeTab === "Tasks" && <button className={styles.makeCallBtn} onClick={() => setIsTaskDrawerOpen(true)}>Create Task</button>}
                                    {activeTab === "Meetings" && <button className={styles.makeCallBtn} onClick={() => setIsMeetingDrawerOpen(true)}>Create Meeting</button>}
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
                                                                <p className={styles.subNote}>He's interested in our new product line and wants our very best price. Please include a detailed breakdown of costs.</p>
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
                            AI Company Summary
                        </div>
                        <div className={styles.aiContent}>There are no activities associated with this company and further details are needed to provide a comprehensive summary.</div>
                    </div>
                    <div className={styles.attachmentsSection}>
                        <div className={styles.attachHeader}>
                            <div className={styles.attachTitle}>
                                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M19 9l-7 7-7-7" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" /></svg>
                                Attachments
                            </div>
                            <span className={styles.addBtn}>+ Add</span>
                        </div>
                        <p className={styles.emptyAttach}>See the files attached to your activities or uploaded to this record.</p>
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
                                <div className={styles.richTextEditor}>
                                    <div className={styles.editorToolbar}>
                                        <span>Normal text</span>
                                        <button><b>B</b></button><button><i>I</i></button><button><u>U</u></button><button>🔗</button><button>🖼️</button>
                                    </div>
                                    <textarea placeholder="Enter"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className={styles.drawerFooter}>
                            <button className={styles.cancelBtn} onClick={() => setIsNoteDrawerOpen(false)}>Cancel</button>
                            <button className={styles.saveBtn}>Save</button>
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
                                    <div className={styles.iconInput}><select><option>Choose</option></select><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                </div>
                                <div className={styles.field}><label>Time <span>*</span></label>
                                    <div className={styles.iconInput}><select><option>Choose</option></select><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                </div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.field}><label>Task Type <span>*</span></label><select><option>Choose</option></select></div>
                                <div className={styles.field}><label>Priority <span>*</span></label><select><option>Choose</option></select></div>
                            </div>
                            <div className={styles.field}><label>Assigned to <span>*</span></label><select><option>Maria Johnson</option></select></div>
                            <div className={styles.field}><label>Note <span>*</span></label>
                                <div className={styles.richTextEditor}>
                                    <div className={styles.editorToolbar}><span>Normal text</span><button>B</button><button>I</button><button>U</button><button>🔗</button></div>
                                    <textarea placeholder="Enter"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className={styles.drawerFooter}>
                            <button className={styles.cancelBtn} onClick={() => setIsTaskDrawerOpen(false)}>Cancel</button>
                            <button className={styles.saveBtn}>Save</button>
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
                                <div className={styles.iconInput}><select><option>Choose</option></select><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                            </div>
                            <div className={styles.row}>
                                <div className={styles.field}><label>Start Time <span>*</span></label>
                                    <div className={styles.iconInput}><select><option>Choose</option></select><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                </div>
                                <div className={styles.field}><label>End Time <span>*</span></label>
                                    <div className={styles.iconInput}><select><option>Choose</option></select><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                </div>
                            </div>
                            <div className={styles.field}><label>Attendees <span>*</span></label><select><option>Choose</option></select></div>
                            <div className={styles.field}><label>Location</label><select><option>Choose</option></select></div>
                            <div className={styles.field}><label>Reminder</label><select><option>Choose</option></select></div>
                            <div className={styles.field}><label>Note <span>*</span></label>
                                <div className={styles.richTextEditor}><div className={styles.editorToolbar}><span>Normal text</span><button>B</button><button>I</button><button>U</button></div><textarea placeholder="Enter"></textarea></div>
                            </div>
                        </div>
                        <div className={styles.drawerFooter}>
                            <button className={styles.cancelBtn} onClick={() => setIsMeetingDrawerOpen(false)}>Cancel</button>
                            <button className={styles.saveBtn}>Save</button>
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
                            <div className={styles.field}><label>Connected <span>*</span></label><input type="text" value={company.name} readOnly /></div>
                            <div className={styles.field}><label>Call Outcome <span>*</span></label><select><option>Choose</option><option>Busy</option><option>Connected</option></select></div>
                            <div className={styles.row}>
                                <div className={styles.field}><label>Date <span>*</span></label>
                                    <div className={styles.iconInput}><select><option>Choose</option></select><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></div>
                                </div>
                                <div className={styles.field}><label>Time <span>*</span></label>
                                    <div className={styles.iconInput}><select><option>Choose</option></select><svg viewBox="0 0 24 24" fill="none" stroke="currentColor"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" /></svg></div>
                                </div>
                            </div>
                            <div className={styles.field}><label>Note <span>*</span></label>
                                <div className={styles.richTextEditor}>
                                    <div className={styles.editorToolbar}><span>Normal text</span><button>B</button><button>I</button><button>U</button></div>
                                    <textarea placeholder="Enter"></textarea>
                                </div>
                            </div>
                        </div>
                        <div className={styles.drawerFooter}>
                            <button className={styles.cancelBtn} onClick={() => setIsCallDrawerOpen(false)}>Cancel</button>
                            <button className={styles.saveBtn}>Save</button>
                        </div>
                    </div>
                </>
            )}

            {isEditCompanyDrawerOpen && (
                <>
                    <div className={styles.drawerOverlay} onClick={() => setIsEditCompanyDrawerOpen(false)}></div>
                    <div className={styles.rightDrawer}>
                        <div className={styles.drawerHeader}><h3>Edit Company</h3><button onClick={() => setIsEditCompanyDrawerOpen(false)}>×</button></div>
                        <div className={styles.drawerBody}>
                            <div className={styles.field}><label>Company Name</label><input type="text" value={company.name} onChange={(e) => handleFieldChange("name", e.target.value)} /></div>
                            <div className={styles.field}><label>Industry</label><input type="text" value={company.industry} onChange={(e) => handleFieldChange("industry", e.target.value)} /></div>
                            <div className={styles.field}><label>Website</label><input type="text" value={company.website} onChange={(e) => handleFieldChange("website", e.target.value)} /></div>
                            <div className={styles.field}><label>Phone number</label><input type="text" value={company.phone} onChange={(e) => handleFieldChange("phone", e.target.value)} /></div>
                        </div>
                        <div className={styles.drawerFooter}>
                            <button className={styles.cancelBtn} onClick={() => setIsEditCompanyDrawerOpen(false)}>Cancel</button>
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
                                <button className={styles.sendBtn}>Send <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white"><path d="M19 9l-7 7-7-7" /></svg></button>
                                <div className={styles.footerIcons}><span>A</span><span>🔗</span><span>📎</span><span>😊</span><span>🖼️</span></div>
                            </div>
                            <div className={styles.footerRight}><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#94a3b8"><path d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg></div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default CompanyDetails;
