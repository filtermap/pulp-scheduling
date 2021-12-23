import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Constraint5 = t.type({
  id: t.number,
  is_enabled: t.boolean,
  kinmu_id: t.number,
  min_number_of_days: t.number,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint5 = t.TypeOf<typeof Constraint5>;

export const minOfConstraint5MinNumberOfDays = 2;

export const adapter = createEntityAdapter<Constraint5>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints5
);

const constraints5 = createSlice({
  initialState: adapter.getInitialState(),
  name: "constraints5",
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        kinmu_id: number;
        min_number_of_days: number;
      }>
    ) =>
      adapter.addOne(state, {
        ...action.payload,
        id: Math.max(0, ...(state.ids as number[])) + 1,
      }),
    remove: adapter.removeOne,
    update: adapter.updateOne,
  },
});

export const { add, update, remove } = constraints5.actions;

export const { reducer } = constraints5;
