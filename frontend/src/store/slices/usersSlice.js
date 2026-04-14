import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  users: [],
  followers: [],
  following: [],
  profileFollowersCount: 0,
  loading: false,
  error: null,
};

const getUserId = (user) => user?.id || user?._id;

export const fetchUsers = createAsyncThunk("users/fetchUsers", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/users");
    return response.data.data.users;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const followUser = createAsyncThunk("users/follow", async (userId, { rejectWithValue }) => {
  try {
    await api.post(`/follows/${userId}`);
    return userId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const unfollowUser = createAsyncThunk("users/unfollow", async (userId, { rejectWithValue }) => {
  try {
    await api.delete(`/follows/${userId}`);
    return userId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const fetchFollowers = createAsyncThunk("users/fetchFollowers", async (userId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/follows/${userId}/followers`);
    return response.data.data.followers;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const fetchFollowing = createAsyncThunk("users/fetchFollowing", async (userId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/follows/${userId}/following`);
    return response.data.data.following;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

const usersSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    applyFollowAlert: (state, action) => {
      const { action: followAction, actor, actorId } = action.payload;
      const resolvedActorId = actorId || getUserId(actor);

      if (!resolvedActorId) {
        return;
      }

      if (followAction === "followed") {
        const exists = state.followers.some((item) => getUserId(item) === resolvedActorId);
        if (!exists && actor) {
          state.followers.unshift(actor);
        }
      }

      if (followAction === "unfollowed") {
        state.followers = state.followers.filter((item) => getUserId(item) !== resolvedActorId);
      }
    },
    applyProfileFollowersCountUpdate: (state, action) => {
      const { followersCount, delta = 0 } = action.payload;

      if (typeof followersCount === "number") {
        state.profileFollowersCount = followersCount;
        return;
      }

      state.profileFollowersCount = Math.max(0, (state.profileFollowersCount || 0) + delta);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchFollowers.fulfilled, (state, action) => {
        state.followers = action.payload;
        state.profileFollowersCount = action.payload.length;
      })
      .addCase(fetchFollowing.fulfilled, (state, action) => {
        state.following = action.payload;
      });
  },
});

export const { applyFollowAlert, applyProfileFollowersCountUpdate } = usersSlice.actions;
export default usersSlice.reducer;
