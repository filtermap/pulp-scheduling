export type C8 = {
  index: number
  kinmu_name: string
  max_number_of_days: number
}

export type State = C8[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
