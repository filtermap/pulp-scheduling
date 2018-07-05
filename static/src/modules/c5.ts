export type C5 = {
  index: number
  kinmu_name: string
  min_number_of_days: number
}

export type State = C5[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
