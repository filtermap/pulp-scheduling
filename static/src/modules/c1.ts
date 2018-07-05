export type C1 = {
  index: number
  start_date_name: string
  stop_date_name: string
  kinmu_name: string
  group_name: string
  min_number_of_assignments: number
}

export type State = C1[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
