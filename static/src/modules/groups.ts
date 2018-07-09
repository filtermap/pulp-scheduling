const UPDATE_GROUP_NAME = 'UPDATE_GROUP_NAME'

export type Group = {
  index: number
  name: string
}

type UpdateGroupName = {
  type: typeof UPDATE_GROUP_NAME
  index: number
  name: string
}

type Action = UpdateGroupName

export function updateGroupName(index: number, name: string): UpdateGroupName {
  return {
    index,
    name,
    type: UPDATE_GROUP_NAME,
  }
}

export type State = Group[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_GROUP_NAME:
      return state.map(group => {
        if (group.index !== action.index) {
          return group
        }
        return { ...group, name: action.name }
      })
  }
  return state
}
