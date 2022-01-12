import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";
import { TFunction } from "react-i18next";

import * as utils from "../utils";

import { RootState } from "./store";

export const Term = t.type({
  id: t.number,
  is_enabled: t.boolean,
  start_date_name: t.string,
  stop_date_name: t.string,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Term = t.TypeOf<typeof Term>;

export const adapter = createEntityAdapter<Term>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.terms
);

const terms = createSlice({
  initialState: adapter.getInitialState(),
  name: "terms",
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        is_enabled: boolean;
        start_date_name: string;
        stop_date_name: string;
      }>
    ) =>
      adapter.addOne(state, {
        ...action.payload,
        id: Math.max(0, ...(state.ids as number[])) + 1,
      }),
    update: adapter.updateOne,
  },
});

export const { add, update } = terms.actions;

export const { reducer } = terms;

type ErrorMessages = utils.ErrorMessages<"start_date_name" | "stop_date_name">;

export const getErrorMessages = (
  t: TFunction,
  term: { start_date_name: string; stop_date_name: string }
): ErrorMessages => {
  const errorMessages: ErrorMessages = {
    start_date_name: [],
    stop_date_name: [],
  };
  const termStartDate = utils.stringToDate(term.start_date_name);
  const termStopDate = utils.stringToDate(term.stop_date_name);
  if (!termStartDate)
    errorMessages.start_date_name.push(
      t("{{arg0}}の形式が正しくありません", { arg0: t("開始日") })
    );
  if (!termStopDate)
    errorMessages.stop_date_name.push(
      t("{{arg0}}の形式が正しくありません", { arg0: t("終了日") })
    );
  if (termStartDate && termStopDate && termStartDate > termStopDate) {
    errorMessages.start_date_name.push(
      t("{{arg0}}には{{arg1}}より前の日付を入力してください", {
        arg0: t("開始日"),
        arg1: t("終了日"),
      })
    );
    errorMessages.stop_date_name.push(
      t("{{arg0}}には{{arg1}}より後の日付を入力してください", {
        arg0: t("終了日"),
        arg1: t("開始日"),
      })
    );
  }
  return errorMessages;
};
