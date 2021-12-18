import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Constraint9 = t.type({
  id: t.number,
  term_id: t.number,
  is_enabled: t.boolean,
  member_id: t.number,
  start_date_name: t.string,
  stop_date_name: t.string,
  kinmu_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint9 = t.TypeOf<typeof Constraint9>;

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
