const CREATE_C2 = 'CREATE_C2'
const UPDATE_C2_START_DATE_NAME = 'UPDATE_C2_START_DATE_NAME'
const UPDATE_C2_STOP_DATE_NAME = 'UPDATE_C2_STOP_DATE_NAME'
const UPDATE_C2_KINMU_ID = 'UPDATE_C2_KINMU_ID'
const UPDATE_C2_GROUP_ID = 'UPDATE_C2_GROUP_ID'
const UPDATE_C2_MAX_NUMBER_OF_ASSIGNMENTS = 'UPDATE_C2_MAX_NUMBER_OF_ASSIGNMENTS'
const DELETE_C2 = 'DELETE_C2'

export type C2 = {
  id: number
  start_date_name: string
  stop_date_name: string
  kinmu_id: number
  group_id: number
  max_number_of_assignments: number
}

type CreateC2 = {
  type: typeof CREATE_C2
  start_date_name: string
  stop_date_name: string
  kinmu_id: number
  group_id: number
  max_number_of_assignments: number
}

type UpdateC2StartDateName = {
  type: typeof UPDATE_C2_START_DATE_NAME
  id: number
  start_date_name: string
}

type UpdateC2StopDateName = {
  type: typeof UPDATE_C2_STOP_DATE_NAME
  id: number
  stop_date_name: string
}

type UpdateC2KinmuId = {
  type: typeof UPDATE_C2_KINMU_ID
  id: number
  kinmu_id: number
}

type UpdateC2GroupId = {
  type: typeof UPDATE_C2_GROUP_ID
  id: number
  group_id: number
}

type UpdateC2MaxNumberOfAssignments = {
  type: typeof UPDATE_C2_MAX_NUMBER_OF_ASSIGNMENTS
  id: number
  max_number_of_assignments: number
}

type DeleteC2 = {
  type: typeof DELETE_C2
  id: number
}

type Action =
  | CreateC2
  | UpdateC2StartDateName
  | UpdateC2StopDateName
  | UpdateC2KinmuId
  | UpdateC2GroupId
  | UpdateC2MaxNumberOfAssignments
  | DeleteC2

export function createC2(start_date_name: string, stop_date_name: string, kinmu_id: number, group_id: number, max_number_of_assignments: number): CreateC2 {
  return {
    group_id,
    kinmu_id,
    max_number_of_assignments,
    start_date_name,
    stop_date_name,
    type: CREATE_C2,
  }
}

export function updateC2StartDateName(id: number, start_date_name: string): UpdateC2StartDateName {
  return {
    id,
    start_date_name,
    type: UPDATE_C2_START_DATE_NAME,
  }
}

export function updateC2StopDateName(id: number, stop_date_name: string): UpdateC2StopDateName {
  return {
    id,
    stop_date_name,
    type: UPDATE_C2_STOP_DATE_NAME,
  }
}

export function updateC2KinmuId(id: number, kinmu_id: number): UpdateC2KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_C2_KINMU_ID,
  }
}

export function updateC2GroupId(id: number, group_id: number): UpdateC2GroupId {
  return {
    group_id,
    id,
    type: UPDATE_C2_GROUP_ID,
  }
}

export function updateC2MaxNumberOfAssignments(id: number, max_number_of_assignments: number): UpdateC2MaxNumberOfAssignments {
  return {
    id,
    max_number_of_assignments,
    type: UPDATE_C2_MAX_NUMBER_OF_ASSIGNMENTS,
  }
}

export function deleteC2(id: number): DeleteC2 {
  return {
    id,
    type: DELETE_C2,
  }
}

export type State = C2[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C2:
      return state.concat({
        group_id: action.group_id,
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        kinmu_id: action.kinmu_id,
        max_number_of_assignments: action.max_number_of_assignments,
        start_date_name: action.start_date_name,
        stop_date_name: action.stop_date_name,
      })
    case UPDATE_C2_START_DATE_NAME:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, start_date_name: action.start_date_name }
      })
    case UPDATE_C2_STOP_DATE_NAME:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, stop_date_name: action.stop_date_name }
      })
    case UPDATE_C2_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case UPDATE_C2_GROUP_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, group_id: action.group_id }
      })
    case UPDATE_C2_MAX_NUMBER_OF_ASSIGNMENTS:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, max_number_of_assignments: action.max_number_of_assignments }
      })
    case DELETE_C2:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
