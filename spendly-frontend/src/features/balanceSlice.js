// src/features/balanceSlice.js
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";
import {
  fetchTransactions,
  deleteTransaction,
  applyRecurring,
} from "./transactionSlice";

/**
 * Fetch current balance & user info
 * Backend: GET /auth/me  -> { balance, user }
 */
export const fetchBalance = createAsyncThunk(
  "balance/fetch",
  async (_, thunkAPI) => {
    const attempt = async () => {
      const res = await api.get("/auth/me");
      return res.data.balance;
    };

    try {
      return await attempt();
    } catch (err) {
      if (!err.response) {
        try {
          return await attempt();
        } catch (err2) {
          return thunkAPI.rejectWithValue(
            err2?.response?.data?.message || "Failed to load balance"
          );
        }
      }
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to load balance"
      );
    }
  }
);

/**
 * Set initial balance (used once)
 * Backend: POST /balance/initial -> { balance }
 */
export const setInitialBalance = createAsyncThunk(
  "balance/setInitial",
  async (amount, thunkAPI) => {
    const res = await api.post("/balance/initial", { amount });
    // update transactions if needed (not necessary here)
    return res.data.balance;
  }
);

/**
 * Add money (creates income transaction on backend)
 * Backend: POST /balance/add -> { transaction, balance }
 * After success we also refresh transactions list so UI updates.
 */
export const addMoney = createAsyncThunk(
  "balance/addMoney",
  async (payload, thunkAPI) => {
    // payload: { amount, category?, note? }
    const res = await api.post("/balance/add", payload);
    // if backend returned a transaction, refresh transactions
    if (res.data && res.data.transaction) {
      thunkAPI.dispatch(fetchTransactions());
    }
    return res.data.balance;
  }
);

const balanceSlice = createSlice({
  name: "balance",
  initialState: { currentBalance: 0, loading: false, error: null },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // fetchBalance
      .addCase(fetchBalance.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBalance.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBalance = action.payload ?? 0;
      })
      .addCase(fetchBalance.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to load balance";
      })

      // setInitialBalance
      .addCase(setInitialBalance.fulfilled, (state, action) => {
        state.currentBalance = action.payload ?? state.currentBalance;
      })

      // addMoney
      .addCase(addMoney.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(addMoney.fulfilled, (state, action) => {
        state.loading = false;
        state.currentBalance = action.payload ?? state.currentBalance;
      })
      .addCase(addMoney.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error?.message || "Failed to add money";
      })

      // sync after deleteTransaction/applyRecurring
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        if (action.payload && action.payload.balance != null) {
          state.currentBalance = action.payload.balance;
        }
      })
      .addCase(applyRecurring.fulfilled, (state, action) => {
        if (action.payload && action.payload.balance != null) {
          state.currentBalance = action.payload.balance;
        }
      });
  },
});

export default balanceSlice.reducer;
