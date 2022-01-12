import { createEntityAdapter, createSlice } from "@reduxjs/toolkit";
import * as t from "io-ts";
import { TFunction } from "react-i18next";

import * as utils from "../utils";

import { RootState } from "./store";

export const Group = t.type({
  id: t.number,
  is_enabled: t.boolean,
  name: t.string,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Group = t.TypeOf<typeof Group>;

export const adapter = createEntityAdapter<Group>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.groups
);

const groups = createSlice({
  initialState: adapter.getInitialState(),
  name: "groups",
  reducers: {
    update: adapter.updateOne,
  },
});

export const { update } = groups.actions;

export const { reducer } = groups;

type ErrorMessages = utils.ErrorMessages<"name">;

export const getErrorMessages = (
  t: TFunction,
  group: { name: string }
): ErrorMessages => {
  const errorMessages: ErrorMessages = {
    name: [],
  };
  if (group.name === "")
    errorMessages.name.push(
      t("{{arg0}}を入力してください", { arg0: t("グループ名") })
    );
  return errorMessages;
};
