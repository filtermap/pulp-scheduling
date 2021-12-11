const CREATE_CONSTRAINT6 = "CREATE_CONSTRAINT6";
const UPDATE_CONSTRAINT6_IS_ENABLED = "UPDATE_CONSTRAINT6_IS_ENABLED";
const UPDATE_CONSTRAINT6_KINMU_ID = "UPDATE_CONSTRAINT6_KINMU_ID";
const UPDATE_CONSTRAINT6_MAX_NUMBER_OF_DAYS =
  "UPDATE_CONSTRAINT6_MAX_NUMBER_OF_DAYS";
const DELETE_CONSTRAINT6 = "DELETE_CONSTRAINT6";

export type Constraint6 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  kinmu_id: number;
  max_number_of_days: number;
};

export const minOfConstraint6MaxNumberOfDays = 2;

type CreateConstraint6 = {
  type: typeof CREATE_CONSTRAINT6;
  term_id: number;
  is_enabled: boolean;
  kinmu_id: number;
  max_number_of_days: number;
};

type UpdateConstraint6IsEnabled = {
  type: typeof UPDATE_CONSTRAINT6_IS_ENABLED;
  id: number;
  is_enabled: boolean;
};

type UpdateConstraint6KinmuId = {
  type: typeof UPDATE_CONSTRAINT6_KINMU_ID;
  id: number;
  kinmu_id: number;
};

type UpdateConstraint6MaxNumberOfDays = {
  type: typeof UPDATE_CONSTRAINT6_MAX_NUMBER_OF_DAYS;
  id: number;
  max_number_of_days: number;
};

type DeleteConstraint6 = {
  type: typeof DELETE_CONSTRAINT6;
  id: number;
};

type Action =
  | CreateConstraint6
  | UpdateConstraint6IsEnabled
  | UpdateConstraint6KinmuId
  | UpdateConstraint6MaxNumberOfDays
  | DeleteConstraint6;

export function createConstraint6(
  term_id: number,
  is_enabled: boolean,
  kinmu_id: number,
  max_number_of_days: number
): CreateConstraint6 {
  return {
    term_id,
    is_enabled,
    kinmu_id,
    max_number_of_days,
    type: CREATE_CONSTRAINT6,
  };
}

export function updateConstraint6IsEnabled(
  id: number,
  is_enabled: boolean
): UpdateConstraint6IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_CONSTRAINT6_IS_ENABLED,
  };
}

export function updateConstraint6KinmuId(
  id: number,
  kinmu_id: number
): UpdateConstraint6KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_CONSTRAINT6_KINMU_ID,
  };
}

export function updateConstraint6MaxNumberOfDays(
  id: number,
  max_number_of_days: number
): UpdateConstraint6MaxNumberOfDays {
  return {
    id,
    max_number_of_days,
    type: UPDATE_CONSTRAINT6_MAX_NUMBER_OF_DAYS,
  };
}

export function deleteConstraint6(id: number): DeleteConstraint6 {
  return {
    id,
    type: DELETE_CONSTRAINT6,
  };
}

export type State = Constraint6[];

const initialState: State = [];

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_CONSTRAINT6:
      return state.concat({
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        term_id: action.term_id,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        max_number_of_days: action.max_number_of_days,
      });
    case UPDATE_CONSTRAINT6_IS_ENABLED:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, is_enabled: action.is_enabled };
      });
    case UPDATE_CONSTRAINT6_KINMU_ID:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, kinmu_id: action.kinmu_id };
      });
    case UPDATE_CONSTRAINT6_MAX_NUMBER_OF_DAYS:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, max_number_of_days: action.max_number_of_days };
      });
    case DELETE_CONSTRAINT6:
      return state.filter((c) => c.id !== action.id);
  }
  return state;
}
