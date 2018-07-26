const CREATE_C0_KINMU = 'CREATE_C0_KINMU'
const UPDATE_C0_KINMU_KINMU_INDEX = 'UPDATE_C0_KINMU_KINMU_INDEX'
const DELETE_C0_KINMU = 'DELETE_C0_KINMU'

export type C0Kinmu = {
  index: number
  sequence_id: number
  sequence_number: number
  kinmu_index: number
}

type CreateC0Kinmu = {
  type: typeof CREATE_C0_KINMU
  sequence_id: number
  sequence_number: number
  kinmu_index: number
}

type UpdateC0KinmuKinmuIndex = {
  type: typeof UPDATE_C0_KINMU_KINMU_INDEX
  index: number
  kinmu_index: number
}

type DeleteC0Kinmu = {
  type: typeof DELETE_C0_KINMU
  index: number
}

type Action =
  | CreateC0Kinmu
  | UpdateC0KinmuKinmuIndex
  | DeleteC0Kinmu

export function createC0Kinmu(sequence_id: number, sequence_number: number, kinmu_index: number): CreateC0Kinmu {
  return {
    kinmu_index,
    sequence_id,
    sequence_number,
    type: CREATE_C0_KINMU,
  }
}

export function updateC0KinmuKinmuIndex(index: number, kinmu_index: number): UpdateC0KinmuKinmuIndex {
  return {
    index,
    kinmu_index,
    type: UPDATE_C0_KINMU_KINMU_INDEX,
  }
}

export function deleteC0Kinmu(index: number): DeleteC0Kinmu {
  return {
    index,
    type: DELETE_C0_KINMU,
  }
}

export type State = C0Kinmu[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C0_KINMU:
      return state.map(c_kinmu => {
        if (c_kinmu.sequence_id !== action.sequence_id) {
          return c_kinmu
        }
        const sequence_number = c_kinmu.sequence_number < action.sequence_number ?
          c_kinmu.sequence_number :
          c_kinmu.sequence_number + 1
        return ({ ...c_kinmu, sequence_number, })
      }).concat({
        index: Math.max(0, ...state.map(c_kinmu => c_kinmu.index)) + 1,
        kinmu_index: action.kinmu_index,
        sequence_id: action.sequence_id,
        sequence_number: action.sequence_number,
      })
    case UPDATE_C0_KINMU_KINMU_INDEX:
      return state.map(c_kinmu => {
        if (c_kinmu.index !== action.index) {
          return c_kinmu
        }
        return { ...c_kinmu, kinmu_index: action.kinmu_index }
      })
    case DELETE_C0_KINMU: {
      const deleted_c_kinmu = state.find(c_kinmu => c_kinmu.index === action.index)!
      return state
        .filter(c_kinmu => c_kinmu.index !== action.index)
        .map(c_kinmu => {
          if (c_kinmu.sequence_id !== deleted_c_kinmu.sequence_id) {
            return c_kinmu
          }
          const sequence_number = c_kinmu.sequence_number < deleted_c_kinmu.sequence_number ?
            c_kinmu.sequence_number :
            c_kinmu.sequence_number - 1
          return { ...c_kinmu, sequence_number }
        })
    }
  }
  return state
}
