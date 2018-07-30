const UPDATE_GROUP_NAME = 'UPDATE_GROUP_NAME'

export type Group = {
  id: number
  name: string
}

type UpdateGroupName = {
  type: typeof UPDATE_GROUP_NAME
  id: number
  name: string
}

type Action = UpdateGroupName

export function updateGroupName(id: number, name: string): UpdateGroupName {
  return {
    id,
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
        if (group.id !== action.id) {
          return group
        }
        return { ...group, name: action.name }
      })
  }
  return state
}
