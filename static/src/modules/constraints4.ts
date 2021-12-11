import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Constraint4 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  member_id: number;
  kinmu_id: number;
  max_number_of_assignments: number;
};

export const minOfConstraint4MaxNumberOfAssignments = 0;

const initialState: Constraint4[] = [];

const constraints4 = createSlice({
  name: "constraints4",
  initialState,
  reducers: {
    createConstraint4: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        member_id: number;
        kinmu_id: number;
        max_number_of_assignments: number;
      }>
    ) => {
      state.push({
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        term_id: action.payload.term_id,
        is_enabled: action.payload.is_enabled,
        kinmu_id: action.payload.kinmu_id,
        max_number_of_assignments: action.payload.max_number_of_assignments,
        member_id: action.payload.member_id,
      });
    },
    updateConstraint4IsEnabled: (
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
    updateConstraint4MemberId: (
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
    updateConstraint4KinmuId: (
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

    updateConstraint4MaxNumberOfAssignments: (
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
    deleteConstraint4: (
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
  createConstraint4,
  updateConstraint4IsEnabled,
  updateConstraint4KinmuId,
  updateConstraint4MemberId,
  updateConstraint4MaxNumberOfAssignments,
  deleteConstraint4,
} = constraints4.actions;

export const { reducer } = constraints4;
