const UPDATE_C8_KINMU_INDEX = 'UPDATE_C8_KINMU_INDEX'
const UPDATE_C8_MAX_NUMBER_OF_DAYS = 'UPDATE_C8_MAX_NUMBER_OF_DAYS'
const DELETE_C8 = 'DELETE_C8'

export type C8 = {
  index: number
  kinmu_index: number
  max_number_of_days: number
}

type UpdateC8KinmuIndex = {
  type: typeof UPDATE_C8_KINMU_INDEX
  index: number
  kinmu_index: number
}

type UpdateC8MaxNumberOfDays = {
  type: typeof UPDATE_C8_MAX_NUMBER_OF_DAYS
  index: number
  max_number_of_days: number
}

type DeleteC8 = {
  type: typeof DELETE_C8
  index: number
}

type Action =
  | UpdateC8KinmuIndex
  | UpdateC8MaxNumberOfDays
  | DeleteC8

export function updateC8KinmuIndex(index: number, kinmu_index: number): UpdateC8KinmuIndex {
  return {
    index,
    kinmu_index,
    type: UPDATE_C8_KINMU_INDEX
  }
}

export function updateC8MaxNumberOfDays(index: number, max_number_of_days: number): UpdateC8MaxNumberOfDays {
  return {
    index,
    max_number_of_days,
    type: UPDATE_C8_MAX_NUMBER_OF_DAYS,
  }
}

export function deleteC8(index: number): DeleteC8 {
  return {
    index,
    type: DELETE_C8,
  }
}

export type State = C8[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_C8_KINMU_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, kinmu_index: action.kinmu_index }
      })
    case UPDATE_C8_MAX_NUMBER_OF_DAYS:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, max_number_of_days: action.max_number_of_days }
      })
    case DELETE_C8:
      return state.filter(c => c.index !== action.index)
  }
  return state
}
