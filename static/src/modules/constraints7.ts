const CREATE_CONSTRAINT7 = "CREATE_CONSTRAINT7";
const UPDATE_CONSTRAINT7_IS_ENABLED = "UPDATE_CONSTRAINT7_IS_ENABLED";
const UPDATE_CONSTRAINT7_KINMU_ID = "UPDATE_CONSTRAINT7_KINMU_ID";
const UPDATE_CONSTRAINT7_MIN_NUMBER_OF_DAYS =
  "UPDATE_CONSTRAINT7_MIN_NUMBER_OF_DAYS";
const DELETE_CONSTRAINT7 = "DELETE_CONSTRAINT7";

export type Constraint7 = {
  id: number;
  is_enabled: boolean;
  kinmu_id: number;
  min_number_of_days: number;
};

export const minOfConstraint7MinNumberOfDays = 2;

type CreateConstraint7 = {
  type: typeof CREATE_CONSTRAINT7;
  is_enabled: boolean;
  kinmu_id: number;
  min_number_of_days: number;
};

type UpdateConstraint7IsEnabled = {
  type: typeof UPDATE_CONSTRAINT7_IS_ENABLED;
  id: number;
  is_enabled: boolean;
};

type UpdateConstraint7KinmuId = {
  type: typeof UPDATE_CONSTRAINT7_KINMU_ID;
  id: number;
  kinmu_id: number;
};

type UpdateConstraint7MinNumberOfDays = {
  type: typeof UPDATE_CONSTRAINT7_MIN_NUMBER_OF_DAYS;
  id: number;
  min_number_of_days: number;
};

type DeleteConstraint7 = {
  type: typeof DELETE_CONSTRAINT7;
  id: number;
};

type Action =
  | CreateConstraint7
  | UpdateConstraint7IsEnabled
  | UpdateConstraint7KinmuId
  | UpdateConstraint7MinNumberOfDays
  | DeleteConstraint7;

export function createConstraint7(
  is_enabled: boolean,
  kinmu_id: number,
  min_number_of_days: number
): CreateConstraint7 {
  return {
    is_enabled,
    kinmu_id,
    min_number_of_days,
    type: CREATE_CONSTRAINT7,
  };
}

export function updateConstraint7IsEnabled(
  id: number,
  is_enabled: boolean
): UpdateConstraint7IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_CONSTRAINT7_IS_ENABLED,
  };
}

export function updateConstraint7KinmuId(
  id: number,
  kinmu_id: number
): UpdateConstraint7KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_CONSTRAINT7_KINMU_ID,
  };
}

export function updateConstraint7MinNumberOfDays(
  id: number,
  min_number_of_days: number
): UpdateConstraint7MinNumberOfDays {
  return {
    id,
    min_number_of_days,
    type: UPDATE_CONSTRAINT7_MIN_NUMBER_OF_DAYS,
  };
}

export function deleteConstraint7(id: number): DeleteConstraint7 {
  return {
    id,
    type: DELETE_CONSTRAINT7,
  };
}

export type State = Constraint7[];

const initialState: State = [];

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_CONSTRAINT7:
      return state.concat({
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        min_number_of_days: action.min_number_of_days,
      });
    case UPDATE_CONSTRAINT7_IS_ENABLED:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, is_enabled: action.is_enabled };
      });
    case UPDATE_CONSTRAINT7_KINMU_ID:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, kinmu_id: action.kinmu_id };
      });
    case UPDATE_CONSTRAINT7_MIN_NUMBER_OF_DAYS:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, min_number_of_days: action.min_number_of_days };
      });
    case DELETE_CONSTRAINT7:
      return state.filter((c) => c.id !== action.id);
  }
  return state;
}
