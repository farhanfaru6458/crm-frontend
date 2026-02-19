import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  tickets: [
    {
      _id: "1",
      name: "Payment Failure Issue",
      status: "Waiting on contact",
      priority: "High",
      source: "Chat",
      owner: "Jane Cooper",
      createdAt: "Apr 8, 2025 2:35 PM",
    },
    {
      _id: "2",
      name: "Product Inquiry",
      status: "Waiting on us",
      priority: "Medium",
      source: "Email",
      owner: "Wade Warren",
      createdAt: "Apr 8, 2025 2:35 PM",
    },
    {
      _id: "3",
      name: "Subscription Upgrade",
      status: "New",
      priority: "High",
      source: "Chat",
      owner: "Brooklyn Simmons",
      createdAt: "Apr 8, 2025 2:35 PM",
    },
    {
      _id: "4",
      name: "Refund Request - Order #456",
      status: "New",
      priority: "Low",
      source: "Phone",
      owner: "Leslie Alexander",
      createdAt: "Apr 8, 2025 2:35 PM",
    },
    {
      _id: "5",
      name: "Login Not Working",
      status: "Waiting on us",
      priority: "Critical",
      source: "Phone",
      owner: "Guy Hawkins",
      createdAt: "Apr 8, 2025 2:35 PM",
    },
    {
      _id: "6",
      name: "SLA Violation Complaint",
      status: "Closed",
      priority: "Medium",
      source: "Chat",
      owner: "Cameron Williamson",
      createdAt: "Apr 8, 2025 2:35 PM",
    },
    {
      _id: "7",
      name: "Data Export Failure",
      status: "New",
      priority: "High",
      source: "Email",
      owner: "Jane Cooper",
      createdAt: "Apr 9, 2025 10:00 AM",
    },
    {
      _id: "8",
      name: "Invoice Not Generated",
      status: "Waiting on us",
      priority: "Medium",
      source: "Phone",
      owner: "Wade Warren",
      createdAt: "Apr 9, 2025 11:30 AM",
    },
    {
      _id: "9",
      name: "API Integration Error",
      status: "New",
      priority: "Critical",
      source: "Chat",
      owner: "Brooklyn Simmons",
      createdAt: "Apr 10, 2025 9:15 AM",
    },
    {
      _id: "10",
      name: "Password Reset Not Working",
      status: "Waiting on contact",
      priority: "High",
      source: "Email",
      owner: "Leslie Alexander",
      createdAt: "Apr 10, 2025 2:00 PM",
    },
    {
      _id: "11",
      name: "Dashboard Loading Slow",
      status: "Closed",
      priority: "Low",
      source: "Chat",
      owner: "Guy Hawkins",
      createdAt: "Apr 11, 2025 8:45 AM",
    },
    {
      _id: "12",
      name: "Email Notification Delay",
      status: "New",
      priority: "Medium",
      source: "Email",
      owner: "Cameron Williamson",
      createdAt: "Apr 11, 2025 3:30 PM",
    },
    {
      _id: "13",
      name: "Report Download Error",
      status: "Waiting on us",
      priority: "High",
      source: "Phone",
      owner: "Jane Cooper",
      createdAt: "Apr 12, 2025 10:00 AM",
    },
    {
      _id: "14",
      name: "User Permission Issue",
      status: "New",
      priority: "Critical",
      source: "Chat",
      owner: "Wade Warren",
      createdAt: "Apr 12, 2025 1:15 PM",
    },
    {
      _id: "15",
      name: "Billing Discrepancy",
      status: "Waiting on contact",
      priority: "Medium",
      source: "Email",
      owner: "Brooklyn Simmons",
      createdAt: "Apr 13, 2025 9:00 AM",
    },
  ],
  loading: false,
  error: null,
};

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
    addTicket: (state, action) => {
      state.tickets.push(action.payload);
    },
    updateTicket: (state, action) => {
      const index = state.tickets.findIndex(
        (ticket) => ticket._id === action.payload._id
      );
      if (index !== -1) {
        state.tickets[index] = action.payload;
      }
    },
    removeTicket: (state, action) => {
      state.tickets = state.tickets.filter(
        (ticket) => ticket._id !== action.payload
      );
    },
  },
});

export const {
  setTickets,
  addTicket,
  updateTicket,
  removeTicket,
} = ticketsSlice.actions;

export default ticketsSlice.reducer;
