import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api, { tokenStorage } from "../../services/api";

const initialState = {
  user: null,
  token: tokenStorage.get(),
  loading: false,
  error: null,
  profileUpdating: false,
  profileUpdateError: null,
};

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (payload, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", payload);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(error.response?.data?.error?.message || error.message);
    }
  }
);

export const loginUser = createAsyncThunk("auth/loginUser", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/auth/login", payload);
    return response.data.data;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const fetchMe = createAsyncThunk("auth/fetchMe", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/auth/me");
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue({
      message: error.response?.data?.error?.message || error.message,
      status: error.response?.status || null,
    });
  }
});

export const updateBio = createAsyncThunk("auth/updateBio", async (bio, { rejectWithValue }) => {
  try {
    const response = await api.patch("/users/me", { bio });
    return response.data.data.user;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.error = null;
      tokenStorage.clear();
    },
    clearAuthError: (state) => {
      state.error = null;
    },
    clearProfileUpdateError: (state) => {
      state.profileUpdateError = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        tokenStorage.set(action.payload.token);
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
        tokenStorage.set(action.payload.token);
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMe.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchMe.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(fetchMe.rejected, (state, action) => {
        state.loading = false;
        state.user = null;

        const isUnauthorized = action.payload?.status === 401;
        if (isUnauthorized) {
          state.token = null;
          tokenStorage.clear();
        }
      })
      .addCase(updateBio.pending, (state) => {
        state.profileUpdating = true;
        state.profileUpdateError = null;
      })
      .addCase(updateBio.fulfilled, (state, action) => {
        state.profileUpdating = false;
        state.user = action.payload;
      })
      .addCase(updateBio.rejected, (state, action) => {
        state.profileUpdating = false;
        state.profileUpdateError = action.payload;
      });
  },
});

export const { logout, clearAuthError, clearProfileUpdateError } = authSlice.actions;
export default authSlice.reducer;
