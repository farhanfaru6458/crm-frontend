import { configureStore } from "@reduxjs/toolkit";

// Auth
import authReducer from "./authSlice";

// // Leads
import leadsReducer from "./leadsSlice";

// Deals
import dealsReducer from "./dealsSlice";

// Companies
import companiesReducer from "./companiesSlice";

// Tickets
import ticketsReducer from "./ticketsSlice";

// Global Search
import searchReducer from "./searchSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    leads: leadsReducer,
    deals: dealsReducer,
    companies: companiesReducer,
    tickets: ticketsReducer,
    search: searchReducer,
  },
  devTools: process.env.NODE_ENV !== "production",
});

export default store;
