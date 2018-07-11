const UPDATE_C4_MEMBER_INDEX = 'UPDATE_C4_MEMBER_INDEX'
const UPDATE_C4_KINMU_INDEX = 'UPDATE_C4_KINMU_INDEX'
const UPDATE_C4_MAX_NUMBER_OF_ASSIGNMENTS = 'UPDATE_C4_MAX_NUMBER_OF_ASSIGNMENTS'
const DELETE_C4 = 'DELETE_C4'

export type C4 = {
  index: number
  member_index: number
  kinmu_index: number
  max_number_of_assignments: number
}

type UpdateC4MemberIndex = {
  type: typeof UPDATE_C4_MEMBER_INDEX
  index: number
  member_index: number
}

type UpdateC4KinmuIndex = {
  type: typeof UPDATE_C4_KINMU_INDEX
  index: number
  kinmu_index: number
}

type UpdateC4MaxNumberOfAssignments = {
  type: typeof UPDATE_C4_MAX_NUMBER_OF_ASSIGNMENTS
  index: number
  max_number_of_assignments: number
}

type DeleteC4 = {
  type: typeof DELETE_C4
  index: number
}

type Action =
  | UpdateC4MemberIndex
  | UpdateC4KinmuIndex
  | UpdateC4MaxNumberOfAssignments
  | DeleteC4

export function updateC4MemberIndex(index: number, member_index: number): UpdateC4MemberIndex {
  return {
    index,
    member_index,
    type: UPDATE_C4_MEMBER_INDEX,
  }
}

export function updateC4KinmuIndex(index: number, kinmu_index: number): UpdateC4KinmuIndex {
  return {
    index,
    kinmu_index,
    type: UPDATE_C4_KINMU_INDEX,
  }
}

export function updateC4MaxNumberOfAssignments(index: number, max_number_of_assignments: number): UpdateC4MaxNumberOfAssignments {
  return {
    index,
    max_number_of_assignments,
    type: UPDATE_C4_MAX_NUMBER_OF_ASSIGNMENTS
  }
}

export function deleteC4(index: number): DeleteC4 {
  return {
    index,
    type: DELETE_C4,
  }
}

export type State = C4[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_C4_MEMBER_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, member_index: action.member_index }
      })
    case UPDATE_C4_KINMU_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, kinmu_index: action.kinmu_index }
      })
    case UPDATE_C4_MAX_NUMBER_OF_ASSIGNMENTS:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, max_number_of_assignments: action.max_number_of_assignments }
      })
    case DELETE_C4:
      return state.filter(c => c.index !== action.index)
  }
  return state
}
