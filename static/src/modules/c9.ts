const CREATE_C9 = 'CREATE_C9'
const UPDATE_C9_MEMBER_INDEX = 'UPDATE_C9_MEMBER_INDEX'
const UPDATE_C9_START_DATE_NAME = 'UPDATE_C9_START_DATE_NAME'
const UPDATE_C9_STOP_DATE_NAME = 'UPDATE_C9_STOP_DATE_NAME'
const UPDATE_C9_KINMU_INDEX = 'UPDATE_C9_KINMU_INDEX'
const DELETE_C9 = 'DELETE_C9'

export type C9 = {
  index: number
  member_index: number
  start_date_name: string
  stop_date_name: string
  kinmu_index: number
}

type CreateC9 = {
  type: typeof CREATE_C9
  member_index: number
  start_date_name: string
  stop_date_name: string
  kinmu_index: number
}

type UpdateC9MemberIndex = {
  type: typeof UPDATE_C9_MEMBER_INDEX
  index: number
  member_index: number
}

type UpdateC9StartDateName = {
  type: typeof UPDATE_C9_START_DATE_NAME
  index: number
  start_date_name: string
}

type UpdateC9StopDateName = {
  type: typeof UPDATE_C9_STOP_DATE_NAME
  index: number
  stop_date_name: string
}

type UpdateC9KinmuIndex = {
  type: typeof UPDATE_C9_KINMU_INDEX
  index: number
  kinmu_index: number
}

type DeleteC9 = {
  type: typeof DELETE_C9
  index: number
}

type Action =
  | CreateC9
  | UpdateC9MemberIndex
  | UpdateC9StartDateName
  | UpdateC9StopDateName
  | UpdateC9KinmuIndex
  | DeleteC9

export function createC9(member_index: number, start_date_name: string, stop_date_name: string, kinmu_index: number): CreateC9 {
  return {
    kinmu_index,
    member_index,
    start_date_name,
    stop_date_name,
    type: CREATE_C9,
  }
}

export function updateC9MemberIndex(index: number, member_index: number): UpdateC9MemberIndex {
  return {
    index,
    member_index,
    type: UPDATE_C9_MEMBER_INDEX,
  }
}

export function updateC9StartDateName(index: number, start_date_name: string): UpdateC9StartDateName {
  return {
    index,
    start_date_name,
    type: UPDATE_C9_START_DATE_NAME,
  }
}

export function updateC9StopDateName(index: number, stop_date_name: string): UpdateC9StopDateName {
  return {
    index,
    stop_date_name,
    type: UPDATE_C9_STOP_DATE_NAME,
  }
}

export function updateC9KinmuIndex(index: number, kinmu_index: number): UpdateC9KinmuIndex {
  return {
    index,
    kinmu_index,
    type: UPDATE_C9_KINMU_INDEX,
  }
}

export function deleteC9(index: number): DeleteC9 {
  return {
    index,
    type: DELETE_C9,
  }
}

export type State = C9[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C9:
      return state.concat({
        index: Math.max(...state.map(c => c.index)) + 1,
        kinmu_index: action.kinmu_index,
        member_index: action.member_index,
        start_date_name: action.start_date_name,
        stop_date_name: action.stop_date_name,
      })
    case UPDATE_C9_MEMBER_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, member_index: action.member_index }
      })
    case UPDATE_C9_START_DATE_NAME:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, start_date_name: action.start_date_name }
      })
    case UPDATE_C9_STOP_DATE_NAME:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, stop_date_name: action.stop_date_name }
      })
    case UPDATE_C9_KINMU_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, kinmu_index: action.kinmu_index }
      })
    case DELETE_C9:
      return state.filter(c => c.index !== action.index)
  }
  return state
}
