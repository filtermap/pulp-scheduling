import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Constraint9 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  member_id: number;
  start_date_name: string;
  stop_date_name: string;
  kinmu_id: number;
};

const initialState: Constraint9[] = [];

const constraints9 = createSlice({
  name: "constraints9",
  initialState,
  reducers: {
    createConstraint9: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        member_id: number;
        start_date_name: string;
        stop_date_name: string;
        kinmu_id: number;
      }>
    ) => {
      state.push({
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        term_id: action.payload.term_id,
        is_enabled: action.payload.is_enabled,
        member_id: action.payload.member_id,
        start_date_name: action.payload.start_date_name,
        stop_date_name: action.payload.stop_date_name,
        kinmu_id: action.payload.kinmu_id,
      });
    },
    updateConstraint9IsEnabled: (
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
    updateConstraint9MemberId: (
      state,
      action: PayloadAction<{
        id: number;
        member_id: number;
      }>
    ) => {
      for (const c of state) {
        if (c.id !== action.payload.id) continue;
        c.member_id = action.payload.member_id;
        break;
      }
    },
    updateConstraint9StartDateName: (
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
    updateConstraint9StopDateName: (
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
    updateConstraint9KinmuId: (
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
    deleteConstraint9: (
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
  createConstraint9,
  updateConstraint9IsEnabled,
  updateConstraint9MemberId,
  updateConstraint9StartDateName,
  updateConstraint9StopDateName,
  updateConstraint9KinmuId,
  deleteConstraint9,
} = constraints9.actions;

export const { reducer } = constraints9;
