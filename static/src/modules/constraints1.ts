import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Constraint1 = t.type({
  group_id: t.number,
  id: t.number,
  is_enabled: t.boolean,
  kinmu_id: t.number,
  min_number_of_assignments: t.number,
  start_date_name: t.string,
  stop_date_name: t.string,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint1 = t.TypeOf<typeof Constraint1>;

export const minOfConstraint1MinNumberOfAssignments = 1;

export const adapter = createEntityAdapter<Constraint1>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints1
);

const constraints1 = createSlice({
  initialState: adapter.getInitialState(),
  name: "constraints1",
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        start_date_name: string;
        stop_date_name: string;
        kinmu_id: number;
        group_id: number;
        min_number_of_assignments: number;
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

export const { add, update, remove } = constraints1.actions;

export const { reducer } = constraints1;
