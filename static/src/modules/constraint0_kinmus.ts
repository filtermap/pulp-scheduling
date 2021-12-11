import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Constraint0Kinmu = {
  id: number;
  constraint0_id: number;
  sequence_number: number;
  kinmu_id: number;
};

const initialState: Constraint0Kinmu[] = [];

const constraint0_kinmus = createSlice({
  name: "constraint0_kinmus",
  initialState,
  reducers: {
    createConstraint0Kinmu: (
      state,
      action: PayloadAction<{
        constraint0_id: number;
        sequence_number: number;
        kinmu_id: number;
      }>
    ) => {
      for (const c_kinmu of state) {
        if (c_kinmu.constraint0_id !== action.payload.constraint0_id) continue;
        if (c_kinmu.sequence_number < action.payload.sequence_number) continue;
        c_kinmu.sequence_number++;
      }
      state.push({
        constraint0_id: action.payload.constraint0_id,
        id: Math.max(0, ...state.map(({ id }) => id)) + 1,
        kinmu_id: action.payload.kinmu_id,
        sequence_number: action.payload.sequence_number,
      });
    },
    updateConstraint0KinmuKinmuId: (
      state,
      action: PayloadAction<{
        id: number;
        kinmu_id: number;
      }>
    ) => {
      for (const c_kinmu of state) {
        if (c_kinmu.id !== action.payload.id) continue;
        c_kinmu.kinmu_id = action.payload.kinmu_id;
        break;
      }
    },
  },
});

export const { createConstraint0Kinmu, updateConstraint0KinmuKinmuId } =
  constraint0_kinmus.actions;

export const { reducer } = constraint0_kinmus;
