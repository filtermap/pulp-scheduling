import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "./store";

export type Constraint2 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  start_date_name: string;
  stop_date_name: string;
  kinmu_id: number;
  group_id: number;
  max_number_of_assignments: number;
};

export const minOfConstraint2MaxNumberOfAssignments = 0;

export const adapter = createEntityAdapter<Constraint2>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints2
);

const constraints2 = createSlice({
  name: "constraints2",
  initialState: adapter.getInitialState(),
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
    update: adapter.updateOne,
    remove: adapter.removeOne,
  },
});

export const { add, update, remove } = constraints2.actions;

export const { reducer } = constraints2;
