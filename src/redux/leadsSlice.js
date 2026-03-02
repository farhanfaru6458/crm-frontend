import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/axiosInstance";

// 🔥 FETCH
export const fetchLeads = createAsyncThunk(
  "leads/fetchLeads",
  async () => {
    console.log("Calling Fetch Leads API...");
    const { data } = await axios.get("/leads");
    console.log("Fetch Leads API Response:", data);
    // Handle both cases: { data: [...] } and directly returning the array
    return Array.isArray(data) ? data : data.data || [];
  }
);

// 🔥 CREATE
export const addLead = createAsyncThunk(
  "leads/addLead",
  async (leadData) => {
    const { data } = await axios.post("/leads", leadData);
    return data.data;
  }
);

// 🔥 BULK CREATE
export const bulkAddLeads = createAsyncThunk(
  "leads/bulkAddLeads",
  async (leadsData) => {
    const { data } = await axios.post("/leads/bulk-create", leadsData);
    return data.data;
  }
);

// 🔥 UPDATE
export const updateLead = createAsyncThunk(
  "leads/updateLead",
  async (leadData) => {
    const { data } = await axios.put(`/leads/${leadData._id}`, leadData);
    return data.data;
  }
);

// 🔥 DELETE
export const removeLead = createAsyncThunk(
  "leads/removeLead",
  async (id) => {
    await axios.delete(`/leads/${id}`);
    return id;
  }
);

// 🔥 BULK DELETE
export const bulkDeleteLeads = createAsyncThunk(
  "leads/bulkDeleteLeads",
  async (ids) => {
    await axios.post("/leads/bulk-delete", { ids });
    return ids;
  }
);

const initialState = {
  leads: [],
  loading: false,
  error: null,
};

const leadsSlice = createSlice({
  name: "leads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // CREATE
      .addCase(addLead.fulfilled, (state, action) => {
        state.leads.unshift(action.payload);
      })
      // BULK CREATE
      .addCase(bulkAddLeads.fulfilled, (state, action) => {
        state.leads.unshift(...action.payload);
      })
      // UPDATE
      .addCase(updateLead.fulfilled, (state, action) => {
        const index = state.leads.findIndex((l) => l._id === action.payload._id);
        if (index !== -1) {
          state.leads[index] = action.payload;
        }
      })
      // DELETE
      .addCase(removeLead.fulfilled, (state, action) => {
        state.leads = state.leads.filter((l) => l._id !== action.payload);
      })
      // BULK DELETE
      .addCase(bulkDeleteLeads.fulfilled, (state, action) => {
        state.leads = state.leads.filter((l) => !action.payload.includes(l._id));
      });
  },
});

export default leadsSlice.reducer;
