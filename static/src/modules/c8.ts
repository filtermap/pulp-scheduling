const CREATE_C8 = "CREATE_C8"
const UPDATE_C8_KINMU_ID = 'UPDATE_C8_KINMU_ID'
const UPDATE_C8_MAX_NUMBER_OF_DAYS = 'UPDATE_C8_MAX_NUMBER_OF_DAYS'
const DELETE_C8 = 'DELETE_C8'

export type C8 = {
  id: number
  kinmu_id: number
  max_number_of_days: number
}

type CreateC8 = {
  type: typeof CREATE_C8
  kinmu_id: number
  max_number_of_days: number
}

type UpdateC8KinmuId = {
  type: typeof UPDATE_C8_KINMU_ID
  id: number
  kinmu_id: number
}

type UpdateC8MaxNumberOfDays = {
  type: typeof UPDATE_C8_MAX_NUMBER_OF_DAYS
  id: number
  max_number_of_days: number
}

type DeleteC8 = {
  type: typeof DELETE_C8
  id: number
}

type Action =
  | CreateC8
  | UpdateC8KinmuId
  | UpdateC8MaxNumberOfDays
  | DeleteC8

export function createC8(kinmu_id: number, max_number_of_days: number): CreateC8 {
  return {
    kinmu_id,
    max_number_of_days,
    type: CREATE_C8,
  }
}

export function updateC8KinmuId(id: number, kinmu_id: number): UpdateC8KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_C8_KINMU_ID
  }
}

export function updateC8MaxNumberOfDays(id: number, max_number_of_days: number): UpdateC8MaxNumberOfDays {
  return {
    id,
    max_number_of_days,
    type: UPDATE_C8_MAX_NUMBER_OF_DAYS,
  }
}

export function deleteC8(id: number): DeleteC8 {
  return {
    id,
    type: DELETE_C8,
  }
}

export type State = C8[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C8:
      return state.concat({
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        kinmu_id: action.kinmu_id,
        max_number_of_days: action.max_number_of_days,
      })
    case UPDATE_C8_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case UPDATE_C8_MAX_NUMBER_OF_DAYS:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, max_number_of_days: action.max_number_of_days }
      })
    case DELETE_C8:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
