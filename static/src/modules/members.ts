import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type Member = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  name: string;
};

const initialState: Member[] = [];

const members = createSlice({
  name: "members",
  initialState,
  reducers: {
    updateMemberIsEnabled: (
      state,
      action: PayloadAction<{
        id: number;
        is_enabled: boolean;
      }>
    ) => {
      for (const member of state) {
        if (member.id !== action.payload.id) continue;
        member.is_enabled = action.payload.is_enabled;
        break;
      }
    },
    updateMemberName: (
      state,
      action: PayloadAction<{ id: number; name: string }>
    ) => {
      for (const member of state) {
        if (member.id !== action.payload.id) continue;
        member.name = action.payload.name;
        break;
      }
    },
  },
});

export const { updateMemberIsEnabled, updateMemberName } = members.actions;

export const { reducer } = members;
