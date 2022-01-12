import {
  createEntityAdapter,
  createSlice,
  PayloadAction,
} from "@reduxjs/toolkit";
import * as t from "io-ts";
import { TFunction } from "react-i18next";

import * as utils from "../utils";

import { RootState } from "./store";

export const Kinmu = t.type({
  id: t.number,
  is_enabled: t.boolean,
  name: t.string,
  term_id: t.number,
});

// eslint-disable-next-line @typescript-eslint/no-redeclare
export type Kinmu = t.TypeOf<typeof Kinmu>;

export const adapter = createEntityAdapter<Kinmu>();

export const selectors = adapter.getSelectors<RootState>(
  (state) => state.present.kinmus
);

const kinmus = createSlice({
  initialState: adapter.getInitialState(),
  name: "kinmus",
  reducers: {
    add: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        name: string;
      }>
    ) => {
      adapter.addOne(state, {
        ...action.payload,
        id: Math.max(0, ...(state.ids as number[])) + 1,
      });
    },
    update: adapter.updateOne,
  },
});

export const { add, update } = kinmus.actions;

export const { reducer } = kinmus;

type ErrorMessages = utils.ErrorMessages<"name">;

export const getErrorMessages = (
  t: TFunction,
  kinmu: { name: string }
): ErrorMessages => {
  const errorMessages: ErrorMessages = {
    name: [],
  };
  if (kinmu.name === "")
    errorMessages.name.push(
      t("{{arg0}}を入力してください", { arg0: t("勤務名") })
    );
  return errorMessages;
};
