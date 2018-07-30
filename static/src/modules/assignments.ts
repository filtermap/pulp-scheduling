export type Assignment = {
  id: number
  roster_id: number
  date_name: string
  member_id: number
  kinmu_id: number
}

export type State = Assignment[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
