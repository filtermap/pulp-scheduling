import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";
import { TFunction } from "react-i18next";

import * as utils from "../utils";

import { RootState } from "./store";
import * as terms from "./terms";

export const Constraint9 = t.type({
  id: t.number,
  is_enabled: t.boolean,
  kinmu_id: t.number,
  member_id: t.number,
  start_date_name: t.string,
  stop_date_name: t.string,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint9 = t.TypeOf<typeof Constraint9>;

export const adapter = createEntityAdapter<Constraint9>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints9
);

const constraints9 = createSlice({
  initialState: adapter.getInitialState(),
  name: "constraints9",
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

export const { add, update, remove } = constraints9.actions;

export const { reducer } = constraints9;

type ErrorMessages = utils.ErrorMessages<"start_date_name" | "stop_date_name">;

export const getErrorMessages = (
  t: TFunction,
  sample: {
    constraint9: {
      start_date_name: string | undefined;
      stop_date_name: string | undefined;
    };
    term: terms.Term | undefined;
  }
): ErrorMessages => {
  const errorMessages: ErrorMessages = {
    start_date_name: [],
    stop_date_name: [],
  };
  const startDate =
    sample.constraint9.start_date_name &&
    utils.stringToDate(sample.constraint9.start_date_name);
  const stopDate =
    sample.constraint9.stop_date_name &&
    utils.stringToDate(sample.constraint9.stop_date_name);
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
  const termStartDate =
    sample.term && utils.stringToDate(sample.term.start_date_name);
  if (startDate && termStartDate && startDate < termStartDate)
    errorMessages.start_date_name.push(
      t("{{arg0}}には期間の開始日（{{arg1}}）以降の日付を入力してください", {
        arg0: t("開始日"),
        arg1: sample.term?.start_date_name,
      })
    );
  const termStopDate =
    sample.term && utils.stringToDate(sample.term.stop_date_name);
  if (stopDate && termStopDate && termStopDate < stopDate)
    errorMessages.stop_date_name.push(
      t("{{arg0}}には期間の終了日（{{arg1}}）以前の日付を入力してください", {
        arg0: t("終了日"),
        arg1: sample.term?.stop_date_name,
      })
    );
  return errorMessages;
};
