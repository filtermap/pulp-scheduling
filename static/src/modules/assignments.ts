import { createSlice } from "@reduxjs/toolkit";

export type Assignment = {
  id: number;
  schedule_id: number;
  date_name: string;
  member_id: number;
  kinmu_id: number;
};

const initialState: Assignment[] = [];

const assignments = createSlice({
  name: "assignments",
  initialState,
  reducers: {},
});

export const { reducer } = assignments;
