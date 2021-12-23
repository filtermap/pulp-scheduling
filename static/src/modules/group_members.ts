import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const GroupMember = t.type({
  group_id: t.number,
  id: t.number,
  member_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type GroupMember = t.TypeOf<typeof GroupMember>;

export const adapter = createEntityAdapter<GroupMember>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.group_members
);

const group_members = createSlice({
  initialState: adapter.getInitialState(),
  name: "group_members",
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        group_id: number;
        member_id: number;
      }>
    ) =>
      adapter.addOne(state, {
        ...action.payload,
        id: Math.max(0, ...(state.ids as number[])) + 1,
      }),
    remove: (
      state,
      action: PayloadAction<{
        group_id: number;
        member_id: number;
      }>
    ) =>
      adapter.removeMany(
        state,
        state.ids.filter((id) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const { group_id, member_id } = state.entities[id]!;
          return (
            group_id === action.payload.group_id &&
            member_id === action.payload.member_id
          );
        })
      ),
  },
});

export const { add, remove } = group_members.actions;

export const { reducer } = group_members;
