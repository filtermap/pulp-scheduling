const UPDATE_MEMBER_NAME = 'UPDATE_MEMBER_NAME'

export type Member = {
  id: number
  name: string
}

type UpdateMemberName = {
  type: typeof UPDATE_MEMBER_NAME
  id: number
  name: string
}

type Action = UpdateMemberName

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
