const CREATE_C6 = 'CREATE_C6'
const UPDATE_C6_IS_ENABLED = 'UPDATE_C6_IS_ENABLED'
const UPDATE_C6_KINMU_ID = 'UPDATE_C6_KINMU_ID'
const UPDATE_C6_MAX_NUMBER_OF_DAYS = 'UPDATE_C6_MAX_NUMBER_OF_DAYS'
const DELETE_C6 = 'DELETE_C6'

export type C6 = {
  id: number
  is_enabled: boolean
  kinmu_id: number
  max_number_of_days: number
}

type CreateC6 = {
  type: typeof CREATE_C6
  is_enabled: boolean
  kinmu_id: number
  max_number_of_days: number
}

type UpdateC6IsEnabled = {
  type: typeof UPDATE_C6_IS_ENABLED
  id: number
  is_enabled: boolean
}

type UpdateC6KinmuId = {
  type: typeof UPDATE_C6_KINMU_ID
  id: number
  kinmu_id: number
}

type UpdateC6MaxNumberOfDays = {
  type: typeof UPDATE_C6_MAX_NUMBER_OF_DAYS
  id: number
  max_number_of_days: number
}

type DeleteC6 = {
  type: typeof DELETE_C6
  id: number
}

type Action =
  | CreateC6
  | UpdateC6IsEnabled
  | UpdateC6KinmuId
  | UpdateC6MaxNumberOfDays
  | DeleteC6

export function createC6(is_enabled: boolean, kinmu_id: number, max_number_of_days: number): CreateC6 {
  return {
    is_enabled,
    kinmu_id,
    max_number_of_days,
    type: CREATE_C6,
  }
}

export function updateC6IsEnabled(id: number, is_enabled: boolean): UpdateC6IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_C6_IS_ENABLED,
  }
}

export function updateC6KinmuId(id: number, kinmu_id: number): UpdateC6KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_C6_KINMU_ID,
  }
}

export function updateC6MaxNumberOfDays(id: number, max_number_of_days: number): UpdateC6MaxNumberOfDays {
  return {
    id,
    max_number_of_days,
    type: UPDATE_C6_MAX_NUMBER_OF_DAYS,
  }
}

export function deleteC6(id: number): DeleteC6 {
  return {
    id,
    type: DELETE_C6,
  }
}

export type State = C6[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C6:
      return state.concat({
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        max_number_of_days: action.max_number_of_days,
      })
    case UPDATE_C6_IS_ENABLED:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, is_enabled: action.is_enabled }
      })
    case UPDATE_C6_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case UPDATE_C6_MAX_NUMBER_OF_DAYS:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, max_number_of_days: action.max_number_of_days }
      })
    case DELETE_C6:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
