import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  Update,
} from "@reduxjs/toolkit";

import { RootState } from "./store";

export type Constraint0Kinmu = {
  id: number;
  constraint0_id: number;
  sequence_number: number;
  kinmu_id: number;
};

export const adapter = createEntityAdapter<Constraint0Kinmu>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraint0_kinmus
);

const constraint0_kinmus = createSlice({
  name: "constraint0_kinmus",
  initialState: adapter.getInitialState(),
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        constraint0_id: number;
        sequence_number: number;
        kinmu_id: number;
      }>
    ) => {
      const updatedConstraint0Kinmus: Update<Constraint0Kinmu>[] = state.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.entities[id]!)
        .filter(
          (c) =>
            c.constraint0_id === action.payload.constraint0_id &&
            c.sequence_number >= action.payload.sequence_number
        )
        .map((c) => ({
          id: c.id,
          changes: {
            sequence_number: c.sequence_number + 1,
          },
        }));
      adapter.updateMany(state, updatedConstraint0Kinmus);
      adapter.addOne(state, {
        ...action.payload,
        id: Math.max(0, ...(state.ids as number[])) + 1,
      });
    },
    update: adapter.updateOne,
  },
});

export const { add, update } = constraint0_kinmus.actions;

export const { reducer } = constraint0_kinmus;
