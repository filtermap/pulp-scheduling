const CREATE_C5 = 'CREATE_C5'
const UPDATE_C5_IS_ENABLED = 'UPDATE_C5_IS_ENABLED'
const UPDATE_C5_KINMU_ID = 'UPDATE_C5_KINMU_ID'
const UPDATE_C5_MIN_NUMBER_OF_DAYS = 'UPDATE_C5_MIN_NUMBER_OF_DAYS'
const DELETE_C5 = 'DELETE_C5'

export type C5 = {
  id: number
  is_enabled: boolean
  kinmu_id: number
  min_number_of_days: number
}

type CreateC5 = {
  type: typeof CREATE_C5
  is_enabled: boolean
  kinmu_id: number
  min_number_of_days: number
}

type UpdateC5IsEnabled = {
  type: typeof UPDATE_C5_IS_ENABLED
  id: number
  is_enabled: boolean
}

type UpdateC5KinmuId = {
  type: typeof UPDATE_C5_KINMU_ID
  id: number
  kinmu_id: number
}

type UpdateC5MinNumberOfDays = {
  type: typeof UPDATE_C5_MIN_NUMBER_OF_DAYS
  id: number
  min_number_of_days: number
}

type DeleteC5 = {
  type: typeof DELETE_C5
  id: number
}

type Action =
  | CreateC5
  | UpdateC5IsEnabled
  | UpdateC5KinmuId
  | UpdateC5MinNumberOfDays
  | DeleteC5

export function createC5(is_enabled: boolean, kinmu_id: number, min_number_of_days: number): CreateC5 {
  return {
    is_enabled,
    kinmu_id,
    min_number_of_days,
    type: CREATE_C5,
  }
}

export function updateC5IsEnabled(id: number, is_enabled: boolean): UpdateC5IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_C5_IS_ENABLED,
  }
}

export function updateC5KinmuId(id: number, kinmu_id: number): UpdateC5KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_C5_KINMU_ID,
  }
}

export function updateC5MinNumberOfDays(id: number, min_number_of_days: number): UpdateC5MinNumberOfDays {
  return {
    id,
    min_number_of_days,
    type: UPDATE_C5_MIN_NUMBER_OF_DAYS,
  }
}

export function deleteC5(id: number): DeleteC5 {
  return {
    id,
    type: DELETE_C5,
  }
}

export type State = C5[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C5:
      return state.concat({
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        min_number_of_days: action.min_number_of_days,
      })
    case UPDATE_C5_IS_ENABLED:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, is_enabled: action.is_enabled }
      })
    case UPDATE_C5_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case UPDATE_C5_MIN_NUMBER_OF_DAYS:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, min_number_of_days: action.min_number_of_days }
      })
    case DELETE_C5:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
