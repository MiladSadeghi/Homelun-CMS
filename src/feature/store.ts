import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlicer";

export const store = configureStore({
  reducer: { userSlice },
  devTools: import.meta.env.NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
