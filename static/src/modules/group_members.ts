const CREATE_GROUP_MEMBER = 'CREATE_GROUP_MEMBER'
const DELETE_GROUP_MEMBER = 'DELETE_GROUP_MEMBER'

export type GroupMember = {
  index: number
  group_index: number
  member_index: number
}

type CreateGroupMember = {
  type: typeof CREATE_GROUP_MEMBER
  group_index: number
  member_index: number
}

type DeleteGroupMember = {
  type: typeof DELETE_GROUP_MEMBER
  group_index: number
  member_index: number
}

type Action = CreateGroupMember | DeleteGroupMember

export function createGroupMember(group_index: number, member_index: number): CreateGroupMember {
  return {
    group_index,
    member_index,
    type: CREATE_GROUP_MEMBER,
  }
}

export function deleteGroupMember(group_index: number, member_index: number): DeleteGroupMember {
  return {
    group_index,
    member_index,
    type: DELETE_GROUP_MEMBER,
  }
}

export type State = GroupMember[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_GROUP_MEMBER:
      return state.concat({ index: Math.max(0, ...state.map(group_member => group_member.index)) + 1, group_index: action.group_index, member_index: action.member_index })
    case DELETE_GROUP_MEMBER:
      return state.filter(group_member => !(group_member.group_index === action.group_index && group_member.member_index === action.member_index))
  }
  return state
}
