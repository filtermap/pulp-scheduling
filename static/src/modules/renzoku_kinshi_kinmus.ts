const UPDATE_RENZOKU_KINSHI_KINMU_KINMU_INDEX = 'UPDATE_RENZOKU_KINSHI_KINMU_KINMU_INDEX'
const DELETE_RENZOKU_KINSHI_KINMU = 'DELETE_RENZOKU_KINSHI_KINMU'
const DELETE_SEQUENCE = 'DELETE_SEQUENCE'

export type RenzokuKinshiKinmu = {
  index: number
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
  | UpdateRenzokuKinshiKinmuKinmuIndex
  | DeleteRenzokuKinshiKinmu
  | DeleteSequence

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
    case UPDATE_RENZOKU_KINSHI_KINMU_KINMU_INDEX:
      return state.map(renzoku_kinshi_kinmu => {
        if (renzoku_kinshi_kinmu.index !== action.index) {
          return renzoku_kinshi_kinmu
        }
        return { ...renzoku_kinshi_kinmu, kinmu_index: action.kinmu_index }
      })
    case DELETE_RENZOKU_KINSHI_KINMU:
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
    case DELETE_SEQUENCE:
      return state.filter(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.sequence_id !== action.sequence_id)
  }
  return state
}
