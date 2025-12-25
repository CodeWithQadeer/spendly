import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../services/api";

export const loginUser = createAsyncThunk(
  "auth/login",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/auth/login", data);
      localStorage.setItem("auth-token", res.data.token);
      return res.data.user;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Invalid email or password";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/register",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/auth/register", data);
      return res.data;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Registration failed. Please try again.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const googleLogin = createAsyncThunk(
  "auth/google",
  async (token, thunkAPI) => {
    try {
      const res = await api.post("/auth/google", { token });
      localStorage.setItem("auth-token", res.data.token);
      return res.data.user;
    } catch (err) {
      const message =
        err?.response?.data?.message || "Google login failed. Please try again.";
      return thunkAPI.rejectWithValue(message);
    }
  }
);

export const loadUserFromToken = createAsyncThunk(
  "auth/loadUserFromToken",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/auth/me");
      return res.data.user;
    } catch (err) {
      // If token is invalid, clear it so app doesn't get stuck
      localStorage.removeItem("auth-token");
      return thunkAPI.rejectWithValue(
        err?.response?.data?.message || "Failed to load user"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    loading: false,
    error: null,
  },
  reducers: {
    logout: (state) => {
      state.user = null;
      state.loading = false;
      state.error = null;
      localStorage.removeItem("auth-token");
    },
  },
  extraReducers: (builder) => {
    builder
      // email/password login
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Login failed";
      })

      // google login
      .addCase(googleLogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(googleLogin.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(googleLogin.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Google login failed";
      })

      // load user on refresh using existing token
      .addCase(loadUserFromToken.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loadUserFromToken.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(loadUserFromToken.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.error = action.payload || "Failed to restore session";
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
