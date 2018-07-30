const CREATE_C0_KINMU = 'CREATE_C0_KINMU'
const UPDATE_C0_KINMU_KINMU_ID = 'UPDATE_C0_KINMU_KINMU_ID'
const DELETE_C0_KINMU = 'DELETE_C0_KINMU'

export type C0Kinmu = {
  id: number
  c0_id: number
  sequence_number: number
  kinmu_id: number
}

type CreateC0Kinmu = {
  type: typeof CREATE_C0_KINMU
  c0_id: number
  sequence_number: number
  kinmu_id: number
}

type UpdateC0KinmuKinmuId = {
  type: typeof UPDATE_C0_KINMU_KINMU_ID
  id: number
  kinmu_id: number
}

type DeleteC0Kinmu = {
  type: typeof DELETE_C0_KINMU
  id: number
}

type Action =
  | CreateC0Kinmu
  | UpdateC0KinmuKinmuId
  | DeleteC0Kinmu

export function createC0Kinmu(c0_id: number, sequence_number: number, kinmu_id: number): CreateC0Kinmu {
  return {
    c0_id,
    kinmu_id,
    sequence_number,
    type: CREATE_C0_KINMU,
  }
}

export function updateC0KinmuKinmuId(id: number, kinmu_id: number): UpdateC0KinmuKinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_C0_KINMU_KINMU_ID,
  }
}

export function deleteC0Kinmu(id: number): DeleteC0Kinmu {
  return {
    id,
    type: DELETE_C0_KINMU,
  }
}

export type State = C0Kinmu[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_C0_KINMU:
      return state.map(c_kinmu => {
        if (c_kinmu.c0_id !== action.c0_id) {
          return c_kinmu
        }
        const sequence_number = c_kinmu.sequence_number < action.sequence_number ?
          c_kinmu.sequence_number :
          c_kinmu.sequence_number + 1
        return ({ ...c_kinmu, sequence_number, })
      }).concat({
        c0_id: action.c0_id,
        id: Math.max(0, ...state.map(({ id }) => id)) + 1,
        kinmu_id: action.kinmu_id,
        sequence_number: action.sequence_number,
      })
    case UPDATE_C0_KINMU_KINMU_ID:
      return state.map(c_kinmu => {
        if (c_kinmu.id !== action.id) {
          return c_kinmu
        }
        return { ...c_kinmu, kinmu_id: action.kinmu_id }
      })
    case DELETE_C0_KINMU: {
      const deleted_c_kinmu = state.find(({ id }) => id === action.id)!
      return state
        .filter(c_kinmu => c_kinmu.id !== action.id)
        .map(c_kinmu => {
          if (c_kinmu.c0_id !== deleted_c_kinmu.c0_id) {
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
