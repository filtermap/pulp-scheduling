import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Kinmu = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  name: string;
};

const initialState: Kinmu[] = [];

const kinmus = createSlice({
  name: "kinmus",
  initialState,
  reducers: {
    createKinmu: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        name: string;
      }>
    ) => {
      state.push({
        id: Math.max(0, ...state.map((kinmu) => kinmu.id)) + 1,
        term_id: action.payload.term_id,
        is_enabled: action.payload.is_enabled,
        name: action.payload.name,
      });
    },
    updateKinmuName: (
      state,
      action: PayloadAction<{ id: number; name: string }>
    ) => {
      for (const kinmu of state) {
        if (kinmu.id !== action.payload.id) continue;
        kinmu.name = action.payload.name;
        break;
      }
    },
    updateKinmuIsEnabled: (
      state,
      action: PayloadAction<{ id: number; is_enabled: boolean }>
    ) => {
      for (const kinmu of state) {
        if (kinmu.id !== action.payload.id) continue;
        kinmu.is_enabled = action.payload.is_enabled;
        break;
      }
    },
  },
});

export const { createKinmu, updateKinmuName, updateKinmuIsEnabled } =
  kinmus.actions;

export const { reducer } = kinmus;
