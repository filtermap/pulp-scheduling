export type C4 = {
  index: number
  member_index: number
  kinmu_index: number
  max_number_of_assignments: number
}

export type State = C4[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
