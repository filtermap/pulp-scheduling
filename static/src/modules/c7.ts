const CREATE_C7 = 'CREATE_C7'
const UPDATE_C7_KINMU_INDEX = 'UPDATE_C7_KINMU_INDEX'
const UPDATE_C7_MIN_NUMBER_OF_DAYS = 'UPDATE_C7_MIN_NUMBER_OF_DAYS'
const DELETE_C7 = 'DELETE_C7'

export type C7 = {
  index: number
  kinmu_index: number
  min_number_of_days: number
}

type CreateC7 = {
  type: typeof CREATE_C7
  kinmu_index: number
  min_number_of_days: number
}

type UpdateC7KinmuIndex = {
  type: typeof UPDATE_C7_KINMU_INDEX
  index: number
  kinmu_index: number
}

type UpdateC7MinNumberOfDays = {
  type: typeof UPDATE_C7_MIN_NUMBER_OF_DAYS
  index: number
  min_number_of_days: number
}

type DeleteC7 = {
  type: typeof DELETE_C7
  index: number
}

type Action =
  | CreateC7
  | UpdateC7KinmuIndex
  | UpdateC7MinNumberOfDays
  | DeleteC7

export function createC7(kinmu_index: number, min_number_of_days: number): CreateC7 {
  return {
    kinmu_index,
    min_number_of_days,
    type: CREATE_C7,
  }
}

export function updateC7KinmuIndex(index: number, kinmu_index: number): UpdateC7KinmuIndex {
  return {
    index,
    kinmu_index,
    type: UPDATE_C7_KINMU_INDEX
  }
}

export function updateC7MinNumberOfDays(index: number, min_number_of_days: number): UpdateC7MinNumberOfDays {
  return {
    index,
    min_number_of_days,
    type: UPDATE_C7_MIN_NUMBER_OF_DAYS
  }
}

export function deleteC7(index: number): DeleteC7 {
  return {
    index,
    type: DELETE_C7,
  }
}

export type State = C7[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C7:
      return state.concat({
        index: Math.max(...state.map(c => c.index)) + 1,
        kinmu_index: action.kinmu_index,
        min_number_of_days: action.min_number_of_days,
      })
    case UPDATE_C7_KINMU_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, kinmu_index: action.kinmu_index }
      })
    case UPDATE_C7_MIN_NUMBER_OF_DAYS:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, min_number_of_days: action.min_number_of_days }
      })
    case DELETE_C7:
      return state.filter(c => c.index !== action.index)
  }
  return state
}
