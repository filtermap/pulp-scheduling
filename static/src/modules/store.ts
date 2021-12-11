import { configureStore } from "@reduxjs/toolkit";
import undoable from "redux-undo";
import * as all from "./all";

const reducer = undoable(all.reducer);

export type RootState = ReturnType<typeof reducer>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const createStore = (preloadedState: RootState) =>
  configureStore({
    reducer,
    preloadedState,
  });

export type AppDispatch = ReturnType<typeof createStore>["dispatch"];
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;
