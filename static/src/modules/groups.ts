const UPDATE_GROUP_IS_ENABLED = "UPDATE_GROUP_IS_ENABLED";
const UPDATE_GROUP_NAME = "UPDATE_GROUP_NAME";

export type Group = {
  id: number;
  term_id: number;
  is_enabled: boolean;
  name: string;
};

type UpdateGroupIsEnabled = {
  type: typeof UPDATE_GROUP_IS_ENABLED;
  id: number;
  is_enabled: boolean;
};

type UpdateGroupName = {
  type: typeof UPDATE_GROUP_NAME;
  id: number;
  name: string;
};

type Action = UpdateGroupIsEnabled | UpdateGroupName;

export function updateGroupIsEnabled(
  id: number,
  is_enabled: boolean
): UpdateGroupIsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_GROUP_IS_ENABLED,
  };
}

export function updateGroupName(id: number, name: string): UpdateGroupName {
  return {
    id,
    name,
    type: UPDATE_GROUP_NAME,
  };
}

export type State = Group[];

const initialState: State = [];

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_GROUP_IS_ENABLED:
      return state.map((group) => {
        if (group.id !== action.id) {
          return group;
        }
        return { ...group, is_enabled: action.is_enabled };
      });
    case UPDATE_GROUP_NAME:
      return state.map((group) => {
        if (group.id !== action.id) {
          return group;
        }
        return { ...group, name: action.name };
      });
  }
  return state;
}
