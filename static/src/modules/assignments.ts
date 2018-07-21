export type Assignment = {
  index: number
  roster_id: number
  date_name: string
  member_index: number
  kinmu_index: number
}

export type State = Assignment[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
