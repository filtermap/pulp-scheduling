import { configureStore } from "@reduxjs/toolkit";
import undoable from "redux-undo";
import * as all from "./all";

const reducer = undoable(all.reducer);

export type RootState = ReturnType<typeof reducer>;

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const store = configureStore({
  reducer,
});

export type AppDispatch = typeof store.dispatch;
// export type AppThunk<ReturnType = void> = ThunkAction<
//   ReturnType,
//   RootState,
//   unknown,
//   Action<string>
// >;
