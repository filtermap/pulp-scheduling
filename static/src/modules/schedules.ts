import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Schedule = t.type({
  id: t.number,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Schedule = t.TypeOf<typeof Schedule>;

export const adapter = createEntityAdapter<Schedule>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.schedules
);

const schedules = createSlice({
  initialState: adapter.getInitialState(),
  name: "schedules",
  reducers: {},
});

export const { reducer } = schedules;
