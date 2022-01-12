import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";
import { TFunction } from "react-i18next";

import * as utils from "../utils";

import { RootState } from "./store";

export const Constraint10 = t.type({
  id: t.number,
  is_enabled: t.boolean,
  kinmu_id: t.number,
  member_id: t.number,
  start_date_name: t.string,
  stop_date_name: t.string,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint10 = t.TypeOf<typeof Constraint10>;

export const adapter = createEntityAdapter<Constraint10>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints10
);

const constraints10 = createSlice({
  initialState: adapter.getInitialState(),
  name: "constraints10",
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        member_id: number;
        start_date_name: string;
        stop_date_name: string;
        kinmu_id: number;
      }>
    ) =>
      adapter.addOne(state, {
        ...action.payload,
        id: Math.max(0, ...(state.ids as number[])) + 1,
      }),
    remove: adapter.removeOne,
    update: adapter.updateOne,
  },
});

export const { add, update, remove } = constraints10.actions;

export const { reducer } = constraints10;

type ErrorMessages = utils.ErrorMessages<"start_date_name" | "stop_date_name">;

export const getErrorMessages = (
  t: TFunction,
  constraint10: {
    start_date_name: string | undefined;
    stop_date_name: string | undefined;
  }
): ErrorMessages => {
  const errorMessages: ErrorMessages = {
    start_date_name: [],
    stop_date_name: [],
  };
  const startDate =
    constraint10.start_date_name &&
    utils.stringToDate(constraint10.start_date_name);
  const stopDate =
    constraint10.stop_date_name &&
    utils.stringToDate(constraint10.stop_date_name);
  if (!startDate)
    errorMessages.start_date_name.push(
      t("{{arg0}}の形式が正しくありません", { arg0: t("開始日") })
    );
  if (!stopDate)
    errorMessages.stop_date_name.push(
      t("{{arg0}}の形式が正しくありません", { arg0: t("終了日") })
    );
  if (startDate && stopDate && startDate > stopDate) {
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
