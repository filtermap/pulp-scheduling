export type Roster = {
  id: number;
};

export type State = Roster[];

const initialState: State = [];

export function reducer(state: State = initialState): State {
  return state;
}
