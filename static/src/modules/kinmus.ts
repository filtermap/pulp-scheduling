const CREATE_KINMU = 'CREATE_KINMU'
const UPDATE_KINMU_NAME = 'UPDATE_KINMU_NAME'

export type Kinmu = {
  index: number
  name: string
}

type CreateKinmu = {
  type: typeof CREATE_KINMU
  name: string
}

type UpdateKinmuName = {
  type: typeof UPDATE_KINMU_NAME
  index: number
  name: string
}

type Action =
  | CreateKinmu
  | UpdateKinmuName

export function createKinmu(name: string): CreateKinmu {
  return {
    name,
    type: CREATE_KINMU,
  }
}

export function updateKinmuName(index: number, name: string): UpdateKinmuName {
  return {
    index,
    name,
    type: UPDATE_KINMU_NAME,
  }
}

export type State = Kinmu[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_KINMU:
      return state.concat({ index: Math.max(...state.map(kinmu => kinmu.index)) + 1, name: action.name })
    case UPDATE_KINMU_NAME:
      return state.map(kinmu => {
        if (kinmu.index !== action.index) {
          return kinmu
        }
        return { ...kinmu, name: action.name }
      })
  }
  return state
}
