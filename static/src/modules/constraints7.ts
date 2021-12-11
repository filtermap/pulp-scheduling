import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "./store";

export type Constraint7 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  kinmu_id: number;
  min_number_of_days: number;
};

export const minOfConstraint7MinNumberOfDays = 2;

export const adapter = createEntityAdapter<Constraint7>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints7
);

const constraints7 = createSlice({
  name: "constraints7",
  initialState: adapter.getInitialState(),
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
    update: adapter.updateOne,
    remove: adapter.removeOne,
  },
});

export const { add, update, remove } = constraints7.actions;

export const { reducer } = constraints7;
