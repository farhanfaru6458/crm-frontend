import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "../services/axiosInstance";

//  FETCH
export const fetchCompanies = createAsyncThunk(
  "companies/fetchCompanies",
  async () => {
    const { data } = await axios.get("/companies");
    return data.data;
  }
);

//  CREATE
export const addCompany = createAsyncThunk(
  "companies/addCompany",
  async (companyData) => {
    const { data } = await axios.post("/companies", companyData);
    return data.data;
  }
);

//  BULK CREATE
export const bulkAddCompanies = createAsyncThunk(
  "companies/bulkAddCompanies",
  async (companiesData) => {
    const { data } = await axios.post("/companies/bulk-create", companiesData);
    return data.data;
  }
);

//  UPDATE
export const updateCompany = createAsyncThunk(
  "companies/updateCompany",
  async (companyData) => {
    const { data } = await axios.put(
      `/companies/${companyData._id}`,
      companyData
    );
    return data.data;
  }
);

// DELETE
export const removeCompany = createAsyncThunk(
  "companies/removeCompany",
  async (id) => {
    await axios.delete(`/companies/${id}`);
    return id;
  }
);

// BULK DELETE
export const bulkDeleteCompanies = createAsyncThunk(
  "companies/bulkDeleteCompanies",
  async (ids) => {
    await axios.post("/companies/bulk-delete", { ids });
    return ids;
  }
);

const companiesSlice = createSlice({
  name: "companies",
  initialState: {
    companies: [],
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // FETCH
      .addCase(fetchCompanies.fulfilled, (state, action) => {
        state.companies = action.payload;
      })

      // CREATE
      .addCase(addCompany.fulfilled, (state, action) => {
        state.companies.unshift(action.payload);
      })
      // BULK CREATE
      .addCase(bulkAddCompanies.fulfilled, (state, action) => {
        state.companies.unshift(...action.payload);
      })
      // UPDATE
      .addCase(updateCompany.fulfilled, (state, action) => {
        const index = state.companies.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.companies[index] = action.payload;
        }
      })

      // DELETE
      .addCase(removeCompany.fulfilled, (state, action) => {
        state.companies = state.companies.filter(
          (c) => c._id !== action.payload
        );
      })
      // BULK DELETE
      .addCase(bulkDeleteCompanies.fulfilled, (state, action) => {
        state.companies = state.companies.filter(
          (c) => !action.payload.includes(c._id)
        );
      });
  },
});

export default companiesSlice.reducer;