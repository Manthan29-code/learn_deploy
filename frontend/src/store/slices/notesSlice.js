import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../../services/api";

const initialState = {
  myNotes: [],
  discoverNotes: [],
  feedNotes: [],
  likedByMe: {},
  loading: false,
  submitLoading: false,
  error: null,
};

export const fetchDiscoverNotes = createAsyncThunk("notes/fetchDiscover", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/feed/discover");
    return response.data.data.notes;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const fetchMyFeed = createAsyncThunk("notes/fetchMyFeed", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/feed/me");
    return response.data.data.notes;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const fetchMyNotes = createAsyncThunk("notes/fetchMyNotes", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/notes/mine");
    return response.data.data.notes;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const createNote = createAsyncThunk("notes/create", async (payload, { rejectWithValue }) => {
  try {
    const response = await api.post("/notes", payload);
    return response.data.data.note;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const updateNote = createAsyncThunk("notes/update", async ({ noteId, payload }, { rejectWithValue }) => {
  try {
    const response = await api.patch(`/notes/${noteId}`, payload);
    return response.data.data.note;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const deleteNote = createAsyncThunk("notes/delete", async (noteId, { rejectWithValue }) => {
  try {
    await api.delete(`/notes/${noteId}`);
    return noteId;
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const likeNote = createAsyncThunk("notes/like", async (noteId, { rejectWithValue }) => {
  try {
    const response = await api.post(`/reactions/${noteId}/like`);
    return { noteId, likesCount: response.data.data.likesCount };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

export const unlikeNote = createAsyncThunk("notes/unlike", async (noteId, { rejectWithValue }) => {
  try {
    const response = await api.delete(`/reactions/${noteId}/like`);
    return { noteId, likesCount: response.data.data.likesCount };
  } catch (error) {
    return rejectWithValue(error.response?.data?.error?.message || error.message);
  }
});

const updateNoteList = (list, noteId, likesCount) => {
  return list.map((item) => (item._id === noteId ? { ...item, likesCount } : item));
};

const notesSlice = createSlice({
  name: "notes",
  initialState,
  reducers: {
    clearNotesError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchDiscoverNotes.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDiscoverNotes.fulfilled, (state, action) => {
        state.loading = false;
        state.discoverNotes = action.payload;
      })
      .addCase(fetchDiscoverNotes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(fetchMyFeed.fulfilled, (state, action) => {
        state.feedNotes = action.payload;
      })
      .addCase(fetchMyNotes.fulfilled, (state, action) => {
        state.myNotes = action.payload;
      })
      .addCase(createNote.pending, (state) => {
        state.submitLoading = true;
        state.error = null;
      })
      .addCase(createNote.fulfilled, (state, action) => {
        state.submitLoading = false;
        state.myNotes.unshift(action.payload);
        state.feedNotes.unshift(action.payload);
      })
      .addCase(createNote.rejected, (state, action) => {
        state.submitLoading = false;
        state.error = action.payload;
      })
      .addCase(updateNote.fulfilled, (state, action) => {
        const replace = (list) => list.map((item) => (item._id === action.payload._id ? action.payload : item));
        state.myNotes = replace(state.myNotes);
        state.feedNotes = replace(state.feedNotes);
        state.discoverNotes = replace(state.discoverNotes);
      })
      .addCase(deleteNote.fulfilled, (state, action) => {
        const remove = (list) => list.filter((item) => item._id !== action.payload);
        state.myNotes = remove(state.myNotes);
        state.feedNotes = remove(state.feedNotes);
        state.discoverNotes = remove(state.discoverNotes);
      })
      .addCase(likeNote.fulfilled, (state, action) => {
        const { noteId, likesCount } = action.payload;
        state.likedByMe[noteId] = true;
        state.myNotes = updateNoteList(state.myNotes, noteId, likesCount);
        state.feedNotes = updateNoteList(state.feedNotes, noteId, likesCount);
        state.discoverNotes = updateNoteList(state.discoverNotes, noteId, likesCount);
      })
      .addCase(unlikeNote.fulfilled, (state, action) => {
        const { noteId, likesCount } = action.payload;
        state.likedByMe[noteId] = false;
        state.myNotes = updateNoteList(state.myNotes, noteId, likesCount);
        state.feedNotes = updateNoteList(state.feedNotes, noteId, likesCount);
        state.discoverNotes = updateNoteList(state.discoverNotes, noteId, likesCount);
      });
  },
});

export const { clearNotesError } = notesSlice.actions;
export default notesSlice.reducer;
