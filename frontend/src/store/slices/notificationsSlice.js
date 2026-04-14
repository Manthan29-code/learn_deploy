import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  items: [],
};

const notificationsSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    addNotification: {
      reducer: (state, action) => {
        state.items.unshift(action.payload);
        if (state.items.length > 5) {
          state.items.pop();
        }
      },
      prepare: (payload) => ({
        payload: {
          id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
          createdAt: new Date().toISOString(),
          ...payload,
        },
      }),
    },
    removeNotification: (state, action) => {
      state.items = state.items.filter((item) => item.id !== action.payload);
    },
    clearNotifications: (state) => {
      state.items = [];
    },
  },
});

export const { addNotification, removeNotification, clearNotifications } = notificationsSlice.actions;
export default notificationsSlice.reducer;
