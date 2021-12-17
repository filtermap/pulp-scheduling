import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { RootState } from "./store";

export type Constraint9 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  member_id: number;
  start_date_name: string;
  stop_date_name: string;
  kinmu_id: number;
};

export const adapter = createEntityAdapter<Constraint9>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints9
);

const constraints9 = createSlice({
  name: "constraints9",
  initialState: adapter.getInitialState(),
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        member_id: number;
        start_date_name: string;
        stop_date_name: string;
        kinmu_id: number;
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

export const { add, update, remove } = constraints9.actions;

export const { reducer } = constraints9;
