import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/authSlice";
import balanceReducer from "../features/balanceSlice";
import transactionReducer from "../features/transactionSlice";
import loanReducer from "../features/loanSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    balance: balanceReducer,
    transactions: transactionReducer,
    loan: loanReducer,
  },
});
