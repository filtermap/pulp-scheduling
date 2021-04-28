const CREATE_CONSTRAINT0_KINMU = "CREATE_CONSTRAINT0_KINMU";
const UPDATE_CONSTRAINT0_KINMU_KINMU_ID = "UPDATE_CONSTRAINT0_KINMU_KINMU_ID";

export type Constraint0Kinmu = {
  id: number;
  constraint0_id: number;
  sequence_number: number;
  kinmu_id: number;
};

type CreateConstraint0Kinmu = {
  type: typeof CREATE_CONSTRAINT0_KINMU;
  constraint0_id: number;
  sequence_number: number;
  kinmu_id: number;
};

type UpdateConstraint0KinmuKinmuId = {
  type: typeof UPDATE_CONSTRAINT0_KINMU_KINMU_ID;
  id: number;
  kinmu_id: number;
};

type Action = CreateConstraint0Kinmu | UpdateConstraint0KinmuKinmuId;

export function createConstraint0Kinmu(
  constraint0_id: number,
  sequence_number: number,
  kinmu_id: number
): CreateConstraint0Kinmu {
  return {
    constraint0_id,
    kinmu_id,
    sequence_number,
    type: CREATE_CONSTRAINT0_KINMU,
  };
}

export function updateConstraint0KinmuKinmuId(
  id: number,
  kinmu_id: number
): UpdateConstraint0KinmuKinmuId {
  return {
    id,
    kinmu_id,
    type: UPDATE_CONSTRAINT0_KINMU_KINMU_ID,
  };
}

export type State = Constraint0Kinmu[];

const initialState: State = [];

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case CREATE_CONSTRAINT0_KINMU:
      return state
        .map((c_kinmu) => {
          if (c_kinmu.constraint0_id !== action.constraint0_id) {
            return c_kinmu;
          }
          const sequence_number =
            c_kinmu.sequence_number < action.sequence_number
              ? c_kinmu.sequence_number
              : c_kinmu.sequence_number + 1;
          return { ...c_kinmu, sequence_number };
        })
        .concat({
          constraint0_id: action.constraint0_id,
          id: Math.max(0, ...state.map(({ id }) => id)) + 1,
          kinmu_id: action.kinmu_id,
          sequence_number: action.sequence_number,
        });
    case UPDATE_CONSTRAINT0_KINMU_KINMU_ID:
      return state.map((c_kinmu) => {
        if (c_kinmu.id !== action.id) {
          return c_kinmu;
        }
        return { ...c_kinmu, kinmu_id: action.kinmu_id };
      });
  }
  return state;
}
