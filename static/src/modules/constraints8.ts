import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import { RootState } from "./store";

export type Constraint8 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  kinmu_id: number;
  max_number_of_days: number;
};

export const minOfConstraint8MaxNumberOfDays = 1;

export const adapter = createEntityAdapter<Constraint8>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints8
);

const constraints8 = createSlice({
  name: "constraints8",
  initialState: adapter.getInitialState(),
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        kinmu_id: number;
        max_number_of_days: number;
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

export const { add, update, remove } = constraints8.actions;

export const { reducer } = constraints8;
