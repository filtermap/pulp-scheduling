import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Constraint10 = t.type({
  id: t.number,
  term_id: t.number,
  is_enabled: t.boolean,
  member_id: t.number,
  start_date_name: t.string,
  stop_date_name: t.string,
  kinmu_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint10 = t.TypeOf<typeof Constraint10>;

export const adapter = createEntityAdapter<Constraint10>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints10
);

const constraints10 = createSlice({
  name: "constraints10",
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

export const { add, update, remove } = constraints10.actions;

export const { reducer } = constraints10;
