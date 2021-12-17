import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { RootState } from "./store";

export type Schedule = {
  id: number;
  term_id: number;
};

export const adapter = createEntityAdapter<Schedule>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.schedules
);

const schedules = createSlice({
  name: "schedules",
  initialState: adapter.getInitialState(),
  reducers: {},
});

export const { reducer } = schedules;
