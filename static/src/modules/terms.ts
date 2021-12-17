import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { RootState } from "./store";

export type Term = {
  id: number;
  is_enabled: boolean;
  start_date_name: string;
  stop_date_name: string;
};

export const adapter = createEntityAdapter<Term>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.terms
);

const terms = createSlice({
  name: "terms",
  initialState: adapter.getInitialState(),
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        is_enabled: boolean;
        start_date_name: string;
        stop_date_name: string;
      }>
    ) =>
      adapter.addOne(state, {
        ...action.payload,
        id: Math.max(0, ...(state.ids as number[])) + 1,
      }),
    update: adapter.updateOne,
  },
});

export const { add, update } = terms.actions;

export const { reducer } = terms;
