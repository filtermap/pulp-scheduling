import { createSlice } from "@reduxjs/toolkit";

export type Schedule = {
  id: number;
  term_id: number;
};

const initialState: Schedule[] = [];

const schedules = createSlice({
  name: "schedules",
  initialState,
  reducers: {},
});

export const { reducer } = schedules;
