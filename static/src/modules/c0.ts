export type C0 = {
  id: number
}

export type State = C0[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
