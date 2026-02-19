import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  deals: [
    {
      _id: "1",
      dealName: "Website Revamp - Atlas Corp",
      dealStage: "Negotiation",
      closeDate: "Apr 8, 2025",
      dealOwner: "Jane Cooper",
      amount: 12500,
    },
    {
      _id: "2",
      dealName: "Mobile App for FitBuddy",
      dealStage: "Proposal Sent",
      closeDate: "Apr 8, 2025",
      dealOwner: "Wade Warren",
      amount: 25000,
    },
    {
      _id: "3",
      dealName: "HR Software License - ZenoHR",
      dealStage: "Proposal Sent",
      closeDate: "Apr 8, 2025",
      dealOwner: "Brooklyn Simmons",
      amount: 18750,
    },
    {
      _id: "4",
      dealName: "CRM Onboarding - NexTech",
      dealStage: "Closed Won",
      closeDate: "Apr 8, 2025",
      dealOwner: "Leslie Alexander",
      amount: 32000,
    },
    {
      _id: "5",
      dealName: "Marketing Suite - QuickAdz",
      dealStage: "Negotiation",
      closeDate: "Apr 8, 2025",
      dealOwner: "Jenny Wilson",
      amount: 14800,
    },
    {
      _id: "6",
      dealName: "Inventory Tool - GreenMart",
      dealStage: "Negotiation",
      closeDate: "Apr 8, 2025",
      dealOwner: "Guy Hawkins",
      amount: 9300,
    },
    {
      _id: "7",
      dealName: "ERP Integration - BlueChip",
      dealStage: "Proposal Sent",
      closeDate: "Apr 8, 2025",
      dealOwner: "Robert Fox",
      amount: 41000,
    },
    {
      _id: "8",
      dealName: "Loyalty Program - FoodieFox",
      dealStage: "Closed Lost",
      closeDate: "Apr 8, 2025",
      dealOwner: "Cameron Williamson",
      amount: 11000,
    },
    {
      _id: "9",
      dealName: "Cloud Migration - Relatia",
      dealStage: "Proposal Sent",
      closeDate: "May 2, 2025",
      dealOwner: "Jane Cooper",
      amount: 55000,
    },
    {
      _id: "10",
      dealName: "Analytics Dashboard - TrustSphere",
      dealStage: "Negotiation",
      closeDate: "May 5, 2025",
      dealOwner: "Wade Warren",
      amount: 22000,
    },
    {
      _id: "11",
      dealName: "Security Audit - ClientEdge",
      dealStage: "Proposal Sent",
      closeDate: "May 10, 2025",
      dealOwner: "Brooklyn Simmons",
      amount: 17500,
    },
    {
      _id: "12",
      dealName: "E-Commerce Platform - ShopNow",
      dealStage: "Negotiation",
      closeDate: "May 15, 2025",
      dealOwner: "Leslie Alexander",
      amount: 38000,
    },
    {
      _id: "13",
      dealName: "Data Warehouse - FinCore",
      dealStage: "Closed Won",
      closeDate: "May 20, 2025",
      dealOwner: "Jenny Wilson",
      amount: 62000,
    },
    {
      _id: "14",
      dealName: "DevOps Pipeline - BuildFast",
      dealStage: "Negotiation",
      closeDate: "May 25, 2025",
      dealOwner: "Guy Hawkins",
      amount: 29500,
    },
    {
      _id: "15",
      dealName: "AI Chatbot - SupportAI",
      dealStage: "Proposal Sent",
      closeDate: "Jun 1, 2025",
      dealOwner: "Robert Fox",
      amount: 47000,
    },
  ],
  loading: false,
  error: null,
};

const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {
    setDeals: (state, action) => {
      state.deals = action.payload;
    },
    addDeal: (state, action) => {
      state.deals.push(action.payload);
    },
    updateDeal: (state, action) => {
      const index = state.deals.findIndex(
        (deal) => deal._id === action.payload._id
      );
      if (index !== -1) {
        state.deals[index] = action.payload;
      }
    },
    removeDeal: (state, action) => {
      state.deals = state.deals.filter(
        (deal) => deal._id !== action.payload
      );
    },
  },
});

export const { setDeals, addDeal, updateDeal, removeDeal } =
  dealsSlice.actions;

export default dealsSlice.reducer;
