const CREATE_C3 = 'CREATE_C3'
const UPDATE_C3_IS_ENABLED = 'UPDATE_C3_IS_ENABLED'
const UPDATE_C3_MEMBER_ID = 'UPDATE_C3_MEMBER_ID'
const UPDATE_C3_KINMU_ID = 'UPDATE_C3_KINMU_ID'
const UPDATE_C3_MIN_NUMBER_OF_ASSIGNMENTS = 'UPDATE_C3_MIN_NUMBER_OF_ASSIGNMENTS'
const DELETE_C3 = 'DELETE_C3'

export type C3 = {
  id: number
  is_enabled: boolean
  member_id: number
  kinmu_id: number
  min_number_of_assignments: number
}

type CreateC3 = {
  type: typeof CREATE_C3
  is_enabled: boolean
  member_id: number
  kinmu_id: number
  min_number_of_assignments: number
}

type UpdateC3IsEnabled = {
  type: typeof UPDATE_C3_IS_ENABLED
  id: number
  is_enabled: boolean
}

type UpdateC3MemberId = {
  type: typeof UPDATE_C3_MEMBER_ID
  id: number
  member_id: number
}

type UpdateC3KinmuId = {
  type: typeof UPDATE_C3_KINMU_ID
  id: number
  kinmu_id: number
}

type UpdateC3MinNumberOfAssignments = {
  type: typeof UPDATE_C3_MIN_NUMBER_OF_ASSIGNMENTS
  id: number
  min_number_of_assignments: number
}

type DeleteC3 = {
  type: typeof DELETE_C3
  id: number
}

type Action =
  | CreateC3
  | UpdateC3IsEnabled
  | UpdateC3MemberId
  | UpdateC3KinmuId
  | UpdateC3MinNumberOfAssignments
  | DeleteC3

export function createC3(is_enabled: boolean, member_id: number, kinmu_id: number, min_number_of_assignments: number): CreateC3 {
  return {
    is_enabled,
    kinmu_id,
    member_id,
    min_number_of_assignments,
    type: CREATE_C3,
  }
}

export function updateC3IsEnabled(id: number, is_enabled: boolean): UpdateC3IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_C3_IS_ENABLED,
  }
}

export function updateC3MemberId(id: number, member_id: number): UpdateC3MemberId {
  return {
    id,
    member_id,
    type: UPDATE_C3_MEMBER_ID,
  }
}

export function updateC3KinmuId(id: number, kinmu_id: number): UpdateC3KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_C3_KINMU_ID,
  }
}

export function updateC3MinNumberOfAssignments(id: number, min_number_of_assignments: number): UpdateC3MinNumberOfAssignments {
  return {
    id,
    min_number_of_assignments,
    type: UPDATE_C3_MIN_NUMBER_OF_ASSIGNMENTS
  }
}

export function deleteC3(id: number): DeleteC3 {
  return {
    id,
    type: DELETE_C3,
  }
}

export type State = C3[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C3:
      return state.concat({
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        is_enabled: action.is_enabled,
        kinmu_id: action.kinmu_id,
        member_id: action.member_id,
        min_number_of_assignments: action.min_number_of_assignments,
      })
    case UPDATE_C3_IS_ENABLED:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, is_enabled: action.is_enabled }
      })
    case UPDATE_C3_MEMBER_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, member_id: action.member_id }
      })
    case UPDATE_C3_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case UPDATE_C3_MIN_NUMBER_OF_ASSIGNMENTS:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, min_number_of_assignments: action.min_number_of_assignments }
      })
    case DELETE_C3:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
