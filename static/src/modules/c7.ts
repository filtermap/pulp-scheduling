const UPDATE_C7_KINMU_INDEX = 'UPDATE_C7_KINMU_INDEX'
const UPDATE_C7_MIN_NUMBER_OF_DAYS = 'UPDATE_C7_MIN_NUMBER_OF_DAYS'

export type C7 = {
  index: number
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

type Action = UpdateC7KinmuIndex | UpdateC7MinNumberOfDays

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

export type State = C7[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
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
  }
  return state
}
