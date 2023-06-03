import { createSlice } from "@reduxjs/toolkit";
import { TAgent, TUser } from "../../types/user";

const initialState: TUser = {
  isAuthenticated: false,
  accessToken: null,
  name: null,
  role: null,
  profileCompleted: false,
  agentProfile: null,
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
    isProfileCompleted: (
      state,
      {
        payload,
      }: { payload: { status: boolean; id?: string; agentProfile?: TAgent } }
    ) => {
      state.profileCompleted = payload.status;
      state.id = payload.id;
      state.agentProfile = payload.agentProfile;
    },
    userLogout: () => {
      localStorage.removeItem("kq_c");
      return initialState;
    },
  },
});

export const { userLoggedIn, setToken, isProfileCompleted, userLogout } =
  userSlice.actions;
export default userSlice.reducer;
