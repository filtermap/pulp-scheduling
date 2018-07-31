const CREATE_C1 = 'CREATE_C1'
const UPDATE_C1_IS_ENABLED = 'UPDATE_C1_IS_ENABLED'
const UPDATE_C1_START_DATE_NAME = 'UPDATE_C1_START_DATE_NAME'
const UPDATE_C1_STOP_DATE_NAME = 'UPDATE_C1_STOP_DATE_NAME'
const UPDATE_C1_KINMU_ID = 'UPDATE_C1_KINMU_ID'
const UPDATE_C1_GROUP_ID = 'UPDATE_C1_GROUP_ID'
const UPDATE_C1_MIN_NUMBER_OF_ASSIGNMENTS = 'UPDATE_C1_MIN_NUMBER_OF_ASSIGNMENTS'
const DELETE_C1 = 'DELETE_C1'

export type C1 = {
  id: number
  is_enabled: boolean
  start_date_name: string
  stop_date_name: string
  kinmu_id: number
  group_id: number
  min_number_of_assignments: number
}

type CreateC1 = {
  type: typeof CREATE_C1
  is_enabled: boolean
  start_date_name: string
  stop_date_name: string
  kinmu_id: number
  group_id: number
  min_number_of_assignments: number
}

type UpdateC1IsEnabled = {
  type: typeof UPDATE_C1_IS_ENABLED
  id: number
  is_enabled: boolean
}

type UpdateC1StartDateName = {
  type: typeof UPDATE_C1_START_DATE_NAME
  id: number
  start_date_name: string
}

type UpdateC1StopDateName = {
  type: typeof UPDATE_C1_STOP_DATE_NAME
  id: number
  stop_date_name: string
}

type UpdateC1KinmuId = {
  type: typeof UPDATE_C1_KINMU_ID
  id: number
  kinmu_id: number
}

type UpdateC1GroupId = {
  type: typeof UPDATE_C1_GROUP_ID
  id: number
  group_id: number
}

type UpdateC1MinNumberOfAssignments = {
  type: typeof UPDATE_C1_MIN_NUMBER_OF_ASSIGNMENTS
  id: number
  min_number_of_assignments: number
}

type DeleteC1 = {
  type: typeof DELETE_C1
  id: number
}

type Action =
  | CreateC1
  | UpdateC1IsEnabled
  | UpdateC1StartDateName
  | UpdateC1StopDateName
  | UpdateC1KinmuId
  | UpdateC1GroupId
  | UpdateC1MinNumberOfAssignments
  | DeleteC1

export function createC1(is_enabled: boolean, start_date_name: string, stop_date_name: string, kinmu_id: number, group_id: number, min_number_of_assignments: number): CreateC1 {
  return {
    group_id,
    is_enabled,
    kinmu_id,
    min_number_of_assignments,
    start_date_name,
    stop_date_name,
    type: CREATE_C1,
  }
}

export function updateC1IsEnabled(id: number, is_enabled: boolean): UpdateC1IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_C1_IS_ENABLED,
  }
}

export function updateC1StartDateName(id: number, start_date_name: string): UpdateC1StartDateName {
  return {
    id,
    start_date_name,
    type: UPDATE_C1_START_DATE_NAME,
  }
}

export function updateC1StopDateName(id: number, stop_date_name: string): UpdateC1StopDateName {
  return {
    id,
    stop_date_name,
    type: UPDATE_C1_STOP_DATE_NAME,
  }
}

export function updateC1KinmuId(id: number, kinmu_id: number): UpdateC1KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_C1_KINMU_ID,
  }
}

export function updateC1GroupId(id: number, group_id: number): UpdateC1GroupId {
  return {
    group_id,
    id,
    type: UPDATE_C1_GROUP_ID,
  }
}

export function updateC1MinNumberOfAssignments(id: number, min_number_of_assignments: number): UpdateC1MinNumberOfAssignments {
  return {
    id,
    min_number_of_assignments,
    type: UPDATE_C1_MIN_NUMBER_OF_ASSIGNMENTS,
  }
}

export function deleteC1(id: number): DeleteC1 {
  return {
    id,
    type: DELETE_C1,
  }
}

export type State = C1[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C1:
      return state.concat({
        group_id: action.group_id,
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        min_number_of_assignments: action.min_number_of_assignments,
        start_date_name: action.start_date_name,
        stop_date_name: action.stop_date_name,
      })
    case UPDATE_C1_IS_ENABLED:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, is_enabled: action.is_enabled }
      })
    case UPDATE_C1_START_DATE_NAME:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, start_date_name: action.start_date_name }
      })
    case UPDATE_C1_STOP_DATE_NAME:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, stop_date_name: action.stop_date_name }
      })
    case UPDATE_C1_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case UPDATE_C1_GROUP_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, group_id: action.group_id }
      })
    case UPDATE_C1_MIN_NUMBER_OF_ASSIGNMENTS:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, min_number_of_assignments: action.min_number_of_assignments }
      })
    case DELETE_C1:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
