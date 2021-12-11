const CREATE_CONSTRAINT5 = "CREATE_CONSTRAINT5";
const UPDATE_CONSTRAINT5_IS_ENABLED = "UPDATE_CONSTRAINT5_IS_ENABLED";
const UPDATE_CONSTRAINT5_KINMU_ID = "UPDATE_CONSTRAINT5_KINMU_ID";
const UPDATE_CONSTRAINT5_MIN_NUMBER_OF_DAYS =
  "UPDATE_CONSTRAINT5_MIN_NUMBER_OF_DAYS";
const DELETE_CONSTRAINT5 = "DELETE_CONSTRAINT5";

export type Constraint5 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  kinmu_id: number;
  min_number_of_days: number;
};

export const minOfConstraint5MinNumberOfDays = 2;

type CreateConstraint5 = {
  type: typeof CREATE_CONSTRAINT5;
  term_id: number;
  is_enabled: boolean;
  kinmu_id: number;
  min_number_of_days: number;
};

type UpdateConstraint5IsEnabled = {
  type: typeof UPDATE_CONSTRAINT5_IS_ENABLED;
  id: number;
  is_enabled: boolean;
};

type UpdateConstraint5KinmuId = {
  type: typeof UPDATE_CONSTRAINT5_KINMU_ID;
  id: number;
  kinmu_id: number;
};

type UpdateConstraint5MinNumberOfDays = {
  type: typeof UPDATE_CONSTRAINT5_MIN_NUMBER_OF_DAYS;
  id: number;
  min_number_of_days: number;
};

type DeleteConstraint5 = {
  type: typeof DELETE_CONSTRAINT5;
  id: number;
};

type Action =
  | CreateConstraint5
  | UpdateConstraint5IsEnabled
  | UpdateConstraint5KinmuId
  | UpdateConstraint5MinNumberOfDays
  | DeleteConstraint5;

export function createConstraint5(
  term_id: number,
  is_enabled: boolean,
  kinmu_id: number,
  min_number_of_days: number
): CreateConstraint5 {
  return {
    term_id,
    is_enabled,
    kinmu_id,
    min_number_of_days,
    type: CREATE_CONSTRAINT5,
  };
}

export function updateConstraint5IsEnabled(
  id: number,
  is_enabled: boolean
): UpdateConstraint5IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_CONSTRAINT5_IS_ENABLED,
  };
}

export function updateConstraint5KinmuId(
  id: number,
  kinmu_id: number
): UpdateConstraint5KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_CONSTRAINT5_KINMU_ID,
  };
}

export function updateConstraint5MinNumberOfDays(
  id: number,
  min_number_of_days: number
): UpdateConstraint5MinNumberOfDays {
  return {
    id,
    min_number_of_days,
    type: UPDATE_CONSTRAINT5_MIN_NUMBER_OF_DAYS,
  };
}

export function deleteConstraint5(id: number): DeleteConstraint5 {
  return {
    id,
    type: DELETE_CONSTRAINT5,
  };
}

export type State = Constraint5[];

const initialState: State = [];

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_CONSTRAINT5:
      return state.concat({
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        term_id: action.term_id,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        min_number_of_days: action.min_number_of_days,
      });
    case UPDATE_CONSTRAINT5_IS_ENABLED:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, is_enabled: action.is_enabled };
      });
    case UPDATE_CONSTRAINT5_KINMU_ID:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, kinmu_id: action.kinmu_id };
      });
    case UPDATE_CONSTRAINT5_MIN_NUMBER_OF_DAYS:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, min_number_of_days: action.min_number_of_days };
      });
    case DELETE_CONSTRAINT5:
      return state.filter((c) => c.id !== action.id);
  }
  return state;
}
