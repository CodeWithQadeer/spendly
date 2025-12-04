import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const addLoan = createAsyncThunk("loan/add", async (data) => {
  await api.post("/loan/add", data);
  return true;
});

export const getLoans = createAsyncThunk("loan/getAll", async () => {
  const res = await api.get("/loan");
  return res.data;
});

export const markReturned = createAsyncThunk(
  "loan/returned",
  async (id) => {
    const res = await api.patch(`/loan/returned/${id}`);
    return res.data.balance;
  }
);

const loanSlice = createSlice({
  name: "loan",
  initialState: { list: [] },
  extraReducers: (builder) => {
    builder.addCase(getLoans.fulfilled, (state, action) => {
      state.list = action.payload;
    });
  },
});

export default loanSlice.reducer;
