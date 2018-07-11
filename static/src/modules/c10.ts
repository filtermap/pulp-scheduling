const UPDATE_C10_MEMBER_INDEX = 'UPDATE_C10_MEMBER_INDEX'
const UPDATE_C10_START_DATE_NAME = 'UPDATE_C10_START_DATE_NAME'
const UPDATE_C10_STOP_DATE_NAME = 'UPDATE_C10_STOP_DATE_NAME'
const UPDATE_C10_KINMU_INDEX = 'UPDATE_C10_KINMU_INDEX'
const DELETE_C10 = 'DELETE_C10'

export type C10 = {
  index: number
  member_index: number
  start_date_name: string
  stop_date_name: string
  kinmu_index: number
}

type UpdateC10MemberIndex = {
  type: typeof UPDATE_C10_MEMBER_INDEX
  index: number
  member_index: number
}

type UpdateC10StartDateName = {
  type: typeof UPDATE_C10_START_DATE_NAME
  index: number
  start_date_name: string
}

type UpdateC10StopDateName = {
  type: typeof UPDATE_C10_STOP_DATE_NAME
  index: number
  stop_date_name: string
}

type UpdateC10KinmuIndex = {
  type: typeof UPDATE_C10_KINMU_INDEX
  index: number
  kinmu_index: number
}

type DeleteC10 = {
  type: typeof DELETE_C10
  index: number
}

type Action =
  |UpdateC10MemberIndex
  | UpdateC10StartDateName
  | UpdateC10StopDateName
  | UpdateC10KinmuIndex
  | DeleteC10

export function updateC10MemberIndex(index: number, member_index: number): UpdateC10MemberIndex {
  return {
    index,
    member_index,
    type: UPDATE_C10_MEMBER_INDEX,
  }
}

export function updateC10StartDateName(index: number, start_date_name: string): UpdateC10StartDateName {
  return {
    index,
    start_date_name,
    type: UPDATE_C10_START_DATE_NAME,
  }
}

export function updateC10StopDateName(index: number, stop_date_name: string): UpdateC10StopDateName {
  return {
    index,
    stop_date_name,
    type: UPDATE_C10_STOP_DATE_NAME,
  }
}

export function updateC10KinmuIndex(index: number, kinmu_index: number): UpdateC10KinmuIndex {
  return {
    index,
    kinmu_index,
    type: UPDATE_C10_KINMU_INDEX,
  }
}

export function deleteC10(index: number): DeleteC10 {
  return {
    index,
    type: DELETE_C10,
  }
}

export type State = C10[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_C10_MEMBER_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, member_index: action.member_index }
      })
    case UPDATE_C10_START_DATE_NAME:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, start_date_name: action.start_date_name }
      })
    case UPDATE_C10_STOP_DATE_NAME:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, stop_date_name: action.stop_date_name }
      })
    case UPDATE_C10_KINMU_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, kinmu_index: action.kinmu_index }
      })
    case DELETE_C10:
      return state.filter(c => c.index !== action.index)
  }
  return state
}
