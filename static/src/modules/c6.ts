const UPDATE_C6_KINMU_INDEX = 'UPDATE_C6_KINMU_INDEX'
const UPDATE_C6_MAX_NUMBER_OF_DAYS = 'UPDATE_C6_MAX_NUMBER_OF_DAYS'

export type C6 = {
  index: number
  kinmu_index: number
  max_number_of_days: number
}

type UpdateC6KinmuIndex = {
  type: typeof UPDATE_C6_KINMU_INDEX
  index: number
  kinmu_index: number
}

type UpdateC6MaxNumberOfDays = {
  type: typeof UPDATE_C6_MAX_NUMBER_OF_DAYS
  index: number
  max_number_of_days: number
}

type Action = UpdateC6KinmuIndex | UpdateC6MaxNumberOfDays

export function updateC6KinmuIndex(index: number, kinmu_index: number): UpdateC6KinmuIndex {
  return {
    index,
    kinmu_index,
    type: UPDATE_C6_KINMU_INDEX,
  }
}

export function updateC6MaxNumberOfDays(index: number, max_number_of_days: number): UpdateC6MaxNumberOfDays {
  return {
    index,
    max_number_of_days,
    type: UPDATE_C6_MAX_NUMBER_OF_DAYS,
  }
}

export type State = C6[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_C6_KINMU_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, kinmu_index: action.kinmu_index }
      })
    case UPDATE_C6_MAX_NUMBER_OF_DAYS:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, max_number_of_days: action.max_number_of_days }
      })
  }
  return state
}
