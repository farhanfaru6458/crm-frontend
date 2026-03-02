import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/axiosInstance";

// 🔥 FETCH
export const fetchTickets = createAsyncThunk(
  "tickets/fetchTickets",
  async () => {
    const { data } = await axios.get("/tickets");
    return Array.isArray(data) ? data : data.data || [];
  }
);

// 🔥 CREATE
export const addTicket = createAsyncThunk(
  "tickets/addTicket",
  async (ticketData) => {
    const { data } = await axios.post("/tickets", ticketData);
    return data;
  }
);

// 🔥 BULK CREATE
export const bulkAddTickets = createAsyncThunk(
  "tickets/bulkAddTickets",
  async (ticketsData) => {
    const { data } = await axios.post("/tickets/bulk-create", ticketsData);
    return data.data;
  }
);

// 🔥 UPDATE
export const updateTicket = createAsyncThunk(
  "tickets/updateTicket",
  async (ticketData) => {
    const { data } = await axios.put(`/tickets/${ticketData._id}`, ticketData);
    return data;
  }
);

// 🔥 DELETE
export const removeTicket = createAsyncThunk(
  "tickets/removeTicket",
  async (id) => {
    await axios.delete(`/tickets/${id}`);
    return id;
  }
);

// 🔥 BULK DELETE
export const bulkDeleteTickets = createAsyncThunk(
  "tickets/bulkDeleteTickets",
  async (ids) => {
    await axios.post("/tickets/bulk-delete", { ids });
    return ids;
  }
);

const initialState = {
  tickets: [],
  loading: false,
  error: null,
};

const ticketsSlice = createSlice({
  name: "tickets",
  initialState,
  reducers: {
    // Legacy support if needed
    setTickets: (state, action) => {
      state.tickets = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchTickets.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTickets.fulfilled, (state, action) => {
        state.loading = false;
        state.tickets = action.payload;
      })
      .addCase(fetchTickets.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // CREATE
      .addCase(addTicket.fulfilled, (state, action) => {
        state.tickets.unshift(action.payload);
      })
      // BULK CREATE
      .addCase(bulkAddTickets.fulfilled, (state, action) => {
        state.tickets.unshift(...action.payload);
      })
      // UPDATE
      .addCase(updateTicket.fulfilled, (state, action) => {
        const index = state.tickets.findIndex((t) => t._id === action.payload._id);
        if (index !== -1) {
          state.tickets[index] = action.payload;
        }
      })
      // DELETE
      .addCase(removeTicket.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter((t) => t._id !== action.payload);
      })
      // BULK DELETE
      .addCase(bulkDeleteTickets.fulfilled, (state, action) => {
        state.tickets = state.tickets.filter((t) => !action.payload.includes(t._id));
      });
  },
});

export const { setTickets } = ticketsSlice.actions;
export default ticketsSlice.reducer;
