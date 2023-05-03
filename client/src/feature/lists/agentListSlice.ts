import { createSlice } from "@reduxjs/toolkit";
import { TAgent } from "../../types/user";

const initialState: { agents: TAgent[] | null } = {
  agents: null,
};

const agentSlice = createSlice({
  name: "agent",
  initialState,
  reducers: {
    setAgents: (state, { payload }: { payload: TAgent[] }) => {
      state.agents = payload;
    },
  },
});

export const { setAgents } = agentSlice.actions;
export default agentSlice.reducer;
