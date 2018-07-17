const DELETE_SEQUENCE = 'DELETE_SEQUENCE'

export type RenzokuKinshiKinmu = {
  index: number
  sequence_id: number
  sequence_number: number
  kinmu_index: number
}

type DeleteSequence = {
  type: typeof DELETE_SEQUENCE
  sequence_id: number
}

type Action =
  | DeleteSequence

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
    case DELETE_SEQUENCE:
      return state.filter(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.sequence_id !== action.sequence_id)
  }
  return state
}
