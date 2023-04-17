import { createSlice } from "@reduxjs/toolkit";

type TUserInterface = {
  isAuthenticated: boolean;
  accessToken: string | null;
};

const initialState: TUserInterface = {
  isAuthenticated: false,
  accessToken: null,
};

const userSlice = createSlice({
  name: "user",
  initialState,
  reducers: {
    userLoggedIn: (state, action) => {
      state.isAuthenticated = action.payload.isAuthenticated;
      state.accessToken = action.payload.accessToken;
    },
  },
});

export const { userLoggedIn } = userSlice.actions;
export default userSlice.reducer;
