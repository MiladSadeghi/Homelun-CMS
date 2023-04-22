import { createSlice } from "@reduxjs/toolkit";
import { TUser, TUsers } from "../../types/user";

const initialState: { users: TUsers[] } = {
  users: [],
};

const userListSlice = createSlice({
  name: "userList",
  initialState,
  reducers: {
    setUsers: (state, action) => {
      state.users = action.payload;
    },
  },
});

export const { setUsers } = userListSlice.actions;
export default userListSlice.reducer;
