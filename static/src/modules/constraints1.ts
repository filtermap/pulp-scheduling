import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Constraint1 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  start_date_name: string;
  stop_date_name: string;
  kinmu_id: number;
  group_id: number;
  min_number_of_assignments: number;
};

export const minOfConstraint1MinNumberOfAssignments = 1;

const initialState: Constraint1[] = [];

const constraints1 = createSlice({
  name: "constraints1",
  initialState,
  reducers: {
    createConstraint1: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        start_date_name: string;
        stop_date_name: string;
        kinmu_id: number;
        group_id: number;
        min_number_of_assignments: number;
      }>
    ) => {
      state.push({
        group_id: action.payload.group_id,
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        term_id: action.payload.term_id,
        is_enabled: action.payload.is_enabled,
        kinmu_id: action.payload.kinmu_id,
        min_number_of_assignments: action.payload.min_number_of_assignments,
        start_date_name: action.payload.start_date_name,
        stop_date_name: action.payload.stop_date_name,
      });
    },
    updateConstraint1IsEnabled: (
      state,
      action: PayloadAction<{
        id: number;
        is_enabled: boolean;
      }>
    ) => {
      for (const c of state) {
        if (c.id !== action.payload.id) continue;
        c.is_enabled = action.payload.is_enabled;
        break;
      }
    },
    updateConstraint1StartDateName: (
      state,
      action: PayloadAction<{
        id: number;
        start_date_name: string;
      }>
    ) => {
      for (const c of state) {
        if (c.id !== action.payload.id) continue;
        c.start_date_name = action.payload.start_date_name;
        break;
      }
    },
    updateConstraint1StopDateName: (
      state,
      action: PayloadAction<{
        id: number;
        stop_date_name: string;
      }>
    ) => {
      for (const c of state) {
        if (c.id !== action.payload.id) continue;
        c.stop_date_name = action.payload.stop_date_name;
        break;
      }
    },
    updateConstraint1KinmuId: (
      state,
      action: PayloadAction<{
        id: number;
        kinmu_id: number;
      }>
    ) => {
      for (const c of state) {
        if (c.id !== action.payload.id) continue;
        c.kinmu_id = action.payload.kinmu_id;
        break;
      }
    },
    updateConstraint1GroupId: (
      state,
      action: PayloadAction<{
        id: number;
        group_id: number;
      }>
    ) => {
      for (const c of state) {
        if (c.id !== action.payload.id) continue;
        c.group_id = action.payload.group_id;
        break;
      }
    },
    updateConstraint1MinNumberOfAssignments: (
      state,
      action: PayloadAction<{
        id: number;
        min_number_of_assignments: number;
      }>
    ) => {
      for (const c of state) {
        if (c.id !== action.payload.id) continue;
        c.min_number_of_assignments = action.payload.min_number_of_assignments;
        break;
      }
    },
    deleteConstraint1: (state, action: PayloadAction<{ id: number }>) => {
      return state.filter((c) => c.id !== action.payload.id);
    },
  },
});

export const {
  createConstraint1,
  updateConstraint1IsEnabled,
  updateConstraint1StartDateName,
  updateConstraint1StopDateName,
  updateConstraint1KinmuId,
  updateConstraint1GroupId,
  updateConstraint1MinNumberOfAssignments,
  deleteConstraint1,
} = constraints1.actions;

export const { reducer } = constraints1;
