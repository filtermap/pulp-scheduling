const UPDATE_C1_START_DATE_NAME = 'UPDATE_C1_START_DATE_NAME'
const UPDATE_C1_STOP_DATE_NAME = 'UPDATE_C1_STOP_DATE_NAME'
const UPDATE_C1_KINMU_INDEX = 'UPDATE_C1_KINMU_INDEX'
const UPDATE_C1_GROUP_INDEX = 'UPDATE_C1_GROUP_INDEX'
const UPDATE_C1_MIN_NUMBER_OF_ASSIGNMENTS = 'UPDATE_C1_MIN_NUMBER_OF_ASSIGNMENTS'

export type C1 = {
  index: number
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

type Action = UpdateC1StartDateName | UpdateC1StopDateName | UpdateC1KinmuIndex | UpdateC1GroupIndex | UpdateC1MinNumberOfAssignments

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

export type State = C1[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
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
  }
  return state
}
