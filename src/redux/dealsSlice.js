import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/axiosInstance";

//  FETCH
export const fetchDeals = createAsyncThunk(
  "deals/fetchDeals",
  async () => {
    console.log("Calling Fetch Deals API...");
    const { data } = await axios.get("/deals");
    console.log("Fetch Deals API Response:", data);
    // Handle both cases: { data: [...] } and directly returning the array
    return Array.isArray(data) ? data : data.data || [];
  }
);

// CREATE
export const addDeal = createAsyncThunk(
  "deals/addDeal",
  async (dealData) => {
    const { data } = await axios.post("/deals", dealData);
    return data.data;
  }
);

// BULK CREATE
export const bulkAddDeals = createAsyncThunk(
  "deals/bulkAddDeals",
  async (dealsData) => {
    const { data } = await axios.post("/deals/bulk-create", dealsData);
    return data.data;
  }
);

// UPDATE
export const updateDeal = createAsyncThunk(
  "deals/updateDeal",
  async (dealData) => {
    const { data } = await axios.put(`/deals/${dealData._id}`, dealData);
    return data.data;
  }
);

// DELETE
export const removeDeal = createAsyncThunk(
  "deals/removeDeal",
  async (id) => {
    await axios.delete(`/deals/${id}`);
    return id;
  }
);

// BULK DELETE
export const bulkDeleteDeals = createAsyncThunk(
  "deals/bulkDeleteDeals",
  async (ids) => {
    await axios.post("/deals/bulk-delete", { ids });
    return ids;
  }
);

const initialState = {
  deals: [],
  loading: false,
  error: null,
};

const dealsSlice = createSlice({
  name: "deals",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchDeals.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDeals.fulfilled, (state, action) => {
        state.loading = false;
        state.deals = action.payload;
      })
      .addCase(fetchDeals.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      // CREATE
      .addCase(addDeal.fulfilled, (state, action) => {
        state.deals.unshift(action.payload);
      })
      // BULK CREATE
      .addCase(bulkAddDeals.fulfilled, (state, action) => {
        state.deals.unshift(...action.payload);
      })
      // UPDATE
      .addCase(updateDeal.fulfilled, (state, action) => {
        const index = state.deals.findIndex((d) => d._id === action.payload._id);
        if (index !== -1) {
          state.deals[index] = action.payload;
        }
      })
      // DELETE
      .addCase(removeDeal.fulfilled, (state, action) => {
        state.deals = state.deals.filter((d) => d._id !== action.payload);
      })
      // BULK DELETE
      .addCase(bulkDeleteDeals.fulfilled, (state, action) => {
        state.deals = state.deals.filter((d) => !action.payload.includes(d._id));
      });
  },
});

export default dealsSlice.reducer;
