import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Constraint4 = t.type({
  id: t.number,
  term_id: t.number,
  is_enabled: t.boolean,
  member_id: t.number,
  kinmu_id: t.number,
  max_number_of_assignments: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint4 = t.TypeOf<typeof Constraint4>;

export const minOfConstraint4MaxNumberOfAssignments = 0;

export const adapter = createEntityAdapter<Constraint4>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints4
);

const constraints4 = createSlice({
  name: "constraints4",
  initialState: adapter.getInitialState(),
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        member_id: number;
        kinmu_id: number;
        max_number_of_assignments: number;
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

export const { add, update, remove } = constraints4.actions;

export const { reducer } = constraints4;
