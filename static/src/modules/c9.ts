const CREATE_C9 = 'CREATE_C9'
const UPDATE_C9_MEMBER_ID = 'UPDATE_C9_MEMBER_ID'
const UPDATE_C9_START_DATE_NAME = 'UPDATE_C9_START_DATE_NAME'
const UPDATE_C9_STOP_DATE_NAME = 'UPDATE_C9_STOP_DATE_NAME'
const UPDATE_C9_KINMU_ID = 'UPDATE_C9_KINMU_ID'
const DELETE_C9 = 'DELETE_C9'

export type C9 = {
  id: number
  member_id: number
  start_date_name: string
  stop_date_name: string
  kinmu_id: number
}

type CreateC9 = {
  type: typeof CREATE_C9
  member_id: number
  start_date_name: string
  stop_date_name: string
  kinmu_id: number
}

type UpdateC9MemberId = {
  type: typeof UPDATE_C9_MEMBER_ID
  id: number
  member_id: number
}

type UpdateC9StartDateName = {
  type: typeof UPDATE_C9_START_DATE_NAME
  id: number
  start_date_name: string
}

type UpdateC9StopDateName = {
  type: typeof UPDATE_C9_STOP_DATE_NAME
  id: number
  stop_date_name: string
}

type UpdateC9KinmuId = {
  type: typeof UPDATE_C9_KINMU_ID
  id: number
  kinmu_id: number
}

type DeleteC9 = {
  type: typeof DELETE_C9
  id: number
}

type Action =
  | CreateC9
  | UpdateC9MemberId
  | UpdateC9StartDateName
  | UpdateC9StopDateName
  | UpdateC9KinmuId
  | DeleteC9

export function createC9(member_id: number, start_date_name: string, stop_date_name: string, kinmu_id: number): CreateC9 {
  return {
    kinmu_id,
    member_id,
    start_date_name,
    stop_date_name,
    type: CREATE_C9,
  }
}

export function updateC9MemberId(id: number, member_id: number): UpdateC9MemberId {
  return {
    id,
    member_id,
    type: UPDATE_C9_MEMBER_ID,
  }
}

export function updateC9StartDateName(id: number, start_date_name: string): UpdateC9StartDateName {
  return {
    id,
    start_date_name,
    type: UPDATE_C9_START_DATE_NAME,
  }
}

export function updateC9StopDateName(id: number, stop_date_name: string): UpdateC9StopDateName {
  return {
    id,
    stop_date_name,
    type: UPDATE_C9_STOP_DATE_NAME,
  }
}

export function updateC9KinmuId(id: number, kinmu_id: number): UpdateC9KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_C9_KINMU_ID,
  }
}

export function deleteC9(id: number): DeleteC9 {
  return {
    id,
    type: DELETE_C9,
  }
}

export type State = C9[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C9:
      return state.concat({
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        kinmu_id: action.kinmu_id,
        member_id: action.member_id,
        start_date_name: action.start_date_name,
        stop_date_name: action.stop_date_name,
      })
    case UPDATE_C9_MEMBER_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, member_id: action.member_id }
      })
    case UPDATE_C9_START_DATE_NAME:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, start_date_name: action.start_date_name }
      })
    case UPDATE_C9_STOP_DATE_NAME:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, stop_date_name: action.stop_date_name }
      })
    case UPDATE_C9_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case DELETE_C9:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
