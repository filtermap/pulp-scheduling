const UPDATE_C5_KINMU_INDEX = 'UPDATE_C5_KINMU_INDEX'
const UPDATE_C5_MIN_NUMBER_OF_DAYS = 'UPDATE_C5_MIN_NUMBER_OF_DAYS'

export type C5 = {
  index: number
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

type Action = UpdateC5KinmuIndex | UpdateC5MinNumberOfDays

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

export type State = C5[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
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
  }
  return state
}
