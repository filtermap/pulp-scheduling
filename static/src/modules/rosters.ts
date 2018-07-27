export type Roster = {
  index: number
  roster_id: number
}

export type State = Roster[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
