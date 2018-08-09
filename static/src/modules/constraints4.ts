const CREATE_CONSTRAINT4 = 'CREATE_CONSTRAINT4'
const UPDATE_CONSTRAINT4_IS_ENABLED = 'UPDATE_CONSTRAINT4_IS_ENABLED'
const UPDATE_CONSTRAINT4_MEMBER_ID = 'UPDATE_CONSTRAINT4_MEMBER_ID'
const UPDATE_CONSTRAINT4_KINMU_ID = 'UPDATE_CONSTRAINT4_KINMU_ID'
const UPDATE_CONSTRAINT4_MAX_NUMBER_OF_ASSIGNMENTS = 'UPDATE_CONSTRAINT4_MAX_NUMBER_OF_ASSIGNMENTS'
const DELETE_CONSTRAINT4 = 'DELETE_CONSTRAINT4'

export type Constraint4 = {
  id: number
  is_enabled: boolean
  member_id: number
  kinmu_id: number
  max_number_of_assignments: number
}

export const minOfConstraint4MaxNumberOfAssignments = 0

type CreateConstraint4 = {
  type: typeof CREATE_CONSTRAINT4
  is_enabled: boolean
  member_id: number
  kinmu_id: number
  max_number_of_assignments: number
}

type UpdateConstraint4IsEnabled = {
  type: typeof UPDATE_CONSTRAINT4_IS_ENABLED
  id: number
  is_enabled: boolean
}

type UpdateConstraint4MemberId = {
  type: typeof UPDATE_CONSTRAINT4_MEMBER_ID
  id: number
  member_id: number
}

type UpdateConstraint4KinmuId = {
  type: typeof UPDATE_CONSTRAINT4_KINMU_ID
  id: number
  kinmu_id: number
}

type UpdateConstraint4MaxNumberOfAssignments = {
  type: typeof UPDATE_CONSTRAINT4_MAX_NUMBER_OF_ASSIGNMENTS
  id: number
  max_number_of_assignments: number
}

type DeleteConstraint4 = {
  type: typeof DELETE_CONSTRAINT4
  id: number
}

type Action =
  | CreateConstraint4
  | UpdateConstraint4IsEnabled
  | UpdateConstraint4MemberId
  | UpdateConstraint4KinmuId
  | UpdateConstraint4MaxNumberOfAssignments
  | DeleteConstraint4

export function createConstraint4(is_enabled: boolean, member_id: number, kinmu_id: number, max_number_of_assignments: number): CreateConstraint4 {
  return {
    is_enabled,
    kinmu_id,
    max_number_of_assignments,
    member_id,
    type: CREATE_CONSTRAINT4,
  }
}

export function updateConstraint4IsEnabled(id: number, is_enabled: boolean): UpdateConstraint4IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_CONSTRAINT4_IS_ENABLED,
  }
}

export function updateConstraint4MemberId(id: number, member_id: number): UpdateConstraint4MemberId {
  return {
    id,
    member_id,
    type: UPDATE_CONSTRAINT4_MEMBER_ID,
  }
}

export function updateConstraint4KinmuId(id: number, kinmu_id: number): UpdateConstraint4KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_CONSTRAINT4_KINMU_ID,
  }
}

export function updateConstraint4MaxNumberOfAssignments(id: number, max_number_of_assignments: number): UpdateConstraint4MaxNumberOfAssignments {
  return {
    id,
    max_number_of_assignments,
    type: UPDATE_CONSTRAINT4_MAX_NUMBER_OF_ASSIGNMENTS
  }
}

export function deleteConstraint4(id: number): DeleteConstraint4 {
  return {
    id,
    type: DELETE_CONSTRAINT4,
  }
}

export type State = Constraint4[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_CONSTRAINT4:
      return state.concat({
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        max_number_of_assignments: action.max_number_of_assignments,
        member_id: action.member_id,
      })
    case UPDATE_CONSTRAINT4_IS_ENABLED:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, is_enabled: action.is_enabled }
      })
    case UPDATE_CONSTRAINT4_MEMBER_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, member_id: action.member_id }
      })
    case UPDATE_CONSTRAINT4_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case UPDATE_CONSTRAINT4_MAX_NUMBER_OF_ASSIGNMENTS:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, max_number_of_assignments: action.max_number_of_assignments }
      })
    case DELETE_CONSTRAINT4:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
