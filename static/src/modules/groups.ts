export type Group = {
  index: number
  name: string
}

export type State = Group[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
