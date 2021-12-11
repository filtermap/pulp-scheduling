const CREATE_CONSTRAINT1 = "CREATE_CONSTRAINT1";
const UPDATE_CONSTRAINT1_IS_ENABLED = "UPDATE_CONSTRAINT1_IS_ENABLED";
const UPDATE_CONSTRAINT1_START_DATE_NAME = "UPDATE_CONSTRAINT1_START_DATE_NAME";
const UPDATE_CONSTRAINT1_STOP_DATE_NAME = "UPDATE_CONSTRAINT1_STOP_DATE_NAME";
const UPDATE_CONSTRAINT1_KINMU_ID = "UPDATE_CONSTRAINT1_KINMU_ID";
const UPDATE_CONSTRAINT1_GROUP_ID = "UPDATE_CONSTRAINT1_GROUP_ID";
const UPDATE_CONSTRAINT1_MIN_NUMBER_OF_ASSIGNMENTS =
  "UPDATE_CONSTRAINT1_MIN_NUMBER_OF_ASSIGNMENTS";
const DELETE_CONSTRAINT1 = "DELETE_CONSTRAINT1";

export type Constraint1 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  start_date_name: string;
  stop_date_name: string;
  kinmu_id: number;
  group_id: number;
  min_number_of_assignments: number;
};

export const minOfConstraint1MinNumberOfAssignments = 1;

type CreateConstraint1 = {
  type: typeof CREATE_CONSTRAINT1;
  is_enabled: boolean;
  start_date_name: string;
  stop_date_name: string;
  kinmu_id: number;
  group_id: number;
  min_number_of_assignments: number;
};

type UpdateConstraint1IsEnabled = {
  type: typeof UPDATE_CONSTRAINT1_IS_ENABLED;
  id: number;
  is_enabled: boolean;
};

type UpdateConstraint1StartDateName = {
  type: typeof UPDATE_CONSTRAINT1_START_DATE_NAME;
  id: number;
  start_date_name: string;
};

type UpdateConstraint1StopDateName = {
  type: typeof UPDATE_CONSTRAINT1_STOP_DATE_NAME;
  id: number;
  stop_date_name: string;
};

type UpdateConstraint1KinmuId = {
  type: typeof UPDATE_CONSTRAINT1_KINMU_ID;
  id: number;
  kinmu_id: number;
};

type UpdateConstraint1GroupId = {
  type: typeof UPDATE_CONSTRAINT1_GROUP_ID;
  id: number;
  group_id: number;
};

type UpdateConstraint1MinNumberOfAssignments = {
  type: typeof UPDATE_CONSTRAINT1_MIN_NUMBER_OF_ASSIGNMENTS;
  id: number;
  min_number_of_assignments: number;
};

type DeleteConstraint1 = {
  type: typeof DELETE_CONSTRAINT1;
  id: number;
};

type Action =
  | CreateConstraint1
  | UpdateConstraint1IsEnabled
  | UpdateConstraint1StartDateName
  | UpdateConstraint1StopDateName
  | UpdateConstraint1KinmuId
  | UpdateConstraint1GroupId
  | UpdateConstraint1MinNumberOfAssignments
  | DeleteConstraint1;

export function createConstraint1(
  is_enabled: boolean,
  start_date_name: string,
  stop_date_name: string,
  kinmu_id: number,
  group_id: number,
  min_number_of_assignments: number
): CreateConstraint1 {
  return {
    group_id,
    is_enabled,
    kinmu_id,
    min_number_of_assignments,
    start_date_name,
    stop_date_name,
    type: CREATE_CONSTRAINT1,
  };
}

export function updateConstraint1IsEnabled(
  id: number,
  is_enabled: boolean
): UpdateConstraint1IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_CONSTRAINT1_IS_ENABLED,
  };
}

export function updateConstraint1StartDateName(
  id: number,
  start_date_name: string
): UpdateConstraint1StartDateName {
  return {
    id,
    start_date_name,
    type: UPDATE_CONSTRAINT1_START_DATE_NAME,
  };
}

export function updateConstraint1StopDateName(
  id: number,
  stop_date_name: string
): UpdateConstraint1StopDateName {
  return {
    id,
    stop_date_name,
    type: UPDATE_CONSTRAINT1_STOP_DATE_NAME,
  };
}

export function updateConstraint1KinmuId(
  id: number,
  kinmu_id: number
): UpdateConstraint1KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_CONSTRAINT1_KINMU_ID,
  };
}

export function updateConstraint1GroupId(
  id: number,
  group_id: number
): UpdateConstraint1GroupId {
  return {
    group_id,
    id,
    type: UPDATE_CONSTRAINT1_GROUP_ID,
  };
}

export function updateConstraint1MinNumberOfAssignments(
  id: number,
  min_number_of_assignments: number
): UpdateConstraint1MinNumberOfAssignments {
  return {
    id,
    min_number_of_assignments,
    type: UPDATE_CONSTRAINT1_MIN_NUMBER_OF_ASSIGNMENTS,
  };
}

export function deleteConstraint1(id: number): DeleteConstraint1 {
  return {
    id,
    type: DELETE_CONSTRAINT1,
  };
}

export type State = Constraint1[];

const initialState: State = [];

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_CONSTRAINT1:
      return state.concat({
        group_id: action.group_id,
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        min_number_of_assignments: action.min_number_of_assignments,
        start_date_name: action.start_date_name,
        stop_date_name: action.stop_date_name,
      });
    case UPDATE_CONSTRAINT1_IS_ENABLED:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, is_enabled: action.is_enabled };
      });
    case UPDATE_CONSTRAINT1_START_DATE_NAME:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, start_date_name: action.start_date_name };
      });
    case UPDATE_CONSTRAINT1_STOP_DATE_NAME:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, stop_date_name: action.stop_date_name };
      });
    case UPDATE_CONSTRAINT1_KINMU_ID:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, kinmu_id: action.kinmu_id };
      });
    case UPDATE_CONSTRAINT1_GROUP_ID:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, group_id: action.group_id };
      });
    case UPDATE_CONSTRAINT1_MIN_NUMBER_OF_ASSIGNMENTS:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return {
          ...c,
          min_number_of_assignments: action.min_number_of_assignments,
        };
      });
    case DELETE_CONSTRAINT1:
      return state.filter((c) => c.id !== action.id);
  }
  return state;
}
