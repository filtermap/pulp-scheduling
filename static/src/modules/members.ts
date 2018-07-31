const UPDATE_MEMBER_IS_ENABLED = 'UPDATE_MEMBER_IS_ENABLED'
const UPDATE_MEMBER_NAME = 'UPDATE_MEMBER_NAME'

export type Member = {
  id: number
  is_enabled: boolean
  name: string
}

type UpdateMemberIsEnabled = {
  type: typeof UPDATE_MEMBER_IS_ENABLED
  id: number
  is_enabled: boolean
}

type UpdateMemberName = {
  type: typeof UPDATE_MEMBER_NAME
  id: number
  name: string
}

type Action =
  | UpdateMemberIsEnabled
  | UpdateMemberName

export function updateMemberIsEnabled(id: number, is_enabled: boolean): UpdateMemberIsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_MEMBER_IS_ENABLED,
  }
}

export function updateMemberName(id: number, name: string): UpdateMemberName {
  return {
    id,
    name,
    type: UPDATE_MEMBER_NAME,
  }
}

export type State = Member[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_MEMBER_IS_ENABLED:
      return state.map(member => {
        if (member.id !== action.id) {
          return member
        }
        return { ...member, is_enabled: action.is_enabled }
      })
    case UPDATE_MEMBER_NAME:
      return state.map(member => {
        if (member.id !== action.id) {
          return member
        }
        return { ...member, name: action.name }
      })
  }
  return state
}
