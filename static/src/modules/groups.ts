import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Group = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  name: string;
};

const initialState: Group[] = [];

const groups = createSlice({
  name: "groups",
  initialState,
  reducers: {
    updateGroupIsEnabled: (
      state,
      action: PayloadAction<{ id: number; is_enabled: boolean }>
    ) => {
      for (const group of state) {
        if (group.id !== action.payload.id) continue;
        group.is_enabled = action.payload.is_enabled;
        break;
      }
    },
    updateGroupName: (
      state,
      action: PayloadAction<{ id: number; name: string }>
    ) => {
      for (const group of state) {
        if (group.id !== action.payload.id) continue;
        group.name = action.payload.name;
        break;
      }
    },
  },
});

export const { updateGroupIsEnabled, updateGroupName } = groups.actions;

export const { reducer } = groups;
