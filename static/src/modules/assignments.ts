import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";

import { RootState } from "./store";

export type Assignment = {
  id: number;
  schedule_id: number;
  date_name: string;
  member_id: number;
  kinmu_id: number;
};

export const adapter = createEntityAdapter<Assignment>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.assignments
);

const assignments = createSlice({
  name: "assignments",
  initialState: adapter.getInitialState(),
  reducers: {},
});

export const { reducer } = assignments;
