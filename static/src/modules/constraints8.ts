const CREATE_CONSTRAINT8 = "CREATE_CONSTRAINT8";
const UPDATE_CONSTRAINT8_IS_ENABLED = "UPDATE_CONSTRAINT8_IS_ENABLED";
const UPDATE_CONSTRAINT8_KINMU_ID = "UPDATE_CONSTRAINT8_KINMU_ID";
const UPDATE_CONSTRAINT8_MAX_NUMBER_OF_DAYS =
  "UPDATE_CONSTRAINT8_MAX_NUMBER_OF_DAYS";
const DELETE_CONSTRAINT8 = "DELETE_CONSTRAINT8";

export type Constraint8 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  kinmu_id: number;
  max_number_of_days: number;
};

export const minOfConstraint8MaxNumberOfDays = 1;

type CreateConstraint8 = {
  type: typeof CREATE_CONSTRAINT8;
  term_id: number;
  is_enabled: boolean;
  kinmu_id: number;
  max_number_of_days: number;
};

type UpdateConstraint8IsEnabled = {
  type: typeof UPDATE_CONSTRAINT8_IS_ENABLED;
  id: number;
  is_enabled: boolean;
};

type UpdateConstraint8KinmuId = {
  type: typeof UPDATE_CONSTRAINT8_KINMU_ID;
  id: number;
  kinmu_id: number;
};

type UpdateConstraint8MaxNumberOfDays = {
  type: typeof UPDATE_CONSTRAINT8_MAX_NUMBER_OF_DAYS;
  id: number;
  max_number_of_days: number;
};

type DeleteConstraint8 = {
  type: typeof DELETE_CONSTRAINT8;
  id: number;
};

type Action =
  | CreateConstraint8
  | UpdateConstraint8IsEnabled
  | UpdateConstraint8KinmuId
  | UpdateConstraint8MaxNumberOfDays
  | DeleteConstraint8;

export function createConstraint8(
  term_id: number,
  is_enabled: boolean,
  kinmu_id: number,
  max_number_of_days: number
): CreateConstraint8 {
  return {
    term_id,
    is_enabled,
    kinmu_id,
    max_number_of_days,
    type: CREATE_CONSTRAINT8,
  };
}

export function updateConstraint8IsEnabled(
  id: number,
  is_enabled: boolean
): UpdateConstraint8IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_CONSTRAINT8_IS_ENABLED,
  };
}

export function updateConstraint8KinmuId(
  id: number,
  kinmu_id: number
): UpdateConstraint8KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_CONSTRAINT8_KINMU_ID,
  };
}

export function updateConstraint8MaxNumberOfDays(
  id: number,
  max_number_of_days: number
): UpdateConstraint8MaxNumberOfDays {
  return {
    id,
    max_number_of_days,
    type: UPDATE_CONSTRAINT8_MAX_NUMBER_OF_DAYS,
  };
}

export function deleteConstraint8(id: number): DeleteConstraint8 {
  return {
    id,
    type: DELETE_CONSTRAINT8,
  };
}

export type State = Constraint8[];

const initialState: State = [];

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_CONSTRAINT8:
      return state.concat({
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        term_id: action.term_id,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        max_number_of_days: action.max_number_of_days,
      });
    case UPDATE_CONSTRAINT8_IS_ENABLED:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, is_enabled: action.is_enabled };
      });
    case UPDATE_CONSTRAINT8_KINMU_ID:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, kinmu_id: action.kinmu_id };
      });
    case UPDATE_CONSTRAINT8_MAX_NUMBER_OF_DAYS:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, max_number_of_days: action.max_number_of_days };
      });
    case DELETE_CONSTRAINT8:
      return state.filter((c) => c.id !== action.id);
  }
  return state;
}
