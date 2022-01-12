import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";
import { TFunction } from "react-i18next";

import * as utils from "../utils";

import { RootState } from "./store";

export const Constraint7 = t.type({
  id: t.number,
  is_enabled: t.boolean,
  kinmu_id: t.number,
  min_number_of_days: t.number,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint7 = t.TypeOf<typeof Constraint7>;

export const minOfConstraint7MinNumberOfDays = 2;

export const adapter = createEntityAdapter<Constraint7>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints7
);

const constraints7 = createSlice({
  initialState: adapter.getInitialState(),
  name: "constraints7",
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        kinmu_id: number;
        min_number_of_days: number;
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

export const { add, update, remove } = constraints7.actions;

export const { reducer } = constraints7;

type ErrorMessages = utils.ErrorMessages<"min_number_of_days">;

export const getErrorMessages = (
  t: TFunction,
  constraint7: { min_number_of_days: number }
): ErrorMessages => {
  const errorMessages: ErrorMessages = {
    min_number_of_days: [],
  };
  if (isNaN(constraint7.min_number_of_days))
    errorMessages.min_number_of_days.push(
      t("{{arg0}}の形式が正しくありません", { arg0: t("間隔日数下限") })
    );
  return errorMessages;
};
