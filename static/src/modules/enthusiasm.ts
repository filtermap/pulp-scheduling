const INCREMENT_ENTHUSIASM = 'INCREMENT_ENTHUSIASM';
const DECREMENT_ENTHUSIASM = 'DECREMENT_ENTHUSIASM';

interface IIncrement {
  type: typeof INCREMENT_ENTHUSIASM;
}

interface IDecrement {
  type: typeof DECREMENT_ENTHUSIASM;
}

export type Action = IIncrement | IDecrement;

export function increment(): IIncrement {
  return {
    type: INCREMENT_ENTHUSIASM
  }
}

export function decrement(): IDecrement {
  return {
    type: DECREMENT_ENTHUSIASM
  }
}

export interface IState {
  languageName: string;
  enthusiasmLevel: number;
}

const initialState: IState = {
  enthusiasmLevel: 1,
  languageName: 'TypeScript'
}

export function reducer(state: IState = initialState, action: Action): IState {
  switch (action.type) {
    case INCREMENT_ENTHUSIASM:
      return { ...state, enthusiasmLevel: state.enthusiasmLevel + 1 };
    case DECREMENT_ENTHUSIASM:
      return { ...state, enthusiasmLevel: Math.max(1, state.enthusiasmLevel - 1) };
  }
  return state;
}
