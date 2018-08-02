const CREATE_CONSTRAINT10 = 'CREATE_CONSTRAINT10'
const UPDATE_CONSTRAINT10_IS_ENABLED = 'UPDATE_CONSTRAINT10_IS_ENABLED'
const UPDATE_CONSTRAINT10_MEMBER_ID = 'UPDATE_CONSTRAINT10_MEMBER_ID'
const UPDATE_CONSTRAINT10_START_DATE_NAME = 'UPDATE_CONSTRAINT10_START_DATE_NAME'
const UPDATE_CONSTRAINT10_STOP_DATE_NAME = 'UPDATE_CONSTRAINT10_STOP_DATE_NAME'
const UPDATE_CONSTRAINT10_KINMU_ID = 'UPDATE_CONSTRAINT10_KINMU_ID'
const DELETE_CONSTRAINT10 = 'DELETE_CONSTRAINT10'

export type Constraint10 = {
  id: number
  is_enabled: boolean
  member_id: number
  start_date_name: string
  stop_date_name: string
  kinmu_id: number
}

type CreateConstraint10 = {
  type: typeof CREATE_CONSTRAINT10
  is_enabled: boolean
  member_id: number
  start_date_name: string
  stop_date_name: string
  kinmu_id: number
}

type UpdateConstraint10IsEnabled = {
  type: typeof UPDATE_CONSTRAINT10_IS_ENABLED
  id: number
  is_enabled: boolean
}

type UpdateConstraint10MemberId = {
  type: typeof UPDATE_CONSTRAINT10_MEMBER_ID
  id: number
  member_id: number
}

type UpdateConstraint10StartDateName = {
  type: typeof UPDATE_CONSTRAINT10_START_DATE_NAME
  id: number
  start_date_name: string
}

type UpdateConstraint10StopDateName = {
  type: typeof UPDATE_CONSTRAINT10_STOP_DATE_NAME
  id: number
  stop_date_name: string
}

type UpdateConstraint10KinmuId = {
  type: typeof UPDATE_CONSTRAINT10_KINMU_ID
  id: number
  kinmu_id: number
}

type DeleteConstraint10 = {
  type: typeof DELETE_CONSTRAINT10
  id: number
}

type Action =
  | CreateConstraint10
  | UpdateConstraint10IsEnabled
  | UpdateConstraint10MemberId
  | UpdateConstraint10StartDateName
  | UpdateConstraint10StopDateName
  | UpdateConstraint10KinmuId
  | DeleteConstraint10

export function createConstraint10(is_enabled: boolean, member_id: number, start_date_name: string, stop_date_name: string, kinmu_id: number): CreateConstraint10 {
  return {
    is_enabled,
    kinmu_id,
    member_id,
    start_date_name,
    stop_date_name,
    type: CREATE_CONSTRAINT10,
  }
}

export function updateConstraint10IsEnabled(id: number, is_enabled: boolean): UpdateConstraint10IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_CONSTRAINT10_IS_ENABLED,
  }
}

export function updateConstraint10MemberId(id: number, member_id: number): UpdateConstraint10MemberId {
  return {
    id,
    member_id,
    type: UPDATE_CONSTRAINT10_MEMBER_ID,
  }
}

export function updateConstraint10StartDateName(id: number, start_date_name: string): UpdateConstraint10StartDateName {
  return {
    id,
    start_date_name,
    type: UPDATE_CONSTRAINT10_START_DATE_NAME,
  }
}

export function updateConstraint10StopDateName(id: number, stop_date_name: string): UpdateConstraint10StopDateName {
  return {
    id,
    stop_date_name,
    type: UPDATE_CONSTRAINT10_STOP_DATE_NAME,
  }
}

export function updateConstraint10KinmuId(id: number, kinmu_id: number): UpdateConstraint10KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_CONSTRAINT10_KINMU_ID,
  }
}

export function deleteConstraint10(id: number): DeleteConstraint10 {
  return {
    id,
    type: DELETE_CONSTRAINT10,
  }
}

export type State = Constraint10[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_CONSTRAINT10:
      return state.concat({
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        member_id: action.member_id,
        start_date_name: action.start_date_name,
        stop_date_name: action.stop_date_name,
      })
    case UPDATE_CONSTRAINT10_IS_ENABLED:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, is_enabled: action.is_enabled }
      })
    case UPDATE_CONSTRAINT10_MEMBER_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, member_id: action.member_id }
      })
    case UPDATE_CONSTRAINT10_START_DATE_NAME:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, start_date_name: action.start_date_name }
      })
    case UPDATE_CONSTRAINT10_STOP_DATE_NAME:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, stop_date_name: action.stop_date_name }
      })
    case UPDATE_CONSTRAINT10_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case DELETE_CONSTRAINT10:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
