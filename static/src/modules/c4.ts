const CREATE_C4 = 'CREATE_C4'
const UPDATE_C4_MEMBER_ID = 'UPDATE_C4_MEMBER_ID'
const UPDATE_C4_KINMU_ID = 'UPDATE_C4_KINMU_ID'
const UPDATE_C4_MAX_NUMBER_OF_ASSIGNMENTS = 'UPDATE_C4_MAX_NUMBER_OF_ASSIGNMENTS'
const DELETE_C4 = 'DELETE_C4'

export type C4 = {
  id: number
  member_id: number
  kinmu_id: number
  max_number_of_assignments: number
}

type CreateC4 = {
  type: typeof CREATE_C4
  member_id: number
  kinmu_id: number
  max_number_of_assignments: number
}

type UpdateC4MemberId = {
  type: typeof UPDATE_C4_MEMBER_ID
  id: number
  member_id: number
}

type UpdateC4KinmuId = {
  type: typeof UPDATE_C4_KINMU_ID
  id: number
  kinmu_id: number
}

type UpdateC4MaxNumberOfAssignments = {
  type: typeof UPDATE_C4_MAX_NUMBER_OF_ASSIGNMENTS
  id: number
  max_number_of_assignments: number
}

type DeleteC4 = {
  type: typeof DELETE_C4
  id: number
}

type Action =
  |CreateC4
  | UpdateC4MemberId
  | UpdateC4KinmuId
  | UpdateC4MaxNumberOfAssignments
  | DeleteC4

export function createC4(member_id: number, kinmu_id: number, max_number_of_assignments: number): CreateC4 {
  return {
    kinmu_id,
    max_number_of_assignments,
    member_id,
    type: CREATE_C4,
  }
}

export function updateC4MemberId(id: number, member_id: number): UpdateC4MemberId {
  return {
    id,
    member_id,
    type: UPDATE_C4_MEMBER_ID,
  }
}

export function updateC4KinmuId(id: number, kinmu_id: number): UpdateC4KinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_C4_KINMU_ID,
  }
}

export function updateC4MaxNumberOfAssignments(id: number, max_number_of_assignments: number): UpdateC4MaxNumberOfAssignments {
  return {
    id,
    max_number_of_assignments,
    type: UPDATE_C4_MAX_NUMBER_OF_ASSIGNMENTS
  }
}

export function deleteC4(id: number): DeleteC4 {
  return {
    id,
    type: DELETE_C4,
  }
}

export type State = C4[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C4:
      return state.concat({
        id: Math.max(0, ...state.map(c => c.id)) + 1,
        kinmu_id: action.kinmu_id,
        max_number_of_assignments: action.max_number_of_assignments,
        member_id: action.member_id,
      })
    case UPDATE_C4_MEMBER_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, member_id: action.member_id }
      })
    case UPDATE_C4_KINMU_ID:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, kinmu_id: action.kinmu_id }
      })
    case UPDATE_C4_MAX_NUMBER_OF_ASSIGNMENTS:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, max_number_of_assignments: action.max_number_of_assignments }
      })
    case DELETE_C4:
      return state.filter(c => c.id !== action.id)
  }
  return state
}
