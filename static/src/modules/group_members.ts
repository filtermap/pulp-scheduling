import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export type GroupMember = {
  id: number;
  group_id: number;
  member_id: number;
};

const initialState: GroupMember[] = [];

const group_members = createSlice({
  name: "group_members",
  initialState,
  reducers: {
    createGroupMember: (
      state,
      action: PayloadAction<{
        group_id: number;
        member_id: number;
      }>
    ) => {
      state.push({
        id: Math.max(0, ...state.map((group_member) => group_member.id)) + 1,
        group_id: action.payload.group_id,
        member_id: action.payload.member_id,
      });
    },
    deleteGroupMember: (
      state,
      action: PayloadAction<{
        group_id: number;
        member_id: number;
      }>
    ) => {
      return state.filter(
        (group_member) =>
          !(
            group_member.group_id === action.payload.group_id &&
            group_member.member_id === action.payload.member_id
          )
      );
    },
  },
});

export const { createGroupMember, deleteGroupMember } = group_members.actions;

export const { reducer } = group_members;
