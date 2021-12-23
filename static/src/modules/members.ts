import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import * as t from "io-ts";

import { RootState } from "./store";

export const Member = t.type({
  id: t.number,
  is_enabled: t.boolean,
  name: t.string,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Member = t.TypeOf<typeof Member>;

export const adapter = createEntityAdapter<Member>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.members
);

const members = createSlice({
  initialState: adapter.getInitialState(),
  name: "members",
  reducers: {
    update: adapter.updateOne,
  },
});

export const { update } = members.actions;

export const { reducer } = members;
