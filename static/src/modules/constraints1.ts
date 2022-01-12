import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";
import { TFunction } from "react-i18next";

import * as utils from "../utils";

import { RootState } from "./store";

export const Constraint1 = t.type({
  group_id: t.number,
  id: t.number,
  is_enabled: t.boolean,
  kinmu_id: t.number,
  min_number_of_assignments: t.number,
  start_date_name: t.string,
  stop_date_name: t.string,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint1 = t.TypeOf<typeof Constraint1>;

export const minOfConstraint1MinNumberOfAssignments = 1;

export const adapter = createEntityAdapter<Constraint1>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints1
);

const constraints1 = createSlice({
  initialState: adapter.getInitialState(),
  name: "constraints1",
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        start_date_name: string;
        stop_date_name: string;
        kinmu_id: number;
        group_id: number;
        min_number_of_assignments: number;
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

export const { add, update, remove } = constraints1.actions;

export const { reducer } = constraints1;

type ErrorMessages = utils.ErrorMessages<
  "start_date_name" | "stop_date_name" | "min_number_of_assignments"
>;

export const getErrorMessages = (
  t: TFunction,
  constraint1: {
    start_date_name: string | undefined;
    stop_date_name: string | undefined;
    min_number_of_assignments: number;
  }
): ErrorMessages => {
  const errorMessages: ErrorMessages = {
    min_number_of_assignments: [],
    start_date_name: [],
    stop_date_name: [],
  };
  const startDate =
    constraint1.start_date_name &&
    utils.stringToDate(constraint1.start_date_name);
  const stopDate =
    constraint1.stop_date_name &&
    utils.stringToDate(constraint1.stop_date_name);
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
  if (isNaN(constraint1.min_number_of_assignments))
    errorMessages.min_number_of_assignments.push(
      t("{{arg0}}の形式が正しくありません", { arg0: t("割り当て職員数下限") })
    );
  return errorMessages;
};
