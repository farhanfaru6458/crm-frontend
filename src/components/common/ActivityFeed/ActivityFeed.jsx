import React, { useState, useMemo } from 'react';
import styles from './ActivityFeed.module.css';
import { toast } from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { addNotification } from '../../../redux/notificationsSlice';
import CustomSelect from '../../ui/CustomSelect/CustomSelect';

const ActivityFeed = ({
    activities = [],
    activeTab,
    setActiveTab,
    onToggleTask,
    onUpdateActivity,
    onOpenCallDrawer,
    onOpenTaskDrawer,
    onOpenMeetingDrawer,
    tabs = ["Activity", "Notes", "Emails", "Calls", "Tasks", "Meetings"],
    showConvertButton = false,
    onConvert,
    convertDisabled = false,
}) => {
    const dispatch = useDispatch();
    // Track which accordion items are expanded (open by default)
    const [expandedItems, setExpandedItems] = useState({});

    const toggleExpand = (id) => {
        setExpandedItems(prev => ({ ...prev, [id]: !prev[id] }));
    };

    const handleCall = () => {
        toast.success("Calling...");
        dispatch(addNotification({
            id: Date.now(),
            message: "Calling...",
            type: "call",
            timestamp: new Date().toLocaleString()
        }));
    };

    const handleUpdate = (id, data) => {
        if (onUpdateActivity) {
            onUpdateActivity(id, data);
        }
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

    const groups = useMemo(() => {
        const uniqueGroups = Array.from(new Set(activities.map(a => a.group)));
        // Sort groups: Upcoming first, Recent second, then others (e.g., specific months)
        const order = ["Upcoming", "Recent"];
        return uniqueGroups.sort((a, b) => {
            const idxA = order.indexOf(a);
            const idxB = order.indexOf(b);
            if (idxA !== -1 && idxB !== -1) return idxA - idxB;
            if (idxA !== -1) return -1;
            if (idxB !== -1) return 1;
            return b.localeCompare(a); // Default sort for others
        });
    }, [activities]);

    return (
        <div className={styles.activityCard}>
            <div className={styles.activityHeader}>
                <div className={styles.activitySearchWrapper}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                    </svg>
                    <input type="text" placeholder="Search activities" />
                </div>
                {showConvertButton && (
                    <button
                        className={styles.convertBtn}
                        onClick={onConvert}
                        disabled={convertDisabled}
                        title={convertDisabled ? "Only Qualified leads can be converted" : ""}
                    >
                        Convert
                    </button>
                )}
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
                        <h3 className={styles.groupTitle}>{activeTab}</h3>
                        {activeTab === "Calls" && <button className={styles.makeCallBtn} onClick={handleCall}>Make a phone call</button>}
                        {activeTab === "Tasks" && <button className={styles.makeCallBtn} onClick={onOpenTaskDrawer}>Create Task</button>}
                        {activeTab === "Meetings" && <button className={styles.makeCallBtn} onClick={onOpenMeetingDrawer}>Schedule Meeting</button>}
                    </div>
                )}

                <div className={styles.feed}>
                    {groups.map((group) => {
                        const groupItems = filteredActivities.filter((a) => a.group === group);
                        if (groupItems.length === 0) return null;

                        return (
                            <div key={group} className={styles.feedGroup}>
                                <h3 className={styles.groupTitle}>{activeTab === "Activity" ? group : ""}</h3>
                                {groupItems.map((item) => {
                                    const isExpanded = !!expandedItems[item.id];
                                    return (
                                        <div key={item.id} className={styles.feedItem}>
                                            {/* Accordion Header */}
                                            <div
                                                className={styles.itemHeader}
                                                onClick={() => toggleExpand(item.id)}
                                                style={{ cursor: 'pointer' }}
                                            >
                                                <span className={styles.itemType}>
                                                    <svg
                                                        width="12" height="12"
                                                        viewBox="0 0 24 24"
                                                        fill="none"
                                                        stroke="currentColor"
                                                        strokeWidth="3"
                                                        style={{
                                                            transform: isExpanded ? "rotate(0deg)" : "rotate(-90deg)",
                                                            color: "#5a4bff",
                                                            transition: "transform 0.2s ease"
                                                        }}
                                                    >
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

                                            {/* Accordion Body */}
                                            {isExpanded && (
                                                <div className={styles.itemBody}>
                                                    {(item.organizedBy || item.createdBy) && item.type !== "Email" && (
                                                        <p className={styles.organizedBy}>
                                                            {item.type === "Meeting" ? "Organized by " : "Created by "}
                                                            {item.organizedBy || item.createdBy}
                                                        </p>
                                                    )}
                                                    {item.type === "Task" ? (
                                                        <div className={styles.taskFull}>
                                                            <div className={styles.taskAction}>
                                                                <div
                                                                    className={styles.circleCheckbox}
                                                                    style={{
                                                                        background: item.completed ? "#5a4bff" : "transparent",
                                                                        borderColor: item.completed ? "#5a4bff" : "#cbd5e1",
                                                                    }}
                                                                    onClick={(e) => {
                                                                        e.stopPropagation();
                                                                        onToggleTask && onToggleTask(item.id);
                                                                    }}
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
                                                            {item.subNote && <p className={styles.subNote}>{item.subNote}</p>}
                                                        </div>
                                                    ) : item.type === "Meeting" ? (
                                                        <div className={styles.meetingFull}>
                                                            <div className={styles.infoBox}>
                                                                <div className={styles.infoField}>
                                                                    <label>Date & Time</label>
                                                                    <span>{item.time}</span>
                                                                </div>
                                                                <div className={styles.infoField}>
                                                                    <label>Duration</label>
                                                                    <CustomSelect
                                                                        className={styles.compactSelect}
                                                                        value={item.duration || ""}
                                                                        options={["15 mins", "30 mins", "45 mins", "1 hour", "1.5 hours", "2 hours"]}
                                                                        onChange={(val) => handleUpdate(item.id, { duration: val })}
                                                                    />
                                                                </div>
                                                                <div className={styles.infoField}>
                                                                    <label>Attendees</label>
                                                                    <input
                                                                        type="number"
                                                                        min="1"
                                                                        className={styles.attendeesInput}
                                                                        value={item.attendees || ""}
                                                                        onChange={(e) => handleUpdate(item.id, { attendees: e.target.value })}
                                                                    />
                                                                </div>
                                                            </div>
                                                            <p className={styles.itemText}>{item.content || item.note || item.body}</p>
                                                        </div>
                                                    ) : item.type === "Email" ? (
                                                        <div className={styles.emailFull}>
                                                            <div className={styles.infoBox}>
                                                                <div className={styles.infoField}>
                                                                    <label>From</label>
                                                                    <span>{item.from}</span>
                                                                </div>
                                                                <div className={styles.infoField}>
                                                                    <label>To</label>
                                                                    <span>{item.to}</span>
                                                                </div>
                                                                <div className={styles.infoField}>
                                                                    <label>Subject</label>
                                                                    <span>{item.subject}</span>
                                                                </div>
                                                            </div>
                                                            <p className={styles.itemText}>{item.body || item.content}</p>
                                                        </div>
                                                    ) : (
                                                        <>
                                                            <p className={styles.itemText}>{item.content || item.body || item.note}</p>
                                                            {item.type === "Call" && (activeTab === "Calls" || activeTab === "Activity") && (
                                                                <div className={styles.outcomeRow}>
                                                                    <div className={styles.outcomeField}>
                                                                        <label>Outcome *</label>
                                                                        <CustomSelect
                                                                            value={item.outcome || ""}
                                                                            options={["Busy", "Connected", "No Answer", "Left Message", "Wrong Number"]}
                                                                            onChange={(val) => handleUpdate(item.id, { outcome: val })}
                                                                        />
                                                                    </div>
                                                                    <div className={styles.outcomeField}>
                                                                        <label>Duration *</label>
                                                                        <div className={styles.durationInputWrapper}>
                                                                            <CustomSelect
                                                                                value={item.duration || ""}
                                                                                options={["1 min", "2 mins", "5 mins", "10 mins", "15 mins", "30 mins", "1 hour"]}
                                                                                onChange={(val) => handleUpdate(item.id, { duration: val })}
                                                                            />
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            )}
                                                        </>
                                                    )}
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default ActivityFeed;
