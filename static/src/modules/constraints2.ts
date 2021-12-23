import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Constraint2 = t.type({
  group_id: t.number,
  id: t.number,
  is_enabled: t.boolean,
  kinmu_id: t.number,
  max_number_of_assignments: t.number,
  start_date_name: t.string,
  stop_date_name: t.string,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint2 = t.TypeOf<typeof Constraint2>;

export const minOfConstraint2MaxNumberOfAssignments = 0;

export const adapter = createEntityAdapter<Constraint2>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints2
);

const constraints2 = createSlice({
  initialState: adapter.getInitialState(),
  name: "constraints2",
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
        max_number_of_assignments: number;
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

export const { add, update, remove } = constraints2.actions;

export const { reducer } = constraints2;
