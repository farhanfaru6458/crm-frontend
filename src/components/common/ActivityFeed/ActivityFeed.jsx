
import React from 'react';
import styles from './ActivityFeed.module.css';

const ActivityFeed = ({
    activities = [],
    activeTab,
    setActiveTab,
    onToggleTask,
    onOpenCallDrawer,
    onOpenTaskDrawer,
    onOpenMeetingDrawer,
    tabs = ["Activity", "Notes", "Emails", "Calls", "Tasks", "Meetings"]
}) => {

    const filteredActivities = activities.filter((a) => {
        if (activeTab === "Activity") return true;
        if (activeTab === "Notes") return a.type === "Note";
        if (activeTab === "Emails") return a.type === "Email tracking" || a.type === "Email";
        if (activeTab === "Calls") return a.type === "Call";
        if (activeTab === "Tasks") return a.type === "Task";
        if (activeTab === "Meetings") return a.type === "Meeting";
        return true;
    });

    return (
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
                        {activeTab === "Calls" && <button className={styles.makeCallBtn} onClick={onOpenCallDrawer}>Log a Phone Call</button>}
                        {activeTab === "Tasks" && <button className={styles.makeCallBtn} onClick={onOpenTaskDrawer}>Create Task</button>}
                        {activeTab === "Meetings" && <button className={styles.makeCallBtn} onClick={onOpenMeetingDrawer}>Schedule Meeting</button>}
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
                                                            onClick={() => onToggleTask && onToggleTask(item.id)}
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
                                                    {item.subNote && <p className={styles.subNote}>{item.subNote}</p> ||
                                                        /* Fallback for mock if not present in item but hardcoded in original */
                                                        <p className={styles.subNote}>Please follow up on the requirements discussed in the discovery call. They are highly interested.</p>
                                                    }
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
    );
};

export default ActivityFeed;
