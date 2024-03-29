import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";
import { TFunction } from "react-i18next";

import * as utils from "../utils";

import { RootState } from "./store";

export const Constraint8 = t.type({
  id: t.number,
  is_enabled: t.boolean,
  kinmu_id: t.number,
  max_number_of_days: t.number,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint8 = t.TypeOf<typeof Constraint8>;

export const minOfConstraint8MaxNumberOfDays = 1;

export const adapter = createEntityAdapter<Constraint8>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints8
);

const constraints8 = createSlice({
  initialState: adapter.getInitialState(),
  name: "constraints8",
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        kinmu_id: number;
        max_number_of_days: number;
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

export const { add, update, remove } = constraints8.actions;

export const { reducer } = constraints8;

type ErrorMessages = utils.ErrorMessages<"max_number_of_days">;

export const getErrorMessages = (
  t: TFunction,
  sample: { constraint8: { max_number_of_days: number } }
): ErrorMessages => {
  const errorMessages: ErrorMessages = {
    max_number_of_days: [],
  };
  if (isNaN(sample.constraint8.max_number_of_days))
    errorMessages.max_number_of_days.push(
      t("{{arg0}}の形式が正しくありません", { arg0: t("間隔日数上限") })
    );
  return errorMessages;
};
