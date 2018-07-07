export type C7 = {
  index: number
  kinmu_index: number
  min_number_of_days: number
}

export type State = C7[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
