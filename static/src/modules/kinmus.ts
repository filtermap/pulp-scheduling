const CREATE_KINMU = 'CREATE_KINMU'
const UPDATE_KINMU_NAME = 'UPDATE_KINMU_NAME'

export type Kinmu = {
  id: number
  name: string
}

type CreateKinmu = {
  type: typeof CREATE_KINMU
  name: string
}

type UpdateKinmuName = {
  type: typeof UPDATE_KINMU_NAME
  id: number
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

export function updateKinmuName(id: number, name: string): UpdateKinmuName {
  return {
    id,
    name,
    type: UPDATE_KINMU_NAME,
  }
}

export type State = Kinmu[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_KINMU:
      return state.concat({ id: Math.max(0, ...state.map(kinmu => kinmu.id)) + 1, name: action.name })
    case UPDATE_KINMU_NAME:
      return state.map(kinmu => {
        if (kinmu.id !== action.id) {
          return kinmu
        }
        return { ...kinmu, name: action.name }
      })
  }
  return state
}
