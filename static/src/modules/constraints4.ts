import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";
import { TFunction } from "react-i18next";

import * as utils from "../utils";

import { RootState } from "./store";

export const Constraint4 = t.type({
  id: t.number,
  is_enabled: t.boolean,
  kinmu_id: t.number,
  max_number_of_assignments: t.number,
  member_id: t.number,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Constraint4 = t.TypeOf<typeof Constraint4>;

export const minOfConstraint4MaxNumberOfAssignments = 0;

export const adapter = createEntityAdapter<Constraint4>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.constraints4
);

const constraints4 = createSlice({
  initialState: adapter.getInitialState(),
  name: "constraints4",
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        member_id: number;
        kinmu_id: number;
        max_number_of_assignments: number;
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

export const { add, update, remove } = constraints4.actions;

export const { reducer } = constraints4;

type ErrorMessages = utils.ErrorMessages<"max_number_of_assignments">;

export const getErrorMessages = (
  t: TFunction,
  constraint4: { max_number_of_assignments: number }
): ErrorMessages => {
  const errorMessages: ErrorMessages = {
    max_number_of_assignments: [],
  };
  if (isNaN(constraint4.max_number_of_assignments))
    errorMessages.max_number_of_assignments.push(
      t("{{arg0}}の形式が正しくありません", { arg0: t("勤務割り当て数上限") })
    );
  return errorMessages;
};
