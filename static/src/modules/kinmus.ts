const CREATE_KINMU = "CREATE_KINMU";
const UPDATE_KINMU_IS_ENABLED = "UPDATE_KINMU_IS_ENABLED";
const UPDATE_KINMU_NAME = "UPDATE_KINMU_NAME";

export type Kinmu = {
  id: number;
  is_enabled: boolean;
  name: string;
};

type CreateKinmu = {
  type: typeof CREATE_KINMU;
  is_enabled: boolean;
  name: string;
};

type UpdateKinmuIsEnabled = {
  type: typeof UPDATE_KINMU_IS_ENABLED;
  id: number;
  is_enabled: boolean;
};

type UpdateKinmuName = {
  type: typeof UPDATE_KINMU_NAME;
  id: number;
  name: string;
};

type Action = CreateKinmu | UpdateKinmuIsEnabled | UpdateKinmuName;

export function createKinmu(is_enabled: boolean, name: string): CreateKinmu {
  return {
    is_enabled,
    name,
    type: CREATE_KINMU,
  };
}

export function updateKinmuIsEnabled(
  id: number,
  is_enabled: boolean
): UpdateKinmuIsEnabled {
  return {
    id,
    is_enabled,
    type: UPDATE_KINMU_IS_ENABLED,
  };
}

export function updateKinmuName(id: number, name: string): UpdateKinmuName {
  return {
    id,
    name,
    type: UPDATE_KINMU_NAME,
  };
}

export type State = Kinmu[];

const initialState: State = [];

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_KINMU:
      return state.concat({
        id: Math.max(0, ...state.map((kinmu) => kinmu.id)) + 1,
        is_enabled: action.is_enabled,
        name: action.name,
      });
    case UPDATE_KINMU_IS_ENABLED:
      return state.map((kinmu) => {
        if (kinmu.id !== action.id) {
          return kinmu;
        }
        return { ...kinmu, is_enabled: action.is_enabled };
      });
    case UPDATE_KINMU_NAME:
      return state.map((kinmu) => {
        if (kinmu.id !== action.id) {
          return kinmu;
        }
        return { ...kinmu, name: action.name };
      });
  }
  return state;
}
