const CREATE_SEQUENCE = 'CREATE_SEQUENCE'
const CREATE_RENZOKU_KINSHI_KINMU = 'CREATE_RENZOKU_KINSHI_KINMU'
const UPDATE_RENZOKU_KINSHI_KINMU_KINMU_INDEX = 'UPDATE_RENZOKU_KINSHI_KINMU_KINMU_INDEX'
const DELETE_RENZOKU_KINSHI_KINMU = 'DELETE_RENZOKU_KINSHI_KINMU'
const DELETE_SEQUENCE = 'DELETE_SEQUENCE'

export type RenzokuKinshiKinmu = {
  index: number
  sequence_id: number
  sequence_number: number
  kinmu_index: number
}

type CreateSequence = {
  type: typeof CREATE_SEQUENCE
  kinmu_indices: number[]
}

type CreateRenzokuKinshiKinmu = {
  type: typeof CREATE_RENZOKU_KINSHI_KINMU
  sequence_id: number
  sequence_number: number
  kinmu_index: number
}

type UpdateRenzokuKinshiKinmuKinmuIndex = {
  type: typeof UPDATE_RENZOKU_KINSHI_KINMU_KINMU_INDEX
  index: number
  kinmu_index: number
}

type DeleteRenzokuKinshiKinmu = {
  type: typeof DELETE_RENZOKU_KINSHI_KINMU
  index: number
}

type DeleteSequence = {
  type: typeof DELETE_SEQUENCE
  sequence_id: number
}

type Action =
  | CreateSequence
  | CreateRenzokuKinshiKinmu
  | UpdateRenzokuKinshiKinmuKinmuIndex
  | DeleteRenzokuKinshiKinmu
  | DeleteSequence

export function createSequence(kinmu_indices: number[]): CreateSequence {
  return {
    kinmu_indices,
    type: CREATE_SEQUENCE,
  }
}

export function createRenzokuKinshiKinmu(sequence_id: number, sequence_number: number, kinmu_index: number): CreateRenzokuKinshiKinmu {
  return {
    kinmu_index,
    sequence_id,
    sequence_number,
    type: CREATE_RENZOKU_KINSHI_KINMU,
  }
}

export function updateRenzokuKinshiKinmuKinmuIndex(index: number, kinmu_index: number): UpdateRenzokuKinshiKinmuKinmuIndex {
  return {
    index,
    kinmu_index,
    type: UPDATE_RENZOKU_KINSHI_KINMU_KINMU_INDEX,
  }
}

export function deleteRenzokuKinshiKinmu(index: number): DeleteRenzokuKinshiKinmu {
  return {
    index,
    type: DELETE_RENZOKU_KINSHI_KINMU,
  }
}

export function deleteSequence(sequence_id: number): DeleteSequence {
  return {
    sequence_id,
    type: DELETE_SEQUENCE,
  }
}

export type State = RenzokuKinshiKinmu[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_SEQUENCE: {
      const renzoku_kinshi_kinmu_index = Math.max(...state.map(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.index)) + 1
      const sequence_id = Math.max(...state.map(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.sequence_id)) + 1
      return state.concat(action.kinmu_indices.map((kinmu_index, index) => ({
        index: renzoku_kinshi_kinmu_index + index,
        kinmu_index,
        sequence_id,
        sequence_number: index,
      })))
    }
    case CREATE_RENZOKU_KINSHI_KINMU:
      return state.map(renzoku_kinshi_kinmu => {
        if (renzoku_kinshi_kinmu.sequence_id !== action.sequence_id) {
          return renzoku_kinshi_kinmu
        }
        const sequence_number = renzoku_kinshi_kinmu.sequence_number < action.sequence_number ?
          renzoku_kinshi_kinmu.sequence_number :
          renzoku_kinshi_kinmu.sequence_number + 1
        return ({ ...renzoku_kinshi_kinmu, sequence_number, })
      }).concat({
        index: Math.max(...state.map(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.index)) + 1,
        kinmu_index: action.kinmu_index,
        sequence_id: action.sequence_id,
        sequence_number: action.sequence_number,
      })
    case UPDATE_RENZOKU_KINSHI_KINMU_KINMU_INDEX:
      return state.map(renzoku_kinshi_kinmu => {
        if (renzoku_kinshi_kinmu.index !== action.index) {
          return renzoku_kinshi_kinmu
        }
        return { ...renzoku_kinshi_kinmu, kinmu_index: action.kinmu_index }
      })
    case DELETE_RENZOKU_KINSHI_KINMU: {
      const deleted_renzoku_kinshi_kinmu = state.find(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.index === action.index)!
      return state
        .filter(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.index !== action.index)
        .map(renzoku_kinshi_kinmu => {
          if (renzoku_kinshi_kinmu.sequence_id !== deleted_renzoku_kinshi_kinmu.sequence_id) {
            return renzoku_kinshi_kinmu
          }
          const sequence_number = renzoku_kinshi_kinmu.sequence_number < deleted_renzoku_kinshi_kinmu.sequence_number ?
            renzoku_kinshi_kinmu.sequence_number :
            renzoku_kinshi_kinmu.sequence_number - 1
          return { ...renzoku_kinshi_kinmu, sequence_number }
        })
    }
    case DELETE_SEQUENCE:
      return state.filter(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.sequence_id !== action.sequence_id)
  }
  return state
}
