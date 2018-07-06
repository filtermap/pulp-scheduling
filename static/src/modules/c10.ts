export type C10 = {
  index: number
  member_name: string
  start_date_name: string
  stop_date_name: string
  kinmu_name: string
}

export type State = C10[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
