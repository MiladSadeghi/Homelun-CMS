import { configureStore } from "@reduxjs/toolkit";
import userSlice from "./user/userSlice";
import userListSlice from "./lists/userListSlice";
import propertiesListSlice from "./lists/propertyListSlice";
import agentListSlice from "./lists/agentListSlice";

export const store = configureStore({
  reducer: { userSlice, userListSlice, propertiesListSlice, agentListSlice },
  devTools: import.meta.env.VITE_NODE_ENV !== "production",
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
