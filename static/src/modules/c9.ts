export type C9 = {
  index: number
  member_name: string
  date_name: string
  kinmu_name: string
}

export type State = C9[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
