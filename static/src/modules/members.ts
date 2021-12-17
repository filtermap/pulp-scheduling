import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { RootState } from "./store";

export type Member = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  name: string;
};

export const adapter = createEntityAdapter<Member>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.members
);

const members = createSlice({
  name: "members",
  initialState: adapter.getInitialState(),
  reducers: {
    update: adapter.updateOne,
  },
});

export const { update } = members.actions;

export const { reducer } = members;
