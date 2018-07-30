const UPDATE_TERM_START_DATE_NAME = 'UPDATE_TERM_START_DATE_NAME'
const UPDATE_TERM_STOP_DATE_NAME = 'UPDATE_TERM_STOP_DATE_NAME'

export type Term = {
  id: number
  start_date_name: string
  stop_date_name: string
}

type UpdateTermStartDateName = {
  type: typeof UPDATE_TERM_START_DATE_NAME
  id: number
  start_date_name: string
}

type UpdateTermStopDateName = {
  type: typeof UPDATE_TERM_STOP_DATE_NAME
  id: number
  stop_date_name: string
}

type Action = UpdateTermStartDateName | UpdateTermStopDateName

export function updateTermStartDateName(id: number, start_date_name: string): UpdateTermStartDateName {
  return {
    id,
    start_date_name,
    type: UPDATE_TERM_START_DATE_NAME,
  }
}

export function updateTermStopDateName(id: number, stop_date_name: string): UpdateTermStopDateName {
  return {
    id,
    stop_date_name,
    type: UPDATE_TERM_STOP_DATE_NAME,
  }
}

export type State = Term[]

const initialState: State = []

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case UPDATE_TERM_START_DATE_NAME:
      return state.map(term => {
        if (term.id !== action.id) {
          return term
        }
        return { ...term, start_date_name: action.start_date_name }
      })
    case UPDATE_TERM_STOP_DATE_NAME:
      return state.map(term => {
        if (term.id !== action.id) {
          return term
        }
        return { ...term, stop_date_name: action.stop_date_name }
      })
  }
  return state
}
