const UPDATE_MEMBER_NAME = 'UPDATE_MEMBER_NAME'

export type Member = {
  index: number
  name: string
}

type UpdateMemberName = {
  type: typeof UPDATE_MEMBER_NAME
  index: number
  name: string
}

type Action = UpdateMemberName

export function updateMemberName(index: number, name: string): UpdateMemberName {
  return {
    index,
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
        if (member.index !== action.index) {
          return member
        }
        return { ...member, name: action.name }
      })
  }
  return state
}
