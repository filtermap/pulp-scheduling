export type Member = {
  index: number
  name: string
}

export type State = Member[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
