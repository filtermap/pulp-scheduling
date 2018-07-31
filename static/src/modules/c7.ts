const CREATE_C7 = 'CREATE_C7'
const UPDATE_C7_IS_ENABLED = 'UPDATE_C7_IS_ENABLED'
const UPDATE_C7_KINMU_ID = 'UPDATE_C7_KINMU_ID'
const UPDATE_C7_MIN_NUMBER_OF_DAYS = 'UPDATE_C7_MIN_NUMBER_OF_DAYS'
const DELETE_C7 = 'DELETE_C7'

export type C7 = {
  id: number
  is_enabled: boolean
  kinmu_id: number
  min_number_of_days: number
}

type CreateC7 = {
  type: typeof CREATE_C7
  is_enabled: boolean
  kinmu_id: number
  min_number_of_days: number
}

type UpdateC7IsEnabled = {
  type: typeof UPDATE_C7_IS_ENABLED
  id: number
  is_enabled: boolean
}

type UpdateC7KinmuId = {
  type: typeof UPDATE_C7_KINMU_ID
  id: number
  kinmu_id: number
}

type UpdateC7MinNumberOfDays = {
  type: typeof UPDATE_C7_MIN_NUMBER_OF_DAYS
  id: number
  min_number_of_days: number
}

type DeleteC7 = {
  type: typeof DELETE_C7
  id: number
}

type Action =
  | CreateC7
  | UpdateC7IsEnabled
  | UpdateC7KinmuId
  | UpdateC7MinNumberOfDays
  | DeleteC7

export function createC7(is_enabled: boolean, kinmu_id: number, min_number_of_days: number): CreateC7 {
  return {
    is_enabled,
    kinmu_id,
    min_number_of_days,
    type: CREATE_C7,
  }
}

export function updateC7IsEnabled(id: number, is_enabled: boolean): UpdateC7IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_C7_IS_ENABLED,
  }
}

export function updateC7KinmuId(id: number, kinmu_id: number): UpdateC7KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_C7_KINMU_ID
  }
}

export function updateC7MinNumberOfDays(id: number, min_number_of_days: number): UpdateC7MinNumberOfDays {
  return {
    id,
    min_number_of_days,
    type: UPDATE_C7_MIN_NUMBER_OF_DAYS
  }
}

export function deleteC7(id: number): DeleteC7 {
  return {
    id,
    type: DELETE_C7,
  }
}

export type State = C7[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C7:
      return state.concat({
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        min_number_of_days: action.min_number_of_days,
      })
    case UPDATE_C7_IS_ENABLED:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, is_enabled: action.is_enabled }
      })
    case UPDATE_C7_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case UPDATE_C7_MIN_NUMBER_OF_DAYS:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, min_number_of_days: action.min_number_of_days }
      })
    case DELETE_C7:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
