import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Constraint0 = t.type({
  id: t.number,
  term_id: t.number,
  is_enabled: t.boolean,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint0 = t.TypeOf<typeof Constraint0>;

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
