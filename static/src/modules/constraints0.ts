const UPDATE_CONSTRAINT0_IS_ENABLED = 'UPDATE_CONSTRAINT0_IS_ENABLED'

export type Constraint0 = {
  id: number
  is_enabled: boolean
}

type UpdateConstraint0IsEnabled = {
  type: typeof UPDATE_CONSTRAINT0_IS_ENABLED
  id: number
  is_enabled: boolean
}

type Action =
  | UpdateConstraint0IsEnabled

export function updateConstraint0IsEnabled(id: number, is_enabled: boolean): UpdateConstraint0IsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_CONSTRAINT0_IS_ENABLED,
  }
}

export type State = Constraint0[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_CONSTRAINT0_IS_ENABLED:
      return state.map(c => {
        if (c.id !== action.id) {
          return c
        }
        return { ...c, is_enabled: action.is_enabled }
      })
  }
  return state
}
