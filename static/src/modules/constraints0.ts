import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Constraint0 = t.type({
  id: t.number,
  is_enabled: t.boolean,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint0 = t.TypeOf<typeof Constraint0>;

export const adapter = createEntityAdapter<Constraint0>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints0
);

const constraints0 = createSlice({
  initialState: adapter.getInitialState(),
  name: "constraints0",
  reducers: {
    update: adapter.updateOne,
  },
});

export const { update } = constraints0.actions;

export const { reducer } = constraints0;
