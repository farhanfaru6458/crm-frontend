import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./GenericDetails.module.css";
import ActivityFeed from "../../common/ActivityFeed/ActivityFeed";
import { toast } from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import { addNotification } from "../../../redux/notificationsSlice";
import ConfirmDialog from "../../ui/ConfirmDialog";
import { useAuth } from "../../../context/AuthContext";
import axios from "axios";
import CustomSelect from "../../ui/CustomSelect/CustomSelect";

const GenericDetails = ({
  entity,
  activities: initialActivities,
  config,
  onFieldChange,
  onSaveEdit,
  onDelete,
  onCreateActivity,
  onUpdateActivity,
  onToggleTask,
  showConvertButton = false,
  onConvert,
}) => {
  const { user } = useAuth();
  const dispatch = useDispatch();
  const { deals } = useSelector(state => state.deals);
  const hasActiveDeal = config.entityName === "Lead" && deals.some(d => d.associatedLeadId === entity._id);
  const isEditDisabled = config.entityName === "Lead" && entity.status === "Converted" && hasActiveDeal;

  const [activeTab, setActiveTab] = useState("Activity");
  const [activities, setActivities] = useState(initialActivities || []);
  const [owners, setOwners] = useState([]);

  useEffect(() => {
    setActivities(initialActivities || []);
  }, [initialActivities]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (user?.role === 'admin') {
        const token = localStorage.getItem('crm_token') || sessionStorage.getItem('crm_token');
        try {
          const res = await axios.get("http://localhost:5000/api/users", {
            headers: { Authorization: `Bearer ${token}` }
          });
          const formattedOwners = res.data.map(u => `${u.firstName} ${u.lastName}`);
          setOwners(formattedOwners);
        } catch (e) {
          console.error(e);
          setOwners([`${user.firstName} ${user.lastName}`]);
        }
      } else if (user) {
        setOwners([`${user.firstName} ${user.lastName}`]);
      }
    };
    fetchUsers();
  }, [user]);

  // Drawer/Modal States
  const [isNoteDrawerOpen, setIsNoteDrawerOpen] = useState(false);
  const [isCallDrawerOpen, setIsCallDrawerOpen] = useState(false);
  const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
  const [isEditDrawerOpen, setIsEditDrawerOpen] = useState(false);
  const [isMeetingDrawerOpen, setIsMeetingDrawerOpen] = useState(false);
  const [isTaskDrawerOpen, setIsTaskDrawerOpen] = useState(false);
  const [isConvertDrawerOpen, setIsConvertDrawerOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  // Accordion state for activity buttons
  const [isActivityOpen, setIsActivityOpen] = useState(true);
  const [isAboutOpen, setIsAboutOpen] = useState(true);
  const [errors, setErrors] = useState({});

  // Convert form state
  const [convertForm, setConvertForm] = useState({
    dealName: "",
    dealStage: "Appointment Scheduled",
    amount: "",
    closeDate: "",
    dealOwner: "",
  });

  const fileInputRef = useRef(null);
  const [attachments, setAttachments] = useState([]);

  // Separate ref and state for email form attachments
  const emailFileInputRef = useRef(null);
  const [emailAttachments, setEmailAttachments] = useState([]);

  const handleFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type,
        date: new Date().toLocaleDateString(),
      }));
      setAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const handleEmailFileChange = (e) => {
    if (e.target.files) {
      const newFiles = Array.from(e.target.files).map((file) => ({
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        size: (file.size / 1024).toFixed(2) + " KB",
        type: file.type,
      }));
      setEmailAttachments((prev) => [...prev, ...newFiles]);
    }
  };

  const triggerEmailFileInput = () => {
    emailFileInputRef.current?.click();
  };

  const removeEmailAttachment = (id) => {
    setEmailAttachments((prev) => prev.filter((a) => a.id !== id));
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

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const deleteAttachment = (id) => {
    setAttachments((prev) => prev.filter((a) => a.id !== id));
  };

  useEffect(() => {
    setActivities(initialActivities || []);
  }, [initialActivities]);

  const toggleTask = (taskId) => {
    if (onToggleTask) {
      onToggleTask(taskId);
    } else {
      setActivities((prev) =>
        prev.map((a) =>
          a.id === taskId ? { ...a, completed: !a.completed } : a
        )
      );
    }
    toast.success("Task status updated");
  };

  const updateActivity = (id, updates) => {
    if (onUpdateActivity) {
      const activity = activities.find((a) => a.id === id || a._id === id);
      onUpdateActivity(id, { ...updates, type: activity?.type });
    } else {
      setActivities((prev) =>
        prev.map((a) => (a.id === id ? { ...a, ...updates } : a))
      );
    }
  };

  const handleSelectChange = (field, value) => {
    if (isCallDrawerOpen) {
      setCallFormData(prev => ({ ...prev, [field]: value }));
    } else if (isMeetingDrawerOpen) {
      setMeetingFormData(prev => ({ ...prev, [field]: value }));
    } else if (isConvertDrawerOpen) {
      setConvertForm(prev => ({ ...prev, [field]: value }));
    } else {
      onFieldChange(field, value);
    }
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: "" }));
  };

  const [callFormData, setCallFormData] = useState({
    outcome: "",
    duration: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    note: ""
  });

  const [noteFormData, setNoteFormData] = useState({
    note: ""
  });

  const [taskFormData, setTaskFormData] = useState({
    name: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    note: "",
    priority: "High",
    type: "To-Do",
    assignedTo: ""
  });

  const [meetingFormData, setMeetingFormData] = useState({
    title: "",
    date: new Date().toISOString().split('T')[0],
    startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    note: "",
    duration: "30 mins",
    attendees: "1"
  });

  const [emailFormData, setEmailFormData] = useState({
    to: entity?.email || "",
    subject: "",
    body: ""
  });

  // Keep email in sync when entity changes
  useEffect(() => {
    if (entity?.email) {
      setEmailFormData(prev => ({ ...prev, to: entity.email }));
    }
  }, [entity?.email]);

  const handleLogCall = () => {
    if (!callFormData.outcome || !callFormData.duration || !callFormData.note.trim()) {
      const callErrors = {};
      if (!callFormData.outcome) callErrors.callOutcome = "Outcome is required";
      if (!callFormData.duration) callErrors.callDuration = "Duration is required";
      if (!callFormData.note.trim()) callErrors.callNote = "Note is required";
      setErrors(callErrors);
      toast.error("Please fill in all required call details");
      return;
    }
    const newCall = {
      type: "Call",
      outcome: callFormData.outcome,
      duration: callFormData.duration || "N/A",
      date: callFormData.date,
      time: callFormData.time,
      note: callFormData.note || "No notes provided.",
      createdBy: `${user.firstName} ${user.lastName}`
    };

    if (onCreateActivity) {
      onCreateActivity(newCall);
    } else {
      setActivities([{ ...newCall, id: Date.now(), title: "Call logged", time: `${callFormData.date} at ${callFormData.time}`, group: "Recent" }, ...activities]);
    }

    setIsCallDrawerOpen(false);
    toast.success("Call logged successfully");
    setCallFormData({
      outcome: "",
      duration: "",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      note: ""
    });
  };

  const handleLogNote = () => {
    if (!noteFormData.note.trim()) {
      setErrors({ note: "Note content cannot be empty" });
      toast.error("Note content cannot be empty");
      return;
    }
    const newNote = {
      type: "Note",
      content: noteFormData.note,
      createdBy: `${user.firstName} ${user.lastName}`
    };

    if (onCreateActivity) {
      onCreateActivity(newNote);
    } else {
      setActivities([{
        ...newNote,
        id: Date.now(),
        title: `Note by ${user.firstName} ${user.lastName}`,
        time: new Date().toLocaleString([], { month: 'long', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        group: "Recent"
      }, ...activities]);
    }

    setIsNoteDrawerOpen(false);
    toast.success("Note saved successfully");
    setNoteFormData({ note: "" });
    setErrors({});
  };

  const handleLogTask = () => {
    if (!taskFormData.name.trim()) {
      setErrors({ taskName: "Task name is required" });
      toast.error("Task name is required");
      return;
    }
    const newTask = {
      type: "Task",
      name: taskFormData.name,
      date: taskFormData.date,
      time: taskFormData.time,
      note: taskFormData.note || "No description provided.",
      priority: taskFormData.priority,
      taskType: taskFormData.type,
      assignedTo: taskFormData.assignedTo,
      completed: false,
      createdBy: `${user.firstName} ${user.lastName}`,
      title: taskFormData.assignedTo ? `Task assigned to ${taskFormData.assignedTo}` : `Task: ${taskFormData.name}`
    };

    if (onCreateActivity) {
      onCreateActivity(newTask);
    } else {
      setActivities([{
        ...newTask,
        id: Date.now(),
        title: taskFormData.name,
        time: `${taskFormData.date} at ${taskFormData.time}`,
        group: "Upcoming"
      }, ...activities]);
    }

    setIsTaskDrawerOpen(false);
    toast.success("Task created successfully");
    setTaskFormData({
      name: "",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      note: "",
      priority: "Medium",
      type: "To-Do"
    });
    setErrors({});
  };

  const handleLogMeeting = () => {
    if (!meetingFormData.title.trim() || !meetingFormData.note.trim()) {
      const meetingErrors = {};
      if (!meetingFormData.title.trim()) meetingErrors.meetingTitle = "Title is required";
      if (!meetingFormData.note.trim()) meetingErrors.meetingNote = "Note is required";
      setErrors(meetingErrors);
      toast.error("Please fill in meeting title and note");
      return;
    }
    const newMeeting = {
      type: "Meeting",
      title: meetingFormData.title,
      date: meetingFormData.date,
      startTime: meetingFormData.startTime,
      endTime: meetingFormData.endTime,
      note: meetingFormData.note || "No description provided.",
      duration: meetingFormData.duration || "N/A",
      attendees: meetingFormData.attendees || "1",
      organizedBy: `${user.firstName} ${user.lastName}`
    };

    if (onCreateActivity) {
      onCreateActivity(newMeeting);
    } else {
      setActivities([{
        ...newMeeting,
        id: Date.now(),
        time: `${meetingFormData.date} at ${meetingFormData.startTime}`,
        group: "Upcoming"
      }, ...activities]);
    }

    setIsMeetingDrawerOpen(false);
    toast.success("Meeting scheduled successfully");
    setMeetingFormData({
      title: "",
      date: new Date().toISOString().split('T')[0],
      startTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      endTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      note: "",
      duration: "30 mins",
      attendees: "1"
    });
    setErrors({});
  };

  const handleSendEmail = () => {
    const emailErrors = {};
    if (!emailFormData.subject.trim()) emailErrors.emailSubject = "Subject is required";
    if (!emailFormData.body.trim()) emailErrors.emailBody = "Body is required";

    if (Object.keys(emailErrors).length > 0) {
      setErrors(emailErrors);
      toast.error("Subject and body are required");
      return;
    }
    const now = new Date();
    const newEmail = {
      type: "Email",
      subject: emailFormData.subject,
      to: emailFormData.to,
      from: user.email,
      body: emailFormData.body,
      date: now.toISOString().split('T')[0],
      time: now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      createdBy: `${user.firstName} ${user.lastName}`
    };

    if (onCreateActivity) {
      onCreateActivity(newEmail);
    } else {
      setActivities([{
        ...newEmail,
        id: Date.now(),
        title: newEmail.subject,
        time: `${newEmail.date} at ${newEmail.time}`,
        group: "Recent",
        content: newEmail.body
      }, ...activities]);
    }

    setIsEmailModalOpen(false);
    toast.success("Email sent successfully");
    setErrors({});
    setEmailAttachments([]);
    setEmailFormData({
      to: entity.email || "",
      subject: "",
      body: "",
    });
  };

  const tabs = config.tabs || [
    "Activity",
    "Notes",
    "Emails",
    "Calls",
    "Tasks",
    "Meetings",
  ];

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

  // filteredActivities removed, logic moved to ActivityFeed

  const handleEditSave = () => {
    onSaveEdit();
    setIsEditDrawerOpen(false);
  };

  return (
    <div className={styles.container}>
      <Link to={config.backLink} className={styles.breadcrumb}>
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
        {config.moduleName}
      </Link>

      <div className={styles.mainLayout}>
        <aside className={styles.leftSidebar}>
          <div className={styles.card}>
            <div className={styles.profileTop}>
              {config.showAvatar && (
                <div className={styles.avatarCircle}>
                  {entity[config.titleField]
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("")
                    .substring(0, 2)
                    .toUpperCase()}
                </div>
              )}
              <div>
                <h2 className={styles.entityTitle}>
                  {entity[config.titleField]}
                </h2>
                {config.entityName === "Lead" && entity.email && (
                  <div className={styles.headerEmailRow}>
                    <p className={styles.entityEmail}>
                      {entity.email}
                    </p>
                    <svg
                      className={styles.copyIcon}
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      onClick={() => {
                        navigator.clipboard.writeText(entity.email);
                        toast.success("Email copied!");
                      }}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7v8a2 2 0 002 2h6M8 7V5a2 2 0 012-2h4.586a1 1 0 01.707.293l4.414 4.414a1 1 0 01.293.707V15a2 2 0 01-2 2h-2M8 7H6a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2v-2"
                      />
                    </svg>
                  </div>
                )}
                {config.subTitleRender ? (
                  <p className={styles.entitySub}>
                    {config.subTitleRender(entity)}
                  </p>
                ) : (
                  config.subTitleField && (
                    <p className={styles.entitySub}>
                      {entity[config.subTitleField]}
                    </p>
                  )
                )}
                {config.websiteField && (
                  <div className={styles.websiteLinkRow}>
                    {entity[config.websiteField]}
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
                )}
              </div>
            </div>

            {/* Activity Buttons Accordion */}
            <div className={styles.activityAccordion}>
              <div
                className={styles.activityAccordionHeader}
                onClick={() => setIsActivityOpen(!isActivityOpen)}
              >
                <span className={styles.activityAccordionTitle}>
                  <svg
                    width="12" height="12" viewBox="0 0 24 24"
                    fill="none" stroke="currentColor" strokeWidth="3"
                    style={{
                      transform: isActivityOpen ? "rotate(0deg)" : "rotate(-90deg)",
                      transition: "transform 0.25s ease",
                      color: "#5a4bff",
                      flexShrink: 0,
                    }}
                  >
                    <path d="M19 9l-7 7-7-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Activities
                </span>
              </div>
              {isActivityOpen && (
                <div className={styles.actionButtons}>
                  <button
                    className={styles.toolBtn}
                    onClick={() => setIsNoteDrawerOpen(true)}
                  >
                    {icons.Note}
                    <span className={styles.toolLabel}>Note</span>
                  </button>
                  <button
                    className={styles.toolBtn}
                    onClick={() => setIsEmailModalOpen(true)}
                  >
                    {icons.Email}
                    <span className={styles.toolLabel}>Email</span>
                  </button>
                  <button
                    className={styles.toolBtn}
                    onClick={() => setIsCallDrawerOpen(true)}
                  >
                    {icons.Call}
                    <span className={styles.toolLabel}>Call</span>
                  </button>
                  <button
                    className={styles.toolBtn}
                    onClick={() => setIsTaskDrawerOpen(true)}
                  >
                    {icons.Task}
                    <span className={styles.toolLabel}>Task</span>
                  </button>
                  <button
                    className={styles.toolBtn}
                    onClick={() => setIsMeetingDrawerOpen(true)}
                  >
                    {icons.Meeting}
                    <span className={styles.toolLabel}>Meeting</span>
                  </button>
                </div>
              )}
            </div>

            <div
              className={styles.sectionCollapse}
              onClick={() => setIsAboutOpen(!isAboutOpen)}
            >
              <span className={styles.sectionTitle}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  style={{
                    transform: isAboutOpen ? "rotate(0deg)" : "rotate(-90deg)",
                    transition: "transform 0.2s ease"
                  }}
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                About this {config.entityName}
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className={`${styles.editIcon} ${isEditDisabled ? styles.disabledEdit : ""}`}
                onClick={(e) => {
                  e.stopPropagation();
                  if (isEditDisabled) {
                    toast.error("Converted leads cannot be edited unless their deal is deleted.");
                    return;
                  }
                  setIsEditDrawerOpen(true);
                }}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m16.862 4.487 1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L10.582 16.07a4.5 4.5 0 0 1-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 0 1 1.13-1.897l8.932-8.931Zm0 0L19.5 7.125"
                />
              </svg>
            </div>

            {isAboutOpen && (
              <div className={styles.detailsList}>
                {config.detailsFields.map((field, idx) => (
                  <div key={idx} className={styles.detailItem}>
                    <span className={styles.detailLabel}>{field.label}</span>
                    <span className={styles.detailValue}>
                      {field.render
                        ? field.render(entity[field.key])
                        : entity[field.key]}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>

        <section className={styles.centerContent}>
          <ActivityFeed
            activities={activities}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onToggleTask={toggleTask}
            onUpdateActivity={updateActivity}
            onOpenCallDrawer={() => setIsCallDrawerOpen(true)}
            onOpenTaskDrawer={() => setIsTaskDrawerOpen(true)}
            onOpenMeetingDrawer={() => setIsMeetingDrawerOpen(true)}
            tabs={tabs}
            showConvertButton={showConvertButton}
            onConvert={() => setIsConvertDrawerOpen(true)}
            convertDisabled={config.moduleName === "Leads" && entity.status !== "Qualified"}
          />
        </section>

        <aside className={styles.rightSidebar}>
          <div className={styles.aiSummaryCard}>
            <div className={styles.aiHeader}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
                <path
                  d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM13 17H11V15H13V17ZM13 13H11V7H13V13Z"
                  fill="currentColor"
                />
              </svg>
              AI {config.entityName} Summary
            </div>
            <div className={styles.aiContent}>
              There are no activities associated with this{" "}
              {config.entityName.toLowerCase()} and further details are needed
              to provide a comprehensive summary.
            </div>
          </div>
          <div className={styles.attachmentsSection}>
            <div className={styles.attachHeader}>
              <div className={styles.attachTitle}>
                <svg
                  width="12"
                  height="12"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path
                    d="M19 9l-7 7-7-7"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                Attachments
              </div>
              <span className={styles.addBtn} onClick={triggerFileInput}>
                + Add
              </span>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
                multiple
              />
            </div>
            {attachments.length === 0 ? (
              <p className={styles.emptyAttach}>
                See the files attached to your activities or uploaded to this
                record.
              </p>
            ) : (
              <div className={styles.attachmentList}>
                {attachments.map((file) => (
                  <div key={file.id} className={styles.attachmentItem}>
                    <div className={styles.fileIcon}>
                      <svg
                        width="16"
                        height="16"
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                      >
                        <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
                        <path d="M14 2v6h6" />
                      </svg>
                    </div>
                    <div className={styles.fileInfo}>
                      <span className={styles.fileName}>{file.name}</span>
                      <span className={styles.fileSize}>{file.size}</span>
                    </div>
                    <button
                      className={styles.deleteFileBtn}
                      onClick={() => deleteAttachment(file.id)}
                    >
                      ×
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </aside>
      </div>

      {isNoteDrawerOpen && (
        <>
          <div
            className={styles.drawerOverlay}
            onClick={() => setIsNoteDrawerOpen(false)}
          ></div>
          <div className={styles.rightDrawer}>
            <div className={styles.drawerHeader}>
              <h3>Create Note</h3>
              <button onClick={() => setIsNoteDrawerOpen(false)}>×</button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.field}>
                <label>
                  Note <span>*</span>
                </label>
                <textarea
                  className={`${styles.simpleTextarea} ${errors.note ? styles.errorInput : ""}`}
                  placeholder="Enter your note here..."
                  value={noteFormData.note}
                  onChange={(e) => {
                    setNoteFormData({ note: e.target.value });
                    if (errors.note) setErrors({});
                  }}
                ></textarea>
                {errors.note && <span className={styles.errorText}>{errors.note}</span>}
              </div>
            </div>
            <div className={styles.drawerFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsNoteDrawerOpen(false)}
              >
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleLogNote}>Save</button>
            </div>
          </div>
        </>
      )}

      {isTaskDrawerOpen && (
        <>
          <div
            className={styles.drawerOverlay}
            onClick={() => setIsTaskDrawerOpen(false)}
          ></div>
          <div className={styles.rightDrawer}>
            <div className={styles.drawerHeader}>
              <h3>Create Task</h3>
              <button onClick={() => setIsTaskDrawerOpen(false)}>×</button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.field}>
                <label>
                  Task Name <span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter"
                  className={errors.taskName ? styles.errorInput : ""}
                  value={taskFormData.name}
                  onChange={(e) => {
                    setTaskFormData({ ...taskFormData, name: e.target.value });
                    if (errors.taskName) setErrors({});
                  }}
                />
                {errors.taskName && <span className={styles.errorText}>{errors.taskName}</span>}
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>
                    Due Date <span>*</span>
                  </label>
                  <div className={styles.iconInput}>
                    <input
                      type="date"
                      value={taskFormData.date}
                      onChange={(e) => setTaskFormData({ ...taskFormData, date: e.target.value })}
                    />
                   
                  </div>
                </div>
                <div className={styles.field}>
                  <label>
                    Time <span>*</span>
                  </label>
                  <div className={styles.iconInput}>
                    <input
                      type="time"
                      value={taskFormData.time}
                      onChange={(e) => setTaskFormData({ ...taskFormData, time: e.target.value })}
                    />
                  
                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <CustomSelect
                    label="Task Type *"
                    value={taskFormData.type}
                    options={["To-Do", "Email", "Call", "Meeting"]}
                    onChange={(val) => setTaskFormData(prev => ({ ...prev, type: val }))}
                  />
                </div>
                <div className={styles.field}>
                  <CustomSelect
                    label="Priority *"
                    value={taskFormData.priority}
                    options={["High", "Medium", "Low"]}
                    onChange={(val) => setTaskFormData(prev => ({ ...prev, priority: val }))}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <CustomSelect
                  label="Assigned to *"
                  value={taskFormData.assignedTo}
                  options={owners}
                  onChange={(val) => setTaskFormData(prev => ({ ...prev, assignedTo: val }))}
                />
              </div>
              <div className={styles.field}>
                <label>
                  Note <span>*</span>
                </label>
                <textarea
                  className={styles.richTextarea}
                  placeholder="Enter"
                  value={taskFormData.note}
                  onChange={(e) => setTaskFormData({ ...taskFormData, note: e.target.value })}
                ></textarea>
              </div>
            </div>
            <div className={styles.drawerFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsTaskDrawerOpen(false)}
              >
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleLogTask}>Save</button>
            </div>
          </div>
        </>
      )}

      {isMeetingDrawerOpen && (
        <>
          <div
            className={styles.drawerOverlay}
            onClick={() => setIsMeetingDrawerOpen(false)}
          ></div>
          <div className={styles.rightDrawer}>
            <div className={styles.drawerHeader}>
              <h3>Schedule Meeting</h3>
              <button onClick={() => setIsMeetingDrawerOpen(false)}>×</button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.field}>
                <label>
                  Title <span>*</span>
                </label>
                <input
                  type="text"
                  placeholder="Enter"
                  className={errors.meetingTitle ? styles.errorInput : ""}
                  value={meetingFormData.title}
                  onChange={(e) => {
                    setMeetingFormData({ ...meetingFormData, title: e.target.value });
                    if (errors.meetingTitle) setErrors({});
                  }}
                />
                {errors.meetingTitle && <span className={styles.errorText}>{errors.meetingTitle}</span>}
              </div>
              <div className={styles.field}>
                <label>
                  Start Date <span>*</span>
                </label>
                <div >
                  <input
                    type="date"
                    value={meetingFormData.date}
                    onChange={(e) => setMeetingFormData({ ...meetingFormData, date: e.target.value })}
                  />

                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>
                    Start Time <span>*</span>
                  </label>
                  <div >
                    <input
                      type="time"
                      value={meetingFormData.startTime}
                      onChange={(e) => setMeetingFormData({ ...meetingFormData, startTime: e.target.value })}
                    />

                  </div>
                </div>
                <div className={styles.field}>
                  <label>
                    End Time <span>*</span>
                  </label>
                  <div >
                    <input
                      type="time"
                      value={meetingFormData.endTime}
                      onChange={(e) => setMeetingFormData({ ...meetingFormData, endTime: e.target.value })}
                    />

                  </div>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <CustomSelect
                    label="Duration"
                    value={meetingFormData.duration}
                    options={["15 mins", "30 mins", "45 mins", "1 hour", "1.5 hours", "2 hours"]}
                    onChange={(val) => handleSelectChange("duration", val)}
                  />
                </div>
                <div className={styles.field}>
                  <label>Attendees</label>
                  <input
                    type="number"
                    min="1"
                    className={styles.input}
                    value={meetingFormData.attendees}
                    onChange={(e) => setMeetingFormData({ ...meetingFormData, attendees: e.target.value })}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <label>
                  Note <span>*</span>
                </label>
                <textarea
                  className={`${styles.simpleTextarea} ${errors.meetingNote ? styles.errorInput : ""}`}
                  placeholder="Enter meeting details..."
                  value={meetingFormData.note}
                  onChange={(e) => {
                    setMeetingFormData({ ...meetingFormData, note: e.target.value });
                    if (errors.meetingNote) setErrors({});
                  }}
                ></textarea>
                {errors.meetingNote && <span className={styles.errorText}>{errors.meetingNote}</span>}
              </div>
            </div>
            <div className={styles.drawerFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsMeetingDrawerOpen(false)}
              >
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleLogMeeting}>Save</button>
            </div>
          </div>
        </>
      )}

      {isCallDrawerOpen && (
        <>
          <div
            className={styles.drawerOverlay}
            onClick={() => setIsCallDrawerOpen(false)}
          ></div>
          <div className={styles.rightDrawer}>
            <div className={styles.drawerHeader}>
              <h3>Log Call</h3>
              <button onClick={() => setIsCallDrawerOpen(false)}>×</button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.field}>
                <label>
                  Connected <span>*</span>
                </label>
                <input type="text" value={entity[config.titleField]} readOnly />
              </div>
              <div className={styles.field}>
                <CustomSelect
                  label="Call Outcome *"
                  value={callFormData.outcome}
                  options={["Busy", "Connected", "No Answer", "Left Message", "Wrong Number"]}
                  onChange={(val) => handleSelectChange("outcome", val)}
                  error={errors.callOutcome}
                />
              </div>
              <div className={styles.field}>
                <CustomSelect
                  label="Duration *"
                  value={callFormData.duration}
                  options={["1 min", "2 mins", "5 mins", "10 mins", "15 mins", "30 mins", "1 hour"]}
                  onChange={(val) => handleSelectChange("duration", val)}
                  error={errors.callDuration}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>
                    Date <span>*</span>
                  </label>
                  <div className={styles.iconInput}>
                    <input
                      type="date"
                      value={callFormData.date}
                      onChange={(e) => setCallFormData({ ...callFormData, date: e.target.value })}
                    />
                  
                  </div>
                </div>
                <div className={styles.field}>
                  <label>
                    Time <span>*</span>
                  </label>
                  <div className={styles.iconInput}>
                    <input
                      type="time"
                      value={callFormData.time}
                      onChange={(e) => setCallFormData({ ...callFormData, time: e.target.value })}
                    />
                   
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <label>
                  Note <span>*</span>
                </label>
                <textarea
                  className={`${styles.simpleTextarea} ${errors.callNote ? styles.errorInput : ""}`}
                  placeholder="Enter call notes..."
                  value={callFormData.note}
                  onChange={(e) => {
                    setCallFormData({ ...callFormData, note: e.target.value });
                    if (errors.callNote) setErrors({});
                  }}
                ></textarea>
                {errors.callNote && <span className={styles.errorText}>{errors.callNote}</span>}
              </div>
            </div>
            <div className={styles.drawerFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsCallDrawerOpen(false)}
              >
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleLogCall}>Save</button>
            </div>
          </div>
        </>
      )}

      {isEditDrawerOpen && (
        <>
          <div
            className={styles.drawerOverlay}
            onClick={() => setIsEditDrawerOpen(false)}
          ></div>
          <div className={styles.rightDrawer}>
            <div className={styles.drawerHeader}>
              <h3>Edit {config.entityName}</h3>
              <button onClick={() => setIsEditDrawerOpen(false)}>×</button>
            </div>
            <div className={styles.drawerBody}>
              {config.editFields.map((field, idx) => (
                <div key={idx} className={styles.field}>
                  <label>{field.label}</label>
                  <input
                    type="text"
                    value={entity[field.key] || ""}
                    onChange={(e) => onFieldChange(field.key, e.target.value)}
                  />
                </div>
              ))}
            </div>
            <div className={styles.drawerFooter}>
              {onDelete && (
                <button
                  className={styles.deleteBtn}
                  onClick={() => setIsConfirmOpen(true)}
                >
                  Delete {config.entityName}
                </button>
              )}
              <div style={{ flex: 1 }}></div>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsEditDrawerOpen(false)}
              >
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={handleEditSave}>
                Save
              </button>
            </div>
          </div>
        </>
      )}

      {isEmailModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.emailModal}>
            <div className={styles.emailHeader}>
              <h3>New Email</h3>
              <button onClick={() => { setIsEmailModalOpen(false); setEmailAttachments([]); }}>×</button>
            </div>
            <div className={styles.emailBody}>
              <div className={styles.emailRow}>
                <label>Recipients</label>
                <input
                  type="text"
                  value={emailFormData.to}
                  onChange={(e) => setEmailFormData({ ...emailFormData, to: e.target.value })}
                />
                <div className={styles.emailActions}>
                  <span>Cc</span> <span>Bcc</span>
                </div>
              </div>
              <div className={styles.emailRow}>
                <label>Subject</label>
                <input
                  type="text"
                  placeholder="Subject"
                  className={errors.emailSubject ? styles.errorInput : ""}
                  value={emailFormData.subject}
                  onChange={(e) => {
                    setEmailFormData({ ...emailFormData, subject: e.target.value });
                    if (errors.emailSubject) setErrors({});
                  }}
                />
                {errors.emailSubject && <span className={styles.errorText}>{errors.emailSubject}</span>}
              </div>
              <div className={styles.emailEditor}>
                <textarea
                  placeholder="Body Text"
                  className={errors.emailBody ? styles.errorInput : ""}
                  value={emailFormData.body}
                  onChange={(e) => {
                    setEmailFormData({ ...emailFormData, body: e.target.value });
                    if (errors.emailBody) setErrors({});
                  }}
                ></textarea>
                {errors.emailBody && <span className={styles.errorText}>{errors.emailBody}</span>}
              </div>
              {emailAttachments.length > 0 && (
                <div className={styles.emailAttachmentList}>
                  {emailAttachments.map((file) => (
                    <div key={file.id} className={styles.emailAttachmentItem}>
                      <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21.44 11.05l-9.19 9.19a6 6 0 01-8.49-8.49l9.19-9.19a4 4 0 015.66 5.66l-9.2 9.19a2 2 0 01-2.83-2.83l8.49-8.48" strokeLinecap="round" strokeLinejoin="round" />
                      </svg>
                      <span className={styles.emailAttachName}>{file.name}</span>
                      <span className={styles.emailAttachSize}>{file.size}</span>
                      <button
                        className={styles.removeEmailAttach}
                        onClick={() => removeEmailAttachment(file.id)}
                        title="Remove attachment"
                      >×</button>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {/* Hidden file input scoped to email form only */}
            <input
              type="file"
              ref={emailFileInputRef}
              style={{ display: "none" }}
              onChange={handleEmailFileChange}
              multiple
            />
            <div className={styles.emailFooter}>
              <div className={styles.footerLeft}>
                <button className={styles.sendBtn} onClick={handleSendEmail}>Send</button>
                <div className={styles.footerIcons}>
                  <span onClick={triggerEmailFileInput} title="Attach files">Clip</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ===== CONVERT LEAD TO DEAL DRAWER ===== */}
      {isConvertDrawerOpen && (
        <>
          <div
            className={styles.drawerOverlay}
            onClick={() => setIsConvertDrawerOpen(false)}
          ></div>
          <div className={styles.rightDrawer}>
            <div className={styles.drawerHeader}>
              <h3>Convert Lead to Deal</h3>
              <button onClick={() => setIsConvertDrawerOpen(false)}>×</button>
            </div>
            <div className={styles.drawerBody}>
              <div className={styles.convertBanner}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                <span>Converting <strong>{entity?.[config?.titleField]}</strong> to a Deal</span>
              </div>
              <div className={styles.field}>
                <label>Deal Name <span>*</span></label>
                <input
                  type="text"
                  placeholder={`Deal with ${entity?.[config?.titleField] || "Lead"}`}
                  value={convertForm.dealName}
                  onChange={(e) => setConvertForm(prev => ({ ...prev, dealName: e.target.value }))}
                />
              </div>
              <div className={styles.field}>
                <CustomSelect
                  label="Deal Stage *"
                  value={convertForm.dealStage}
                  options={[
                    "Appointment Scheduled", "Qualified to Buy", "Presentation Scheduled",
                    "Decision Maker Bought In", "Contract Sent", "Closed Won", "Closed Lost"
                  ]}
                  onChange={(val) => handleSelectChange("dealStage", val)}
                />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>Amount (USD)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={convertForm.amount}
                    onChange={(e) => setConvertForm(prev => ({ ...prev, amount: e.target.value }))}
                  />
                </div>
                <div className={styles.field}>
                  <label>Close Date <span>*</span></label>
                  <input
                    type="date"
                    value={convertForm.closeDate}
                    onChange={(e) => setConvertForm(prev => ({ ...prev, closeDate: e.target.value }))}
                  />
                </div>
              </div>
              <div className={styles.field}>
                <CustomSelect
                  label="Deal Owner"
                  value={convertForm.dealOwner}
                  options={owners}
                  onChange={(val) => handleSelectChange("dealOwner", val)}
                />
              </div>
            </div>
            <div className={styles.drawerFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsConvertDrawerOpen(false)}
              >
                Cancel
              </button>
              <button
                className={styles.convertSaveBtn}
                onClick={() => {
                  if (!convertForm.dealName || !convertForm.closeDate) {
                    toast.error("Please fill in Deal Name and Close Date.");
                    return;
                  }
                  toast.success(`Lead successfully converted to Deal!`);
                  dispatch(addNotification({
                    id: Date.now(),
                    message: `Lead ${entity?.[config?.titleField]} successfully converted to Deal: "${convertForm.dealName}"!`,
                    type: "convert",
                    timestamp: new Date().toLocaleString()
                  }));
                  setIsConvertDrawerOpen(false);
                  if (onConvert) onConvert(convertForm);
                }}
              >
                Convert to Deal
              </button>
            </div>
          </div>
        </>
      )}

      <ConfirmDialog
        isOpen={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={onDelete}
        title={`Delete ${config.entityName}`}
        message={`Are you sure you want to delete ${entity[config.titleField]}?`}
      />
    </div>
  );
};

export default GenericDetails;
