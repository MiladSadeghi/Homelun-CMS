import { createSlice } from "@reduxjs/toolkit";
import { TProperty } from "../../types/property";

const initialState: { properties: TProperty[]; property: TProperty | null } = {
  properties: [],
  property: null,
};

const propertyListSlice = createSlice({
  name: "propertySlice",
  initialState,
  reducers: {
    setProperties: (state, { payload }: { payload: TProperty[] }) => {
      state.properties = payload;
    },
    publishProperty: (
      state,
      { payload }: { payload: { propertyId: string; publish: boolean } }
    ) => {
      const index = state.properties.findIndex(
        (property: TProperty) => property._id === payload.propertyId
      );
      state.properties[index].publish = payload.publish;
    },
  },
});

export const { setProperties, publishProperty } = propertyListSlice.actions;

export default propertyListSlice.reducer;
