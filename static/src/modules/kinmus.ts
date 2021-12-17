import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";

import { RootState } from "./store";

export type Kinmu = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  name: string;
};

export const adapter = createEntityAdapter<Kinmu>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.kinmus
);

const kinmus = createSlice({
  name: "kinmus",
  initialState: adapter.getInitialState(),
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        name: string;
      }>
    ) => {
      adapter.addOne(state, {
        ...action.payload,
        id: Math.max(0, ...(state.ids as number[])) + 1,
      });
    },
    update: adapter.updateOne,
  },
});

export const { add, update } = kinmus.actions;

export const { reducer } = kinmus;
