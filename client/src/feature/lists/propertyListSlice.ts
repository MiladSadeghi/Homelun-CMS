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
    publishProperty: (state, { payload }: { payload: string }) => {
      const index = state.properties.findIndex(
        (property: TProperty) => property._id === payload
      );
      state.properties[index].publish = true;
    },
    unPublishProperty: (state, { payload }: { payload: string }) => {
      const index = state.properties.findIndex(
        (property: TProperty) => property._id === payload
      );
      state.properties[index].publish = false;
    },
  },
});

export const { setProperties, publishProperty, unPublishProperty } =
  propertyListSlice.actions;

export default propertyListSlice.reducer;
