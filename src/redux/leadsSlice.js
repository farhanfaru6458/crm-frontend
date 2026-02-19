import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  leads: [
    {
      _id: "1",
      name: "Maria Johnson",
      email: "maria.j@clientedge.com",
      phone: "+1 234 567 890",
      createdDate: "04/08/2025",
      status: "New",
      owner: "Jane Cooper",
    },
    {
      _id: "2",
      name: "Michael Chen",
      email: "m.chen@techsolutions.io",
      phone: "+1 987 654 321",
      createdDate: "05/08/2025",
      status: "Contacted",
      owner: "Wade Warren",
    },
    {
      _id: "3",
      name: "Sarah Williams",
      email: "sarah.w@trustsphere.com",
      phone: "+1 555 123 456",
      createdDate: "06/08/2025",
      status: "Qualified",
      owner: "Brooklyn Simmons",
    },
    {
      _id: "4",
      name: "James Patel",
      email: "james.p@nextech.io",
      phone: "+1 312 456 789",
      createdDate: "07/08/2025",
      status: "New",
      owner: "Leslie Alexander",
    },
    {
      _id: "5",
      name: "Emily Rodriguez",
      email: "emily.r@quickadz.com",
      phone: "+1 415 789 012",
      createdDate: "08/08/2025",
      status: "Contacted",
      owner: "Jenny Wilson",
    },
    {
      _id: "6",
      name: "David Kim",
      email: "d.kim@greenmart.co",
      phone: "+1 646 234 567",
      createdDate: "09/08/2025",
      status: "Qualified",
      owner: "Guy Hawkins",
    },
    {
      _id: "7",
      name: "Olivia Thompson",
      email: "olivia.t@bluechip.net",
      phone: "+1 718 345 678",
      createdDate: "10/08/2025",
      status: "New",
      owner: "Robert Fox",
    },
    {
      _id: "8",
      name: "Liam Anderson",
      email: "liam.a@foodiefox.com",
      phone: "+1 213 567 890",
      createdDate: "11/08/2025",
      status: "Contacted",
      owner: "Cameron Williamson",
    },
    {
      _id: "9",
      name: "Sophia Martinez",
      email: "sophia.m@relatia.io",
      phone: "+1 512 678 901",
      createdDate: "12/08/2025",
      status: "Qualified",
      owner: "Jane Cooper",
    },
    {
      _id: "10",
      name: "Noah Wilson",
      email: "noah.w@atlas-corp.com",
      phone: "+1 303 789 012",
      createdDate: "13/08/2025",
      status: "New",
      owner: "Wade Warren",
    },
    {
      _id: "11",
      name: "Ava Brown",
      email: "ava.b@fitbuddy.app",
      phone: "+1 404 890 123",
      createdDate: "14/08/2025",
      status: "Contacted",
      owner: "Brooklyn Simmons",
    },
    {
      _id: "12",
      name: "Ethan Davis",
      email: "ethan.d@zenohr.com",
      phone: "+1 602 901 234",
      createdDate: "15/08/2025",
      status: "Qualified",
      owner: "Leslie Alexander",
    },
    {
      _id: "13",
      name: "Isabella Garcia",
      email: "isabella.g@clientedge.com",
      phone: "+1 702 012 345",
      createdDate: "16/08/2025",
      status: "New",
      owner: "Jenny Wilson",
    },
    {
      _id: "14",
      name: "Mason Lee",
      email: "mason.l@trustsphere.com",
      phone: "+1 801 123 456",
      createdDate: "17/08/2025",
      status: "Contacted",
      owner: "Guy Hawkins",
    },
    {
      _id: "15",
      name: "Charlotte Harris",
      email: "charlotte.h@techsolutions.io",
      phone: "+1 901 234 567",
      createdDate: "18/08/2025",
      status: "Qualified",
      owner: "Robert Fox",
    },
  ],
  loading: false,
  error: null,
};

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {
    setLeads: (state, action) => {
      state.leads = action.payload;
    },
    addLead: (state, action) => {
      state.leads.push(action.payload);
    },
    removeLead: (state, action) => {
      state.leads = state.leads.filter(
        (lead) => lead._id !== action.payload
      );
    },
    updateLead: (state, action) => {
      const index = state.leads.findIndex((l) => l._id === action.payload._id);
      if (index !== -1) {
        state.leads[index] = action.payload;
      }
    },
  },
});

export const { setLeads, addLead, removeLead, updateLead } = leadsSlice.actions;

export default leadsSlice.reducer;
