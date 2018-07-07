export type C3 = {
  index: number
  member_index: number
  kinmu_index: number
  min_number_of_assignments: number
}

export type State = C3[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
