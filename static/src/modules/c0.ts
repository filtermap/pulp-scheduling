export type C0 = {
  index: number
  sequence_id: number
}

export type State = C0[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
