export type C2 = {
  index: number
  start_date_name: string
  stop_date_name: string
  kinmu_index: number
  group_index: number
  max_number_of_assignments: number
}

export type State = C2[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}