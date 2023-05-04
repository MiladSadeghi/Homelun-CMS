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
    disableUser: (
      state,
      { payload }: { payload: { userId: string; disabled: boolean } }
    ) => {
      const index = state.users.findIndex(
        (user: TUsers) => user._id === payload.userId
      );
      state.users[index].disabled = payload.disabled;
    },
  },
});

export const { setUsers, disableUser } = userListSlice.actions;
export default userListSlice.reducer;
