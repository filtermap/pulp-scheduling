import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import { RootState } from "./store";

export type Group = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  name: string;
};

export const adapter = createEntityAdapter<Group>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.groups
);

const groups = createSlice({
  name: "groups",
  initialState: adapter.getInitialState(),
  reducers: {
    update: adapter.updateOne,
  },
});

export const { update } = groups.actions;

export const { reducer } = groups;
