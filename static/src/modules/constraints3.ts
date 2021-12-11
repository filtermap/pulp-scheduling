import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Constraint3 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  member_id: number;
  kinmu_id: number;
  min_number_of_assignments: number;
};

export const minOfConstraint3MinNumberOfAssignments = 1;

const initialState: Constraint3[] = [];

const constraints3 = createSlice({
  name: "constraints3",
  initialState,
  reducers: {
    createConstraint3: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        member_id: number;
        kinmu_id: number;
        min_number_of_assignments: number;
      }>
    ) => {
      state.push({
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        term_id: action.payload.term_id,
        is_enabled: action.payload.is_enabled,
        kinmu_id: action.payload.kinmu_id,
        member_id: action.payload.member_id,
        min_number_of_assignments: action.payload.min_number_of_assignments,
      });
    },
    updateConstraint3IsEnabled: (
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
    updateConstraint3MemberId: (
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
    updateConstraint3KinmuId: (
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
    updateConstraint3MinNumberOfAssignments: (
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
    deleteConstraint3: (
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
  createConstraint3,
  updateConstraint3IsEnabled,
  updateConstraint3MemberId,
  updateConstraint3KinmuId,
  updateConstraint3MinNumberOfAssignments,
  deleteConstraint3,
} = constraints3.actions;

export const { reducer } = constraints3;
