import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import notesReducer from "./slices/notesSlice";
import usersReducer from "./slices/usersSlice";
import notificationsReducer from "./slices/notificationsSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    users: usersReducer,
    notifications: notificationsReducer,
  },
});

export default store;
