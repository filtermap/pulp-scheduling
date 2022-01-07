import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";
import { TFunction } from "react-i18next";

import { RootState } from "./store";

export const Constraint6 = t.type({
  id: t.number,
  is_enabled: t.boolean,
  kinmu_id: t.number,
  max_number_of_days: t.number,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint6 = t.TypeOf<typeof Constraint6>;

export const minOfConstraint6MaxNumberOfDays = 2;

export const adapter = createEntityAdapter<Constraint6>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints6
);

const constraints6 = createSlice({
  initialState: adapter.getInitialState(),
  name: "constraints6",
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

export const { add, update, remove } = constraints6.actions;

export const { reducer } = constraints6;

type ErrorMessages = {
  max_number_of_days: string[];
};

export const getErrorMessages = (
  t: TFunction,
  constraint6: { max_number_of_days: number }
): ErrorMessages => {
  const errorMessages: ErrorMessages = {
    max_number_of_days: [],
  };
  if (isNaN(constraint6.max_number_of_days))
    errorMessages.max_number_of_days.push(
      t("{{arg0}}の形式が正しくありません", { arg0: t("連続日数上限") })
    );
  return errorMessages;
};
