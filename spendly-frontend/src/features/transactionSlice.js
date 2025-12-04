import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

// ADD EXPENSE (returns { transaction, balance })
export const addExpense = createAsyncThunk(
  "transactions/add",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/transactions/add", data);
      // after adding expense, refresh transactions list (or rely on returned transaction)
      // also return the transaction for immediate UI insertion
      return res.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Failed to add expense. Please try again.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

// FETCH ACTIVE TRANSACTIONS
export const fetchTransactions = createAsyncThunk(
  "transactions/all",
  async (_, thunkAPI) => {
    const attempt = async () => {
      const res = await api.get("/transactions");
      return res.data;
    };

    try {
      return await attempt();
    } catch (err) {
      // simple one-time retry for network errors
      if (!err.response) {
        try {
          return await attempt();
        } catch (err2) {
          return thunkAPI.rejectWithValue(
            err2?.response?.data?.message || "Failed to load transactions"
          );
        }
      }
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to load transactions"
      );
    }
  }
);

// FETCH HISTORY
export const fetchHistory = createAsyncThunk("transactions/history", async () => {
  const res = await api.get("/transactions/history");
  return res.data;
});

// CLEAR ALL (move to history)
export const clearAllTransactions = createAsyncThunk("transactions/clear", async () => {
  const res = await api.delete("/transactions/clear");
  return res.data;
});

// RESET EVERYTHING
export const resetAll = createAsyncThunk("transactions/reset", async () => {
  const res = await api.delete("/transactions/reset");
  return res.data;
});

// DELETE SINGLE TRANSACTION
export const deleteTransaction = createAsyncThunk(
  "transactions/delete",
  async (id, thunkAPI) => {
    const res = await api.delete(`/transactions/${id}`);
    return { id, balance: res.data.balance };
  }
);

// UPDATE SINGLE TRANSACTION (note/category/isRecurring)
export const updateTransaction = createAsyncThunk(
  "transactions/update",
  async ({ id, updates }, thunkAPI) => {
    const res = await api.patch(`/transactions/${id}`, updates);
    return res.data;
  }
);

// APPLY RECURRING TRANSACTIONS
export const applyRecurring = createAsyncThunk(
  "transactions/applyRecurring",
  async (_, thunkAPI) => {
    const res = await api.post("/transactions/recurring/apply");
    return res.data;
  }
);

const transactionSlice = createSlice({
  name: "transactions",
  initialState: {
    list: [],
    history: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // load current
      .addCase(fetchTransactions.fulfilled, (state, action) => {
        state.list = action.payload;
      })

      // load history
      .addCase(fetchHistory.fulfilled, (state, action) => {
        state.history = action.payload;
      })

      // when expense added, payload is { transaction, balance }
      .addCase(addExpense.fulfilled, (state, action) => {
        const { transaction } = action.payload;
        if (transaction) state.list.unshift(transaction);
      })

      // when cleared -> empty list (history will be loaded separately)
      .addCase(clearAllTransactions.fulfilled, (state) => {
        state.list = [];
      })

      // when reset -> clear both
      .addCase(resetAll.fulfilled, (state) => {
        state.list = [];
        state.history = [];
      })

      // deleteTransaction
      .addCase(deleteTransaction.fulfilled, (state, action) => {
        state.list = state.list.filter((t) => t._id !== action.payload.id);
      })

      // updateTransaction
      .addCase(updateTransaction.fulfilled, (state, action) => {
        const updated = action.payload;
        const idx = state.list.findIndex((t) => t._id === updated._id);
        if (idx !== -1) state.list[idx] = updated;
      })

      // applyRecurring
      .addCase(applyRecurring.fulfilled, (state, action) => {
        const { transactions } = action.payload || {};
        if (Array.isArray(transactions)) {
          // prepend newest recurring instances
          state.list = [...transactions, ...state.list];
        }
      });
  },
});

export default transactionSlice.reducer;
