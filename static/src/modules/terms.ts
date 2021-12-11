const CREATE_TERM = "CREATE_TERM";
const UPDATE_TERM_IS_ENABLED = "UPDATE_TERM_IS_ENABLED";
const UPDATE_TERM_START_DATE_NAME = "UPDATE_TERM_START_DATE_NAME";
const UPDATE_TERM_STOP_DATE_NAME = "UPDATE_TERM_STOP_DATE_NAME";

export type Term = {
  id: number;
  is_enabled: boolean;
  start_date_name: string;
  stop_date_name: string;
};

type CreateTerm = {
  type: typeof CREATE_TERM;
  is_enabled: boolean;
  start_date_name: string;
  stop_date_name: string;
};

type UpdateTermIsEnabled = {
  type: typeof UPDATE_TERM_IS_ENABLED;
  id: number;
  is_enabled: boolean;
};

type UpdateTermStartDateName = {
  type: typeof UPDATE_TERM_START_DATE_NAME;
  id: number;
  start_date_name: string;
};

type UpdateTermStopDateName = {
  type: typeof UPDATE_TERM_STOP_DATE_NAME;
  id: number;
  stop_date_name: string;
};

type Action =
  | CreateTerm
  | UpdateTermIsEnabled
  | UpdateTermStartDateName
  | UpdateTermStopDateName;

export function createTerm(
  is_enabled: boolean,
  start_date_name: string,
  stop_date_name: string
): CreateTerm {
  return {
    is_enabled,
    start_date_name,
    stop_date_name,
    type: CREATE_TERM,
  };
}

export function updateTermIsEnabled(
  id: number,
  is_enabled: boolean
): UpdateTermIsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_TERM_IS_ENABLED,
  };
}

export function updateTermStartDateName(
  id: number,
  start_date_name: string
): UpdateTermStartDateName {
  return {
    id,
    start_date_name,
    type: UPDATE_TERM_START_DATE_NAME,
  };
}

export function updateTermStopDateName(
  id: number,
  stop_date_name: string
): UpdateTermStopDateName {
  return {
    id,
    stop_date_name,
    type: UPDATE_TERM_STOP_DATE_NAME,
  };
}

export type State = Term[];

const initialState: State = [];

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_TERM:
      return state.concat({
        id: Math.max(0, ...state.map(({ id }) => id)) + 1,
        is_enabled: action.is_enabled,
        start_date_name: action.start_date_name,
        stop_date_name: action.stop_date_name,
      });
    case UPDATE_TERM_IS_ENABLED:
      return state.map((term) => {
        if (term.id !== action.id) {
          return term;
        }
        return { ...term, is_enabled: action.is_enabled };
      });
    case UPDATE_TERM_START_DATE_NAME:
      return state.map((term) => {
        if (term.id !== action.id) {
          return term;
        }
        return { ...term, start_date_name: action.start_date_name };
      });
    case UPDATE_TERM_STOP_DATE_NAME:
      return state.map((term) => {
        if (term.id !== action.id) {
          return term;
        }
        return { ...term, stop_date_name: action.stop_date_name };
      });
  }
  return state;
}
