export type Schedule = {
  id: number;
  term_id: number;
};

export type State = Schedule[];

const initialState: State = [];

export function reducer(state: State = initialState): State {
  return state;
}
