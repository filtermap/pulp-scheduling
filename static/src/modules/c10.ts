const CREATE_C10 = 'CREATE_C10'
const UPDATE_C10_MEMBER_ID = 'UPDATE_C10_MEMBER_ID'
const UPDATE_C10_START_DATE_NAME = 'UPDATE_C10_START_DATE_NAME'
const UPDATE_C10_STOP_DATE_NAME = 'UPDATE_C10_STOP_DATE_NAME'
const UPDATE_C10_KINMU_ID = 'UPDATE_C10_KINMU_ID'
const DELETE_C10 = 'DELETE_C10'

export type C10 = {
  id: number
  member_id: number
  start_date_name: string
  stop_date_name: string
  kinmu_id: number
}

type CreateC10 = {
  type: typeof CREATE_C10
  member_id: number
  start_date_name: string
  stop_date_name: string
  kinmu_id: number
}

type UpdateC10MemberId = {
  type: typeof UPDATE_C10_MEMBER_ID
  id: number
  member_id: number
}

type UpdateC10StartDateName = {
  type: typeof UPDATE_C10_START_DATE_NAME
  id: number
  start_date_name: string
}

type UpdateC10StopDateName = {
  type: typeof UPDATE_C10_STOP_DATE_NAME
  id: number
  stop_date_name: string
}

type UpdateC10KinmuId = {
  type: typeof UPDATE_C10_KINMU_ID
  id: number
  kinmu_id: number
}

type DeleteC10 = {
  type: typeof DELETE_C10
  id: number
}

type Action =
  | CreateC10
  | UpdateC10MemberId
  | UpdateC10StartDateName
  | UpdateC10StopDateName
  | UpdateC10KinmuId
  | DeleteC10

export function createC10(member_id: number, start_date_name: string, stop_date_name: string, kinmu_id: number): CreateC10 {
  return {
    kinmu_id,
    member_id,
    start_date_name,
    stop_date_name,
    type: CREATE_C10,
  }
}

export function updateC10MemberId(id: number, member_id: number): UpdateC10MemberId {
  return {
    id,
    member_id,
    type: UPDATE_C10_MEMBER_ID,
  }
}

export function updateC10StartDateName(id: number, start_date_name: string): UpdateC10StartDateName {
  return {
    id,
    start_date_name,
    type: UPDATE_C10_START_DATE_NAME,
  }
}

export function updateC10StopDateName(id: number, stop_date_name: string): UpdateC10StopDateName {
  return {
    id,
    stop_date_name,
    type: UPDATE_C10_STOP_DATE_NAME,
  }
}

export function updateC10KinmuId(id: number, kinmu_id: number): UpdateC10KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_C10_KINMU_ID,
  }
}

export function deleteC10(id: number): DeleteC10 {
  return {
    id,
    type: DELETE_C10,
  }
}

export type State = C10[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C10:
      return state.concat({
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        kinmu_id: action.kinmu_id,
        member_id: action.member_id,
        start_date_name: action.start_date_name,
        stop_date_name: action.stop_date_name,
      })
    case UPDATE_C10_MEMBER_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, member_id: action.member_id }
      })
    case UPDATE_C10_START_DATE_NAME:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, start_date_name: action.start_date_name }
      })
    case UPDATE_C10_STOP_DATE_NAME:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, stop_date_name: action.stop_date_name }
      })
    case UPDATE_C10_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case DELETE_C10:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
