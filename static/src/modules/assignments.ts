import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Assignment = t.type({
  date_name: t.string,
  id: t.number,
  kinmu_id: t.number,
  member_id: t.number,
  schedule_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Assignment = t.TypeOf<typeof Assignment>;

export const adapter = createEntityAdapter<Assignment>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.assignments
);

const assignments = createSlice({
  initialState: adapter.getInitialState(),
  name: "assignments",
  reducers: {},
});

export const { reducer } = assignments;
