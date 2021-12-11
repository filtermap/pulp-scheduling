import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Constraint0 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
};

const initialState: Constraint0[] = [];

const constraints0 = createSlice({
  name: "constraints0",
  initialState,
  reducers: {
    updateConstraint0IsEnabled: (
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
  },
});

export const { updateConstraint0IsEnabled } = constraints0.actions;

export const { reducer } = constraints0;
