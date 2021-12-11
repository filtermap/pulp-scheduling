const CREATE_CONSTRAINT9 = "CREATE_CONSTRAINT9";
const UPDATE_CONSTRAINT9_IS_ENABLED = "UPDATE_CONSTRAINT9_IS_ENABLED";
const UPDATE_CONSTRAINT9_MEMBER_ID = "UPDATE_CONSTRAINT9_MEMBER_ID";
const UPDATE_CONSTRAINT9_START_DATE_NAME = "UPDATE_CONSTRAINT9_START_DATE_NAME";
const UPDATE_CONSTRAINT9_STOP_DATE_NAME = "UPDATE_CONSTRAINT9_STOP_DATE_NAME";
const UPDATE_CONSTRAINT9_KINMU_ID = "UPDATE_CONSTRAINT9_KINMU_ID";
const DELETE_CONSTRAINT9 = "DELETE_CONSTRAINT9";

export type Constraint9 = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  member_id: number;
  start_date_name: string;
  stop_date_name: string;
  kinmu_id: number;
};

type CreateConstraint9 = {
  type: typeof CREATE_CONSTRAINT9;
  term_id: number;
  is_enabled: boolean;
  member_id: number;
  start_date_name: string;
  stop_date_name: string;
  kinmu_id: number;
};

type UpdateConstraint9IsEnabled = {
  type: typeof UPDATE_CONSTRAINT9_IS_ENABLED;
  id: number;
  is_enabled: boolean;
};

type UpdateConstraint9MemberId = {
  type: typeof UPDATE_CONSTRAINT9_MEMBER_ID;
  id: number;
  member_id: number;
};

type UpdateConstraint9StartDateName = {
  type: typeof UPDATE_CONSTRAINT9_START_DATE_NAME;
  id: number;
  start_date_name: string;
};

type UpdateConstraint9StopDateName = {
  type: typeof UPDATE_CONSTRAINT9_STOP_DATE_NAME;
  id: number;
  stop_date_name: string;
};

type UpdateConstraint9KinmuId = {
  type: typeof UPDATE_CONSTRAINT9_KINMU_ID;
  id: number;
  kinmu_id: number;
};

type DeleteConstraint9 = {
  type: typeof DELETE_CONSTRAINT9;
  id: number;
};

type Action =
  | CreateConstraint9
  | UpdateConstraint9IsEnabled
  | UpdateConstraint9MemberId
  | UpdateConstraint9StartDateName
  | UpdateConstraint9StopDateName
  | UpdateConstraint9KinmuId
  | DeleteConstraint9;

export function createConstraint9(
  term_id: number,
  is_enabled: boolean,
  member_id: number,
  start_date_name: string,
  stop_date_name: string,
  kinmu_id: number
): CreateConstraint9 {
  return {
    term_id,
    is_enabled,
    kinmu_id,
    member_id,
    start_date_name,
    stop_date_name,
    type: CREATE_CONSTRAINT9,
  };
}

export function updateConstraint9IsEnabled(
  id: number,
  is_enabled: boolean
): UpdateConstraint9IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_CONSTRAINT9_IS_ENABLED,
  };
}

export function updateConstraint9MemberId(
  id: number,
  member_id: number
): UpdateConstraint9MemberId {
  return {
    id,
    member_id,
    type: UPDATE_CONSTRAINT9_MEMBER_ID,
  };
}

export function updateConstraint9StartDateName(
  id: number,
  start_date_name: string
): UpdateConstraint9StartDateName {
  return {
    id,
    start_date_name,
    type: UPDATE_CONSTRAINT9_START_DATE_NAME,
  };
}

export function updateConstraint9StopDateName(
  id: number,
  stop_date_name: string
): UpdateConstraint9StopDateName {
  return {
    id,
    stop_date_name,
    type: UPDATE_CONSTRAINT9_STOP_DATE_NAME,
  };
}

export function updateConstraint9KinmuId(
  id: number,
  kinmu_id: number
): UpdateConstraint9KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_CONSTRAINT9_KINMU_ID,
  };
}

export function deleteConstraint9(id: number): DeleteConstraint9 {
  return {
    id,
    type: DELETE_CONSTRAINT9,
  };
}

export type State = Constraint9[];

const initialState: State = [];

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_CONSTRAINT9:
      return state.concat({
        id: Math.max(0, ...state.map((c) => c.id)) + 1,
        term_id: action.term_id,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        member_id: action.member_id,
        start_date_name: action.start_date_name,
        stop_date_name: action.stop_date_name,
      });
    case UPDATE_CONSTRAINT9_IS_ENABLED:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, is_enabled: action.is_enabled };
      });
    case UPDATE_CONSTRAINT9_MEMBER_ID:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, member_id: action.member_id };
      });
    case UPDATE_CONSTRAINT9_START_DATE_NAME:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, start_date_name: action.start_date_name };
      });
    case UPDATE_CONSTRAINT9_STOP_DATE_NAME:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, stop_date_name: action.stop_date_name };
      });
    case UPDATE_CONSTRAINT9_KINMU_ID:
      return state.map((c) => {
        if (c.id !== action.id) {
          return c;
        }
        return { ...c, kinmu_id: action.kinmu_id };
      });
    case DELETE_CONSTRAINT9:
      return state.filter((c) => c.id !== action.id);
  }
  return state;
}
