import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
  Update,
} from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Constraint0Kinmu = t.type({
  constraint0_id: t.number,
  id: t.number,
  kinmu_id: t.number,
  sequence_number: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint0Kinmu = t.TypeOf<typeof Constraint0Kinmu>;

export const adapter = createEntityAdapter<Constraint0Kinmu>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraint0_kinmus
);

const constraint0_kinmus = createSlice({
  initialState: adapter.getInitialState(),
  name: "constraint0_kinmus",
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
          changes: {
            sequence_number: c.sequence_number + 1,
          },
          id: c.id,
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
