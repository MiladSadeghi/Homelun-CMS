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
      console.log(payload.accessToken);
      state.isAuthenticated = payload.isAuthenticated;
      state.accessToken = payload.accessToken;
      state.name = payload.name;
      state.role = payload.role;
    },
  },
});

export const { userLoggedIn } = userSlice.actions;
export default userSlice.reducer;
