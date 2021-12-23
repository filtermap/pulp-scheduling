import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Term = t.type({
  id: t.number,
  is_enabled: t.boolean,
  start_date_name: t.string,
  stop_date_name: t.string,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Term = t.TypeOf<typeof Term>;

export const adapter = createEntityAdapter<Term>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.terms
);

const terms = createSlice({
  initialState: adapter.getInitialState(),
  name: "terms",
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
