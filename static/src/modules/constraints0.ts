import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { RootState } from "./store";

export type Constraint0 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
};

export const adapter = createEntityAdapter<Constraint0>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints0
);

const constraints0 = createSlice({
  name: "constraints0",
  initialState: adapter.getInitialState(),
  reducers: {
    update: adapter.updateOne,
  },
});

export const { update } = constraints0.actions;

export const { reducer } = constraints0;
