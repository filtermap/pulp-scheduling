const UPDATE_C3_MEMBER_INDEX = 'UPDATE_C3_MEMBER_INDEX'
const UPDATE_C3_KINMU_INDEX = 'UPDATE_C3_KINMU_INDEX'
const UPDATE_C3_MIN_NUMBER_OF_ASSIGNMENTS = 'UPDATE_C3_MIN_NUMBER_OF_ASSIGNMENTS'

export type C3 = {
  index: number
  member_index: number
  kinmu_index: number
  min_number_of_assignments: number
}

type UpdateC3MemberIndex = {
  type: typeof UPDATE_C3_MEMBER_INDEX
  index: number
  member_index: number
}

type UpdateC3KinmuIndex = {
  type: typeof UPDATE_C3_KINMU_INDEX
  index: number
  kinmu_index: number
}

type UpdateC3MinNumberOfAssignments = {
  type: typeof UPDATE_C3_MIN_NUMBER_OF_ASSIGNMENTS
  index: number
  min_number_of_assignments: number
}

type Action = UpdateC3MemberIndex | UpdateC3KinmuIndex | UpdateC3MinNumberOfAssignments

export function updateC3MemberIndex(index: number, member_index: number): UpdateC3MemberIndex {
  return {
    index,
    member_index,
    type: UPDATE_C3_MEMBER_INDEX,
  }
}

export function updateC3KinmuIndex(index: number, kinmu_index: number): UpdateC3KinmuIndex {
  return {
    index,
    kinmu_index,
    type: UPDATE_C3_KINMU_INDEX,
  }
}

export function updateC3MinNumberOfAssignments(index: number, min_number_of_assignments: number): UpdateC3MinNumberOfAssignments {
  return {
    index,
    min_number_of_assignments,
    type: UPDATE_C3_MIN_NUMBER_OF_ASSIGNMENTS
  }
}

export type State = C3[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_C3_MEMBER_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, member_index: action.member_index }
      })
    case UPDATE_C3_KINMU_INDEX:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, kinmu_index: action.kinmu_index }
      })
    case UPDATE_C3_MIN_NUMBER_OF_ASSIGNMENTS:
      return state.map(c => {
        if (c.index !== action.index) {
          return c
        }
        return { ...c, min_number_of_assignments: action.min_number_of_assignments }
      })
  }
  return state
}
