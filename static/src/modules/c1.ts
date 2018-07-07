export type C1 = {
  index: number
  start_date_name: string
  stop_date_name: string
  kinmu_index: number
  group_index: number
  min_number_of_assignments: number
}

export type State = C1[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
