import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Constraint2 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  start_date_name: string;
  stop_date_name: string;
  kinmu_id: number;
  group_id: number;
  max_number_of_assignments: number;
};

export const minOfConstraint2MaxNumberOfAssignments = 0;

const initialState: Constraint2[] = [];

const constraints2 = createSlice({
  name: "constraints2",
  initialState,
  reducers: {
    createConstraint2: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        start_date_name: string;
        stop_date_name: string;
        kinmu_id: number;
        group_id: number;
        max_number_of_assignments: number;
      }>
    ) => {
      state.push({
        group_id: action.payload.group_id,
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        term_id: action.payload.term_id,
        is_enabled: action.payload.is_enabled,
        kinmu_id: action.payload.kinmu_id,
        max_number_of_assignments: action.payload.max_number_of_assignments,
        start_date_name: action.payload.start_date_name,
        stop_date_name: action.payload.stop_date_name,
      });
    },
    updateConstraint2IsEnabled: (
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
    updateConstraint2StartDateName: (
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
    updateConstraint2StopDateName: (
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
    updateConstraint2KinmuId: (
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
    updateConstraint2GroupId: (
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
    updateConstraint2MaxNumberOfAssignments: (
      state,
      action: PayloadAction<{
        id: number;
        max_number_of_assignments: number;
      }>
    ) => {
      for (const c of state) {
        if (c.id !== action.payload.id) continue;
        c.max_number_of_assignments = action.payload.max_number_of_assignments;
        break;
      }
    },
    deleteConstraint2: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      return state.filter((c) => c.id !== action.payload.id);
    },
  },
});

export const {
  createConstraint2,
  updateConstraint2IsEnabled,
  updateConstraint2StartDateName,
  updateConstraint2StopDateName,
  updateConstraint2KinmuId,
  updateConstraint2GroupId,
  updateConstraint2MaxNumberOfAssignments,
  deleteConstraint2,
} = constraints2.actions;

export const { reducer } = constraints2;
