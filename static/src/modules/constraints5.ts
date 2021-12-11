import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Constraint5 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  kinmu_id: number;
  min_number_of_days: number;
};

export const minOfConstraint5MinNumberOfDays = 2;

const initialState: Constraint5[] = [];

const constraints5 = createSlice({
  name: "constraints5",
  initialState,
  reducers: {
    createConstraint5: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        kinmu_id: number;
        min_number_of_days: number;
      }>
    ) => {
      state.push({
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        term_id: action.payload.term_id,
        is_enabled: action.payload.is_enabled,
        kinmu_id: action.payload.kinmu_id,
        min_number_of_days: action.payload.min_number_of_days,
      });
    },
    updateConstraint5IsEnabled: (
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
    updateConstraint5KinmuId: (
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
    updateConstraint5MinNumberOfDays: (
      state,
      action: PayloadAction<{
        id: number;
        min_number_of_days: number;
      }>
    ) => {
      for (const c of state) {
        if (c.id !== action.payload.id) continue;
        c.min_number_of_days = action.payload.min_number_of_days;
        break;
      }
    },
    deleteConstraint5: (
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
  createConstraint5,
  updateConstraint5IsEnabled,
  updateConstraint5KinmuId,
  updateConstraint5MinNumberOfDays,
  deleteConstraint5,
} = constraints5.actions;

export const { reducer } = constraints5;
