const UPDATE_C0_IS_ENABLED = 'UPDATE_C0_IS_ENABLED'

export type C0 = {
  id: number
  is_enabled: boolean
}

type UpdateC0IsEnabled = {
  type: typeof UPDATE_C0_IS_ENABLED
  id: number
  is_enabled: boolean
}

type Action =
  | UpdateC0IsEnabled

export function updateC0IsEnabled(id: number, is_enabled: boolean): UpdateC0IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_C0_IS_ENABLED,
  }
}

export type State = C0[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_C0_IS_ENABLED:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, is_enabled: action.is_enabled }
      })
  }
  return state
}
