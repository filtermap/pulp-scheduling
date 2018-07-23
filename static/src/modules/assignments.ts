const CREATE_ROSTER = 'CREATE_ROSTER'
const DELETE_ROSTER = 'DELETE_ROSTER'

export type Assignment = {
  index: number
  roster_id: number
  date_name: string
  member_index: number
  kinmu_index: number
}

type CreateRoster = {
  type: typeof CREATE_ROSTER
  assignments: Assignment[]
}

type DeleteRoster = {
  type: typeof DELETE_ROSTER
  roster_id: number
}

type Action =
  | CreateRoster
  | DeleteRoster

export function createRoster(assignments: Assignment[]): CreateRoster {
  return {
    assignments,
    type: CREATE_ROSTER,
  }
}

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
    case CREATE_ROSTER: {
      const assignment_index = Math.max(0, ...state.map(assignment => assignment.index)) + 1
      const roster_id = Math.max(0, ...state.map(assignment => assignment.roster_id)) + 1
      return state.concat(action.assignments.map((assignment, index) => ({
        date_name: assignment.date_name,
        index: assignment_index + index,
        kinmu_index: assignment.kinmu_index,
        member_index: assignment.member_index,
        roster_id,
      })))
    }
    case DELETE_ROSTER:
      return state.filter(assignment => assignment.roster_id !== action.roster_id)
  }
  return state
}
