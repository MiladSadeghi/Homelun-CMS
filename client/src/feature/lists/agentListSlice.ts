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
    publishAgent: (
      state,
      { payload }: { payload: { agentId: string; publish: boolean } }
    ) => {
      const index = state.agents!.findIndex(
        (agent: TAgent) => agent._id === payload.agentId
      );
      state.agents![index].publish = payload.publish;
    },
  },
});

export const { setAgents, publishAgent } = agentSlice.actions;
export default agentSlice.reducer;
