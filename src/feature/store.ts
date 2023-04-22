import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import userListSlice from "./lists/userListSlice";

export const store = configureStore({
  reducer: { userSlice, userListSlice },
  devTools: import.meta.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
