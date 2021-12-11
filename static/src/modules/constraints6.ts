import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Constraint6 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  kinmu_id: number;
  max_number_of_days: number;
};

export const minOfConstraint6MaxNumberOfDays = 2;

const initialState: Constraint6[] = [];

const constraints6 = createSlice({
  name: "constraints6",
  initialState,
  reducers: {
    createConstraint6: (
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
    updateConstraint6IsEnabled: (
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
    updateConstraint6KinmuId: (
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
    updateConstraint6MaxNumberOfDays: (
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
    deleteConstraint6: (
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
  createConstraint6,
  updateConstraint6IsEnabled,
  updateConstraint6KinmuId,
  updateConstraint6MaxNumberOfDays,
  deleteConstraint6,
} = constraints6.actions;

export const { reducer } = constraints6;
