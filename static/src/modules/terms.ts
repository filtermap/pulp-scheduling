export type Term = {
  index: number
  start_date_name: string
  stop_date_name: string
}

export type State = Term[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
