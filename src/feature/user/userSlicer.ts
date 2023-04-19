import { createSlice } from "@reduxjs/toolkit";

type TUser = {
  isAuthenticated: boolean;
  accessToken: string | null;
  name: string | null;
  role: "super_admin" | "admin" | "agent" | null;
};

const initialState: TUser = {
  isAuthenticated: false,
  accessToken: null,
  name: null,
  role: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedIn: (state, { payload }: { payload: TUser }) => {
      state.isAuthenticated = payload.isAuthenticated;
      state.accessToken = payload.accessToken;
      state.name = payload.name;
      state.role = payload.role;
    },
    setToken: (state, { payload }) => {
      state.accessToken = payload;
    },
    userLoggedOut: (state) => {
      state = initialState;
    },
  },
});

export const { userLoggedIn, setToken, userLoggedOut } = userSlice.actions;
export default userSlice.reducer;
