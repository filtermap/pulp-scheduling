export type Kinmu = {
  index: number
  name: string
}

export type State = Kinmu[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
