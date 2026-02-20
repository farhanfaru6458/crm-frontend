import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import styles from "./GenericDetails.module.css";
import ActivityFeed from "../../common/ActivityFeed/ActivityFeed";
import { toast } from "react-hot-toast";
import { useDispatch } from "react-redux";
import { addNotification } from "../../../redux/notificationsSlice";
import ConfirmDialog from "../../ui/ConfirmDialog";

const GenericDetails = ({
  entity,
  activities: initialActivities,
  config,
  onFieldChange,
  onSaveEdit,
  onDelete,
  showConvertButton = false,
  onConvert,
}) => {
  const dispatch = useDispatch();
  const [activeTab, setActiveTab] = useState("Activity");
  const [activities, setActivities] = useState(initialActivities || []);

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
    setActivities(
      activities.map((a) =>
        a.id === taskId ? { ...a, completed: !a.completed } : a,
      ),
    );
  };

  const updateActivity = (id, updates) => {
    setActivities(
      activities.map((a) => (a.id === id ? { ...a, ...updates } : a)),
    );
  };

  const [callFormData, setCallFormData] = useState({
    outcome: "",
    duration: "",
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
    note: ""
  });

  const handleLogCall = () => {
    const newCall = {
      id: Date.now(),
      type: "Call",
      title: "Call logged",
      time: `${callFormData.date} at ${callFormData.time}`,
      group: "Recent",
      content: callFormData.note,
      outcome: callFormData.outcome,
      duration: callFormData.duration
    };
    setActivities([newCall, ...activities]);
    setIsCallDrawerOpen(false);
    setCallFormData({
      outcome: "",
      duration: "",
      date: new Date().toISOString().split('T')[0],
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false }),
      note: ""
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
                    onClick={handleCall}
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
                className={styles.editIcon}
                onClick={(e) => {
                  e.stopPropagation();
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
                  className={styles.simpleTextarea}
                  placeholder="Enter your note here..."
                ></textarea>
              </div>
            </div>
            <div className={styles.drawerFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsNoteDrawerOpen(false)}
              >
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={() => setIsNoteDrawerOpen(false)}>Save</button>
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
                <input type="text" placeholder="Enter" />
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>
                    Due Date <span>*</span>
                  </label>
                  <div className={styles.iconInput}>
                    <input type="date" />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                </div>
                <div className={styles.field}>
                  <label>
                    Time <span>*</span>
                  </label>
                  <div className={styles.iconInput}>
                    <input type="time" />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <label>
                  Note <span>*</span>
                </label>
                <textarea
                  className={styles.simpleTextarea}
                  placeholder="Enter note details..."
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
              <button className={styles.saveBtn} onClick={() => setIsTaskDrawerOpen(false)}>Save</button>
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
                <input type="text" placeholder="Enter" />
              </div>
              <div className={styles.field}>
                <label>
                  Start Date <span>*</span>
                </label>
                <div className={styles.iconInput}>
                  <input type="date" />
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                </div>
              </div>
              <div className={styles.row}>
                <div className={styles.field}>
                  <label>
                    Start Time <span>*</span>
                  </label>
                  <div className={styles.iconInput}>
                    <input type="time" />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
                <div className={styles.field}>
                  <label>
                    End Time <span>*</span>
                  </label>
                  <div className={styles.iconInput}>
                    <input type="time" />
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <label>
                  Note <span>*</span>
                </label>
                <textarea
                  className={styles.simpleTextarea}
                  placeholder="Enter meeting details..."
                ></textarea>
              </div>
            </div>
            <div className={styles.drawerFooter}>
              <button
                className={styles.cancelBtn}
                onClick={() => setIsMeetingDrawerOpen(false)}
              >
                Cancel
              </button>
              <button className={styles.saveBtn} onClick={() => setIsMeetingDrawerOpen(false)}>Save</button>
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
                <label>
                  Call Outcome <span>*</span>
                </label>
                <select
                  className={styles.formSelect}
                  value={callFormData.outcome}
                  onChange={(e) => setCallFormData({ ...callFormData, outcome: e.target.value })}
                >
                  <option value="">Choose</option>
                  <option value="Busy">Busy</option>
                  <option value="Connected">Connected</option>
                  <option value="No Answer">No Answer</option>
                  <option value="Left Message">Left Message</option>
                  <option value="Wrong Number">Wrong Number</option>
                </select>
              </div>
              <div className={styles.field}>
                <label>
                  Duration <span>*</span>
                </label>
                <div className={styles.iconInput}>
                  <select
                    className={styles.formSelect}
                    value={callFormData.duration}
                    onChange={(e) => setCallFormData({ ...callFormData, duration: e.target.value })}
                  >
                    <option value="">Choose Duration</option>
                    <option value="1 min">1 min</option>
                    <option value="2 mins">2 mins</option>
                    <option value="5 mins">5 mins</option>
                    <option value="10 mins">10 mins</option>
                    <option value="15 mins">15 mins</option>
                    <option value="30 mins">30 mins</option>
                    <option value="1 hour">1 hour</option>
                  </select>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
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
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor">
                      <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                </div>
              </div>
              <div className={styles.field}>
                <label>
                  Note <span>*</span>
                </label>
                <textarea
                  className={styles.simpleTextarea}
                  placeholder="Enter call notes..."
                  value={callFormData.note}
                  onChange={(e) => setCallFormData({ ...callFormData, note: e.target.value })}
                ></textarea>
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
              <button onClick={() => setIsEmailModalOpen(false)}>×</button>
            </div>
            <div className={styles.emailBody}>
              <div className={styles.emailRow}>
                <label>Recipients</label>
                <input type="text" />
                <div className={styles.emailActions}>
                  <span>Cc</span> <span>Bcc</span>
                </div>
              </div>
              <div className={styles.emailRow}>
                <label>Subject</label>
                <input type="text" />
              </div>
              <div className={styles.emailEditor}>
                <textarea placeholder="Body Text"></textarea>
              </div>
            </div>
            <div className={styles.emailFooter}>
              <div className={styles.footerLeft}>
                <button className={styles.sendBtn}>Send</button>
                <div className={styles.footerIcons}>
                  <span onClick={triggerFileInput}>Clip</span>
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
                <label>Deal Stage <span>*</span></label>
                <select
                  value={convertForm.dealStage}
                  onChange={(e) => setConvertForm(prev => ({ ...prev, dealStage: e.target.value }))}
                >
                  <option value="Appointment Scheduled">Appointment Scheduled</option>
                  <option value="Qualified to Buy">Qualified to Buy</option>
                  <option value="Presentation Scheduled">Presentation Scheduled</option>
                  <option value="Decision Maker Bought In">Decision Maker Bought In</option>
                  <option value="Contract Sent">Contract Sent</option>
                  <option value="Closed Won">Closed Won</option>
                  <option value="Closed Lost">Closed Lost</option>
                </select>
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
                <label>Deal Owner</label>
                <select
                  value={convertForm.dealOwner}
                  onChange={(e) => setConvertForm(prev => ({ ...prev, dealOwner: e.target.value }))}
                >
                  <option value="">Select Owner</option>
                  <option value="Jane Cooper">Jane Cooper</option>
                  <option value="Wade Warren">Wade Warren</option>
                  <option value="Brooklyn Simmons">Brooklyn Simmons</option>
                  <option value="Leslie Alexander">Leslie Alexander</option>
                  <option value="Jenny Wilson">Jenny Wilson</option>
                  <option value="Guy Hawkins">Guy Hawkins</option>
                  <option value="Robert Fox">Robert Fox</option>
                </select>
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
