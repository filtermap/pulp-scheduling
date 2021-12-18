import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Constraint3 = t.type({
  id: t.number,
  term_id: t.number,
  is_enabled: t.boolean,
  member_id: t.number,
  kinmu_id: t.number,
  min_number_of_assignments: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint3 = t.TypeOf<typeof Constraint3>;

export const minOfConstraint3MinNumberOfAssignments = 1;

export const adapter = createEntityAdapter<Constraint3>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints3
);

const constraints3 = createSlice({
  name: "constraints3",
  initialState: adapter.getInitialState(),
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        member_id: number;
        kinmu_id: number;
        min_number_of_assignments: number;
      }>
    ) =>
      adapter.addOne(state, {
        ...action.payload,
        id: Math.max(0, ...(state.ids as number[])) + 1,
      }),
    update: adapter.updateOne,
    remove: adapter.removeOne,
  },
});

export const { add, update, remove } = constraints3.actions;

export const { reducer } = constraints3;
