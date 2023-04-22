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
    enableUser: (state, { payload }: { payload: string }) => {
      const index = state.users.findIndex(
        (user: TUsers) => user._id === payload
      );
      state.users[index].disabled = false;
    },
    disableUser: (state, { payload }: { payload: string }) => {
      const index = state.users.findIndex(
        (user: TUsers) => user._id === payload
      );
      state.users[index].disabled = true;
    },
    publishAgent: (state, { payload }: { payload: string }) => {
      const index = state.users.findIndex(
        (user: TUsers) => user._id === payload
      );
      state.users[index].publish = true;
    },
    unpublishAgent: (state, { payload }: { payload: string }) => {
      const index = state.users.findIndex(
        (user: TUsers) => user._id === payload
      );
      state.users[index].publish = false;
    },
  },
});

export const {
  setUsers,
  enableUser,
  disableUser,
  publishAgent,
  unpublishAgent,
} = userListSlice.actions;
export default userListSlice.reducer;
