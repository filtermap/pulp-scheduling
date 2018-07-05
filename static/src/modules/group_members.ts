export type GroupMember = {
  index: number
  group_name: string
  member_name: string
}

export type State = GroupMember[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
