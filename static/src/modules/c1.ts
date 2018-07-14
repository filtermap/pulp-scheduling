const CREATE_C1 = 'CREATE_C1'
const UPDATE_C1_START_DATE_NAME = 'UPDATE_C1_START_DATE_NAME'
const UPDATE_C1_STOP_DATE_NAME = 'UPDATE_C1_STOP_DATE_NAME'
const UPDATE_C1_KINMU_INDEX = 'UPDATE_C1_KINMU_INDEX'
const UPDATE_C1_GROUP_INDEX = 'UPDATE_C1_GROUP_INDEX'
const UPDATE_C1_MIN_NUMBER_OF_ASSIGNMENTS = 'UPDATE_C1_MIN_NUMBER_OF_ASSIGNMENTS'
const DELETE_C1 = 'DELETE_C1'

export type C1 = {
  index: number
  start_date_name: string
  stop_date_name: string
  kinmu_index: number
  group_index: number
  min_number_of_assignments: number
}

type CreateC1 = {
  type: typeof CREATE_C1
  start_date_name: string
  stop_date_name: string
  kinmu_index: number
  group_index: number
  min_number_of_assignments: number
}

type UpdateC1StartDateName = {
  type: typeof UPDATE_C1_START_DATE_NAME
  index: number
  start_date_name: string
}

type UpdateC1StopDateName = {
  type: typeof UPDATE_C1_STOP_DATE_NAME
  index: number
  stop_date_name: string
}

type UpdateC1KinmuIndex = {
  type: typeof UPDATE_C1_KINMU_INDEX
  index: number
  kinmu_index: number
}

type UpdateC1GroupIndex = {
  type: typeof UPDATE_C1_GROUP_INDEX
  index: number
  group_index: number
}

type UpdateC1MinNumberOfAssignments = {
  type: typeof UPDATE_C1_MIN_NUMBER_OF_ASSIGNMENTS
  index: number
  min_number_of_assignments: number
}

type DeleteC1 = {
  type: typeof DELETE_C1
  index: number
}

type Action =
  | CreateC1
  | UpdateC1StartDateName
  | UpdateC1StopDateName
  | UpdateC1KinmuIndex
  | UpdateC1GroupIndex
  | UpdateC1MinNumberOfAssignments
  | DeleteC1

export function createC1(start_date_name: string, stop_date_name: string, kinmu_index: number, group_index: number, min_number_of_assignments: number) {
  return {
    group_index,
    kinmu_index,
    min_number_of_assignments,
    start_date_name,
    stop_date_name,
    type: CREATE_C1,
  }
}

export function updateC1StartDateName(index: number, start_date_name: string): UpdateC1StartDateName {
  return {
    index,
    start_date_name,
    type: UPDATE_C1_START_DATE_NAME,
  }
}

export function updateC1StopDateName(index: number, stop_date_name: string): UpdateC1StopDateName {
  return {
    index,
    stop_date_name,
    type: UPDATE_C1_STOP_DATE_NAME,
  }
}

export function updateC1KinmuIndex(index: number, kinmu_index: number): UpdateC1KinmuIndex {
  return {
    index,
    kinmu_index,
    type: UPDATE_C1_KINMU_INDEX,
  }
}

export function updateC1GroupIndex(index: number, group_index: number): UpdateC1GroupIndex {
  return {
    group_index,
    index,
    type: UPDATE_C1_GROUP_INDEX,
  }
}

export function updateC1MinNumberOfAssignments(index: number, min_number_of_assignments: number): UpdateC1MinNumberOfAssignments {
  return {
    index,
    min_number_of_assignments,
    type: UPDATE_C1_MIN_NUMBER_OF_ASSIGNMENTS,
  }
}

export function deleteC1(index: number): DeleteC1 {
  return {
    index,
    type: DELETE_C1,
  }
}

export type State = C1[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C1:
      return state.concat({
        group_index: action.group_index,
        index: Math.max(...state.map(c => c.index)) + 1,
        kinmu_index: action.kinmu_index,
        min_number_of_assignments: action.min_number_of_assignments,
        start_date_name: action.start_date_name,
        stop_date_name: action.stop_date_name,
      })
    case UPDATE_C1_START_DATE_NAME:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, start_date_name: action.start_date_name }
      })
    case UPDATE_C1_STOP_DATE_NAME:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, stop_date_name: action.stop_date_name }
      })
    case UPDATE_C1_KINMU_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, kinmu_index: action.kinmu_index }
      })
    case UPDATE_C1_GROUP_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, group_index: action.group_index }
      })
    case UPDATE_C1_MIN_NUMBER_OF_ASSIGNMENTS:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, min_number_of_assignments: action.min_number_of_assignments }
      })
    case DELETE_C1:
      return state.filter(c => c.index !== action.index)
  }
  return state
}
