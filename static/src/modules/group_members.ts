export type GroupMember = {
  index: number
  group_index: number
  member_index: number
}

export type State = GroupMember[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
