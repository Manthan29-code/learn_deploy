import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import notesReducer from "./slices/notesSlice";
import usersReducer from "./slices/usersSlice";

const store = configureStore({
  reducer: {
    auth: authReducer,
    notes: notesReducer,
    users: usersReducer,
  },
});

export default store;
