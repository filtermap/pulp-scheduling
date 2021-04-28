const CREATE_GROUP_MEMBER = "CREATE_GROUP_MEMBER";
const DELETE_GROUP_MEMBER = "DELETE_GROUP_MEMBER";

export type GroupMember = {
  id: number;
  group_id: number;
  member_id: number;
};

type CreateGroupMember = {
  type: typeof CREATE_GROUP_MEMBER;
  group_id: number;
  member_id: number;
};

type DeleteGroupMember = {
  type: typeof DELETE_GROUP_MEMBER;
  group_id: number;
  member_id: number;
};

type Action = CreateGroupMember | DeleteGroupMember;

export function createGroupMember(
  group_id: number,
  member_id: number
): CreateGroupMember {
  return {
    group_id,
    member_id,
    type: CREATE_GROUP_MEMBER,
  };
}

export function deleteGroupMember(
  group_id: number,
  member_id: number
): DeleteGroupMember {
  return {
    group_id,
    member_id,
    type: DELETE_GROUP_MEMBER,
  };
}

export type State = GroupMember[];

const initialState: State = [];

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_GROUP_MEMBER:
      return state.concat({
        id: Math.max(0, ...state.map((group_member) => group_member.id)) + 1,
        group_id: action.group_id,
        member_id: action.member_id,
      });
    case DELETE_GROUP_MEMBER:
      return state.filter(
        (group_member) =>
          !(
            group_member.group_id === action.group_id &&
            group_member.member_id === action.member_id
          )
      );
  }
  return state;
}
