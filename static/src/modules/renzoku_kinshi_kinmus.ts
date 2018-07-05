export type RenzokuKinshiKinmu = {
  index: number
  sequence_id: number
  sequence_number: number
  kinmu_name: string
}

export type State = RenzokuKinshiKinmu[]

const initialState: State = []

export function reducer(state: State = initialState): State {
  return state
}
