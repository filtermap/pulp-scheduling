const DELETE_ROSTER = 'DELETE_ROSTER'

export type Assignment = {
  index: number
  roster_id: number
  date_name: string
  member_index: number
  kinmu_index: number
}

type DeleteRoster = {
  type: typeof DELETE_ROSTER
  roster_id: number
}

type Action =
  | DeleteRoster

export function deleteRoster(roster_id: number): DeleteRoster {
  return {
    roster_id,
    type: DELETE_ROSTER,
  }
}

export type State = Assignment[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case DELETE_ROSTER:
      return state.filter(assignment => assignment.roster_id !== action.roster_id)
  }
  return state
}
