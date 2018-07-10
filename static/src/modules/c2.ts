const UPDATE_C2_START_DATE_NAME = 'UPDATE_C2_START_DATE_NAME'
const UPDATE_C2_STOP_DATE_NAME = 'UPDATE_C2_STOP_DATE_NAME'
const UPDATE_C2_KINMU_INDEX = 'UPDATE_C2_KINMU_INDEX'
const UPDATE_C2_GROUP_INDEX = 'UPDATE_C2_GROUP_INDEX'
const UPDATE_C2_MAX_NUMBER_OF_ASSIGNMENTS = 'UPDATE_C2_MAX_NUMBER_OF_ASSIGNMENTS'

export type C2 = {
  index: number
  start_date_name: string
  stop_date_name: string
  kinmu_index: number
  group_index: number
  max_number_of_assignments: number
}

type UpdateC2StartDateName = {
  type: typeof UPDATE_C2_START_DATE_NAME
  index: number
  start_date_name: string
}

type UpdateC2StopDateName = {
  type: typeof UPDATE_C2_STOP_DATE_NAME
  index: number
  stop_date_name: string
}

type UpdateC2KinmuIndex = {
  type: typeof UPDATE_C2_KINMU_INDEX
  index: number
  kinmu_index: number
}

type UpdateC2GroupIndex = {
  type: typeof UPDATE_C2_GROUP_INDEX
  index: number
  group_index: number
}

type UpdateC2MaxNumberOfAssignments = {
  type: typeof UPDATE_C2_MAX_NUMBER_OF_ASSIGNMENTS
  index: number
  max_number_of_assignments: number
}

type Action = UpdateC2StartDateName | UpdateC2StopDateName | UpdateC2KinmuIndex | UpdateC2GroupIndex | UpdateC2MaxNumberOfAssignments

export function updateC2StartDateName(index: number, start_date_name: string): UpdateC2StartDateName {
  return {
    index,
    start_date_name,
    type: UPDATE_C2_START_DATE_NAME,
  }
}

export function updateC2StopDateName(index: number, stop_date_name: string): UpdateC2StopDateName {
  return {
    index,
    stop_date_name,
    type: UPDATE_C2_STOP_DATE_NAME,
  }
}

export function updateC2KinmuIndex(index: number, kinmu_index: number): UpdateC2KinmuIndex {
  return {
    index,
    kinmu_index,
    type: UPDATE_C2_KINMU_INDEX,
  }
}

export function updateC2GroupIndex(index: number, group_index: number): UpdateC2GroupIndex {
  return {
    group_index,
    index,
    type: UPDATE_C2_GROUP_INDEX,
  }
}

export function updateC2MaxNumberOfAssignments(index: number, max_number_of_assignments: number): UpdateC2MaxNumberOfAssignments {
  return {
    index,
    max_number_of_assignments,
    type: UPDATE_C2_MAX_NUMBER_OF_ASSIGNMENTS,
  }
}

export type State = C2[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_C2_START_DATE_NAME:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, start_date_name: action.start_date_name }
      })
    case UPDATE_C2_STOP_DATE_NAME:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, stop_date_name: action.stop_date_name }
      })
    case UPDATE_C2_KINMU_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, kinmu_index: action.kinmu_index }
      })
    case UPDATE_C2_GROUP_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, group_index: action.group_index }
      })
    case UPDATE_C2_MAX_NUMBER_OF_ASSIGNMENTS:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, max_number_of_assignments: action.max_number_of_assignments }
      })
  }
  return state
}
