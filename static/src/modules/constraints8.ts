import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Constraint8 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  kinmu_id: number;
  max_number_of_days: number;
};

export const minOfConstraint8MaxNumberOfDays = 1;

const initialState: Constraint8[] = [];

const constraints8 = createSlice({
  name: "constraints8",
  initialState,
  reducers: {
    createConstraint8: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        kinmu_id: number;
        max_number_of_days: number;
      }>
    ) => {
      state.push({
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        term_id: action.payload.term_id,
        is_enabled: action.payload.is_enabled,
        kinmu_id: action.payload.kinmu_id,
        max_number_of_days: action.payload.max_number_of_days,
      });
    },
    updateConstraint8IsEnabled: (
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
    updateConstraint8KinmuId: (
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
    updateConstraint8MaxNumberOfDays: (
      state,
      action: PayloadAction<{
        id: number;
        max_number_of_days: number;
      }>
    ) => {
      for (const c of state) {
        if (c.id !== action.payload.id) continue;
        c.max_number_of_days = action.payload.max_number_of_days;
        break;
      }
    },
    deleteConstraint8: (
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
  createConstraint8,
  updateConstraint8IsEnabled,
  updateConstraint8KinmuId,
  updateConstraint8MaxNumberOfDays,
  deleteConstraint8,
} = constraints8.actions;

export const { reducer } = constraints8;
