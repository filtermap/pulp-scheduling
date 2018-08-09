const CREATE_CONSTRAINT2 = 'CREATE_CONSTRAINT2'
const UPDATE_CONSTRAINT2_IS_ENABLED = 'UPDATE_CONSTRAINT2_IS_ENABLED'
const UPDATE_CONSTRAINT2_START_DATE_NAME = 'UPDATE_CONSTRAINT2_START_DATE_NAME'
const UPDATE_CONSTRAINT2_STOP_DATE_NAME = 'UPDATE_CONSTRAINT2_STOP_DATE_NAME'
const UPDATE_CONSTRAINT2_KINMU_ID = 'UPDATE_CONSTRAINT2_KINMU_ID'
const UPDATE_CONSTRAINT2_GROUP_ID = 'UPDATE_CONSTRAINT2_GROUP_ID'
const UPDATE_CONSTRAINT2_MAX_NUMBER_OF_ASSIGNMENTS = 'UPDATE_CONSTRAINT2_MAX_NUMBER_OF_ASSIGNMENTS'
const DELETE_CONSTRAINT2 = 'DELETE_CONSTRAINT2'

export type Constraint2 = {
  id: number
  is_enabled: boolean
  start_date_name: string
  stop_date_name: string
  kinmu_id: number
  group_id: number
  max_number_of_assignments: number
}

export const minOfConstraint2MaxNumberOfAssignments = 0

type CreateConstraint2 = {
  type: typeof CREATE_CONSTRAINT2
  is_enabled: boolean
  start_date_name: string
  stop_date_name: string
  kinmu_id: number
  group_id: number
  max_number_of_assignments: number
}

type UpdateConstraint2IsEnabled = {
  type: typeof UPDATE_CONSTRAINT2_IS_ENABLED
  id: number
  is_enabled: boolean
}

type UpdateConstraint2StartDateName = {
  type: typeof UPDATE_CONSTRAINT2_START_DATE_NAME
  id: number
  start_date_name: string
}

type UpdateConstraint2StopDateName = {
  type: typeof UPDATE_CONSTRAINT2_STOP_DATE_NAME
  id: number
  stop_date_name: string
}

type UpdateConstraint2KinmuId = {
  type: typeof UPDATE_CONSTRAINT2_KINMU_ID
  id: number
  kinmu_id: number
}

type UpdateConstraint2GroupId = {
  type: typeof UPDATE_CONSTRAINT2_GROUP_ID
  id: number
  group_id: number
}

type UpdateConstraint2MaxNumberOfAssignments = {
  type: typeof UPDATE_CONSTRAINT2_MAX_NUMBER_OF_ASSIGNMENTS
  id: number
  max_number_of_assignments: number
}

type DeleteConstraint2 = {
  type: typeof DELETE_CONSTRAINT2
  id: number
}

type Action =
  | CreateConstraint2
  | UpdateConstraint2IsEnabled
  | UpdateConstraint2StartDateName
  | UpdateConstraint2StopDateName
  | UpdateConstraint2KinmuId
  | UpdateConstraint2GroupId
  | UpdateConstraint2MaxNumberOfAssignments
  | DeleteConstraint2

export function createConstraint2(is_enabled: boolean, start_date_name: string, stop_date_name: string, kinmu_id: number, group_id: number, max_number_of_assignments: number): CreateConstraint2 {
  return {
    group_id,
    is_enabled,
    kinmu_id,
    max_number_of_assignments,
    start_date_name,
    stop_date_name,
    type: CREATE_CONSTRAINT2,
  }
}

export function updateConstraint2IsEnabled(id: number, is_enabled: boolean): UpdateConstraint2IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_CONSTRAINT2_IS_ENABLED,
  }
}

export function updateConstraint2StartDateName(id: number, start_date_name: string): UpdateConstraint2StartDateName {
  return {
    id,
    start_date_name,
    type: UPDATE_CONSTRAINT2_START_DATE_NAME,
  }
}

export function updateConstraint2StopDateName(id: number, stop_date_name: string): UpdateConstraint2StopDateName {
  return {
    id,
    stop_date_name,
    type: UPDATE_CONSTRAINT2_STOP_DATE_NAME,
  }
}

export function updateConstraint2KinmuId(id: number, kinmu_id: number): UpdateConstraint2KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_CONSTRAINT2_KINMU_ID,
  }
}

export function updateConstraint2GroupId(id: number, group_id: number): UpdateConstraint2GroupId {
  return {
    group_id,
    id,
    type: UPDATE_CONSTRAINT2_GROUP_ID,
  }
}

export function updateConstraint2MaxNumberOfAssignments(id: number, max_number_of_assignments: number): UpdateConstraint2MaxNumberOfAssignments {
  return {
    id,
    max_number_of_assignments,
    type: UPDATE_CONSTRAINT2_MAX_NUMBER_OF_ASSIGNMENTS,
  }
}

export function deleteConstraint2(id: number): DeleteConstraint2 {
  return {
    id,
    type: DELETE_CONSTRAINT2,
  }
}

export type State = Constraint2[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_CONSTRAINT2:
      return state.concat({
        group_id: action.group_id,
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        max_number_of_assignments: action.max_number_of_assignments,
        start_date_name: action.start_date_name,
        stop_date_name: action.stop_date_name,
      })
    case UPDATE_CONSTRAINT2_IS_ENABLED:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, is_enabled: action.is_enabled }
      })
    case UPDATE_CONSTRAINT2_START_DATE_NAME:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, start_date_name: action.start_date_name }
      })
    case UPDATE_CONSTRAINT2_STOP_DATE_NAME:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, stop_date_name: action.stop_date_name }
      })
    case UPDATE_CONSTRAINT2_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case UPDATE_CONSTRAINT2_GROUP_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, group_id: action.group_id }
      })
    case UPDATE_CONSTRAINT2_MAX_NUMBER_OF_ASSIGNMENTS:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, max_number_of_assignments: action.max_number_of_assignments }
      })
    case DELETE_CONSTRAINT2:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
