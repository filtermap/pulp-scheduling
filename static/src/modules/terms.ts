const UPDATE_TERM_START_DATE_NAME = 'UPDATE_TERM_START_DATE_NAME'
const UPDATE_TERM_STOP_DATE_NAME = 'UPDATE_TERM_STOP_DATE_NAME'

export type Term = {
  index: number
  start_date_name: string
  stop_date_name: string
}

type UpdateTermStartDateName = {
  type: typeof UPDATE_TERM_START_DATE_NAME
  index: number
  start_date_name: string
}

type UpdateTermStopDateName = {
  type: typeof UPDATE_TERM_STOP_DATE_NAME
  index: number
  stop_date_name: string
}

type Action = UpdateTermStartDateName | UpdateTermStopDateName

export function updateTermStartDateName(index: number, start_date_name: string): UpdateTermStartDateName {
  return {
    index,
    start_date_name,
    type: UPDATE_TERM_START_DATE_NAME,
  }
}

export function updateTermStopDateName(index: number, stop_date_name: string): UpdateTermStopDateName {
  return {
    index,
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
        if (term.index !== action.index) {
          return term
        }
        return { ...term, start_date_name: action.start_date_name }
      })
    case UPDATE_TERM_STOP_DATE_NAME:
      return state.map(term => {
        if (term.index !== action.index) {
          return term
        }
        return { ...term, stop_date_name: action.stop_date_name }
      })
  }
  return state
}
