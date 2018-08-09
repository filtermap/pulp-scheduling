const CREATE_CONSTRAINT3 = 'CREATE_CONSTRAINT3'
const UPDATE_CONSTRAINT3_IS_ENABLED = 'UPDATE_CONSTRAINT3_IS_ENABLED'
const UPDATE_CONSTRAINT3_MEMBER_ID = 'UPDATE_CONSTRAINT3_MEMBER_ID'
const UPDATE_CONSTRAINT3_KINMU_ID = 'UPDATE_CONSTRAINT3_KINMU_ID'
const UPDATE_CONSTRAINT3_MIN_NUMBER_OF_ASSIGNMENTS = 'UPDATE_CONSTRAINT3_MIN_NUMBER_OF_ASSIGNMENTS'
const DELETE_CONSTRAINT3 = 'DELETE_CONSTRAINT3'

export type Constraint3 = {
  id: number
  is_enabled: boolean
  member_id: number
  kinmu_id: number
  min_number_of_assignments: number
}

export const minOfConstraint3MinNumberOfAssignments = 1

type CreateConstraint3 = {
  type: typeof CREATE_CONSTRAINT3
  is_enabled: boolean
  member_id: number
  kinmu_id: number
  min_number_of_assignments: number
}

type UpdateConstraint3IsEnabled = {
  type: typeof UPDATE_CONSTRAINT3_IS_ENABLED
  id: number
  is_enabled: boolean
}

type UpdateConstraint3MemberId = {
  type: typeof UPDATE_CONSTRAINT3_MEMBER_ID
  id: number
  member_id: number
}

type UpdateConstraint3KinmuId = {
  type: typeof UPDATE_CONSTRAINT3_KINMU_ID
  id: number
  kinmu_id: number
}

type UpdateConstraint3MinNumberOfAssignments = {
  type: typeof UPDATE_CONSTRAINT3_MIN_NUMBER_OF_ASSIGNMENTS
  id: number
  min_number_of_assignments: number
}

type DeleteConstraint3 = {
  type: typeof DELETE_CONSTRAINT3
  id: number
}

type Action =
  | CreateConstraint3
  | UpdateConstraint3IsEnabled
  | UpdateConstraint3MemberId
  | UpdateConstraint3KinmuId
  | UpdateConstraint3MinNumberOfAssignments
  | DeleteConstraint3

export function createConstraint3(is_enabled: boolean, member_id: number, kinmu_id: number, min_number_of_assignments: number): CreateConstraint3 {
  return {
    is_enabled,
    kinmu_id,
    member_id,
    min_number_of_assignments,
    type: CREATE_CONSTRAINT3,
  }
}

export function updateConstraint3IsEnabled(id: number, is_enabled: boolean): UpdateConstraint3IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_CONSTRAINT3_IS_ENABLED,
  }
}

export function updateConstraint3MemberId(id: number, member_id: number): UpdateConstraint3MemberId {
  return {
    id,
    member_id,
    type: UPDATE_CONSTRAINT3_MEMBER_ID,
  }
}

export function updateConstraint3KinmuId(id: number, kinmu_id: number): UpdateConstraint3KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_CONSTRAINT3_KINMU_ID,
  }
}

export function updateConstraint3MinNumberOfAssignments(id: number, min_number_of_assignments: number): UpdateConstraint3MinNumberOfAssignments {
  return {
    id,
    min_number_of_assignments,
    type: UPDATE_CONSTRAINT3_MIN_NUMBER_OF_ASSIGNMENTS
  }
}

export function deleteConstraint3(id: number): DeleteConstraint3 {
  return {
    id,
    type: DELETE_CONSTRAINT3,
  }
}

export type State = Constraint3[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_CONSTRAINT3:
      return state.concat({
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        member_id: action.member_id,
        min_number_of_assignments: action.min_number_of_assignments,
      })
    case UPDATE_CONSTRAINT3_IS_ENABLED:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, is_enabled: action.is_enabled }
      })
    case UPDATE_CONSTRAINT3_MEMBER_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, member_id: action.member_id }
      })
    case UPDATE_CONSTRAINT3_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case UPDATE_CONSTRAINT3_MIN_NUMBER_OF_ASSIGNMENTS:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, min_number_of_assignments: action.min_number_of_assignments }
      })
    case DELETE_CONSTRAINT3:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
