import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Term = {
  id: number;
  is_enabled: boolean;
  start_date_name: string;
  stop_date_name: string;
};

const initialState: Term[] = [];

const terms = createSlice({
  name: "terms",
  initialState,
  reducers: {
    createTerm: (
      state,
      action: PayloadAction<{
        is_enabled: boolean;
        start_date_name: string;
        stop_date_name: string;
      }>
    ) => {
      state.push({
        id: Math.max(0, ...state.map(({ id }) => id)) + 1,
        is_enabled: action.payload.is_enabled,
        start_date_name: action.payload.start_date_name,
        stop_date_name: action.payload.stop_date_name,
      });
    },
    updateTermIsEnabled: (
      state,
      action: PayloadAction<{ id: number; is_enabled: boolean }>
    ) => {
      for (const term of state) {
        if (term.id !== action.payload.id) continue;
        term.is_enabled = action.payload.is_enabled;
        break;
      }
    },
    updateTermStartDateName: (
      state,
      action: PayloadAction<{ id: number; start_date_name: string }>
    ) => {
      for (const term of state) {
        if (term.id !== action.payload.id) continue;
        term.start_date_name = action.payload.start_date_name;
        break;
      }
    },
    updateTermStopDateName: (
      state,
      action: PayloadAction<{ id: number; stop_date_name: string }>
    ) => {
      for (const term of state) {
        if (term.id !== action.payload.id) continue;
        term.stop_date_name = action.payload.stop_date_name;
        break;
      }
    },
  },
});

export const {
  createTerm,
  updateTermIsEnabled,
  updateTermStartDateName,
  updateTermStopDateName,
} = terms.actions;

export const { reducer } = terms;
