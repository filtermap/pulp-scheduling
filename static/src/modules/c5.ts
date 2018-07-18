const CREATE_C5 = 'CREATE_C5'
const UPDATE_C5_KINMU_INDEX = 'UPDATE_C5_KINMU_INDEX'
const UPDATE_C5_MIN_NUMBER_OF_DAYS = 'UPDATE_C5_MIN_NUMBER_OF_DAYS'
const DELETE_C5 = 'DELETE_C5'

export type C5 = {
  index: number
  kinmu_index: number
  min_number_of_days: number
}

type CreateC5 = {
  type: typeof CREATE_C5
  kinmu_index: number
  min_number_of_days: number
}

type UpdateC5KinmuIndex = {
  type: typeof UPDATE_C5_KINMU_INDEX
  index: number
  kinmu_index: number
}

type UpdateC5MinNumberOfDays = {
  type: typeof UPDATE_C5_MIN_NUMBER_OF_DAYS
  index: number
  min_number_of_days: number
}

type DeleteC5 = {
  type: typeof DELETE_C5
  index: number
}

type Action =
  | CreateC5
  | UpdateC5KinmuIndex
  | UpdateC5MinNumberOfDays
  | DeleteC5

export function createC5(kinmu_index: number, min_number_of_days: number): CreateC5 {
  return {
    kinmu_index,
    min_number_of_days,
    type: CREATE_C5,
  }
}

export function updateC5KinmuIndex(index: number, kinmu_index: number): UpdateC5KinmuIndex {
  return {
    index,
    kinmu_index,
    type: UPDATE_C5_KINMU_INDEX,
  }
}

export function updateC5MinNumberOfDays(index: number, min_number_of_days: number): UpdateC5MinNumberOfDays {
  return {
    index,
    min_number_of_days,
    type: UPDATE_C5_MIN_NUMBER_OF_DAYS,
  }
}

export function deleteC5(index: number): DeleteC5 {
  return {
    index,
    type: DELETE_C5,
  }
}

export type State = C5[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C5:
      return state.concat({
        index: Math.max(0, ...state.map(c => c.index)) + 1,
        kinmu_index: action.kinmu_index,
        min_number_of_days: action.min_number_of_days,
      })
    case UPDATE_C5_KINMU_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, kinmu_index: action.kinmu_index }
      })
    case UPDATE_C5_MIN_NUMBER_OF_DAYS:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, min_number_of_days: action.min_number_of_days }
      })
    case DELETE_C5:
      return state.filter(c => c.index !== action.index)
  }
  return state
}
