import { createSlice } from "@reduxjs/toolkit";
import { TUser } from "../../types/user";

const initialState: TUser = {
  isAuthenticated: false,
  accessToken: null,
  name: null,
  role: null,
  profileCompleted: false,
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
    isProfileCompleted: (state, { payload }: { payload: boolean }) => {
      state.profileCompleted = payload;
    },
  },
});

export const { userLoggedIn, setToken, userLoggedOut, isProfileCompleted } =
  userSlice.actions;
export default userSlice.reducer;
