import { combineReducers, Reducer } from "redux";
import * as assignments from "./assignments";
import * as constraint0_kinmus from "./constraint0_kinmus";
import * as constraints0 from "./constraints0";
import * as constraints1 from "./constraints1";
import * as constraints10 from "./constraints10";
import * as constraints2 from "./constraints2";
import * as constraints3 from "./constraints3";
import * as constraints4 from "./constraints4";
import * as constraints5 from "./constraints5";
import * as constraints6 from "./constraints6";
import * as constraints7 from "./constraints7";
import * as constraints8 from "./constraints8";
import * as constraints9 from "./constraints9";
import * as group_members from "./group_members";
import * as groups from "./groups";
import * as kinmus from "./kinmus";
import * as members from "./members";
import * as schedules from "./schedules";
import * as terms from "./terms";

const REPLACE_ALL = "REPLACE_ALL";
const CREATE_MEMBER = "CREATE_MEMBER";
const CREATE_GROUP = "CREATE_GROUP";
const CREATE_CONSTRAINT0 = "CREATE_CONSTRAINT0";
const CREATE_SCHEDULE = "CREATE_SCHEDULE";
const DELETE_MEMBER = "DELETE_MEMBER";
const DELETE_GROUP = "DELETE_GROUP";
const DELETE_KINMU = "DELETE_KINMU";
const DELETE_CONSTRAINT0 = "DELETE_CONSTRAINT0";
const DELETE_CONSTRAINT0_KINMU = "DELETE_CONSTRAINT0_KINMU";
const DELETE_SCHEDULE = "DELETE_SCHEDULE";

export type All = {
  members: members.Member[];
  terms: terms.Term[];
  kinmus: kinmus.Kinmu[];
  groups: groups.Group[];
  group_members: group_members.GroupMember[];
  constraints0: constraints0.Constraint0[];
  constraint0_kinmus: constraint0_kinmus.Constraint0Kinmu[];
  constraints1: constraints1.Constraint1[];
  constraints2: constraints2.Constraint2[];
  constraints3: constraints3.Constraint3[];
  constraints4: constraints4.Constraint4[];
  constraints5: constraints5.Constraint5[];
  constraints6: constraints6.Constraint6[];
  constraints7: constraints7.Constraint7[];
  constraints8: constraints8.Constraint8[];
  constraints9: constraints9.Constraint9[];
  constraints10: constraints10.Constraint10[];
  schedules: schedules.Schedule[];
  assignments: assignments.Assignment[];
};

type ReplaceAll = {
  type: typeof REPLACE_ALL;
  all: All;
};

type CreateMember = {
  type: typeof CREATE_MEMBER;
  is_enabled: boolean;
  name: string;
  group_ids: number[];
};

type CreateGroup = {
  type: typeof CREATE_GROUP;
  is_enabled: boolean;
  name: string;
  member_ids: number[];
};

type CreateConstraint0 = {
  type: typeof CREATE_CONSTRAINT0;
  is_enabled: boolean;
  kinmu_ids: number[];
};

type CreateSchedule = {
  type: typeof CREATE_SCHEDULE;
  new_assignments: assignments.Assignment[];
};

type DeleteMember = {
  type: typeof DELETE_MEMBER;
  id: number;
};

type DeleteGroup = {
  type: typeof DELETE_GROUP;
  id: number;
};

type DeleteKinmu = {
  type: typeof DELETE_KINMU;
  id: number;
};

type DeleteConstraint0 = {
  type: typeof DELETE_CONSTRAINT0;
  id: number;
};

type DeleteConstraint0Kinmu = {
  type: typeof DELETE_CONSTRAINT0_KINMU;
  id: number;
};

type DeleteSchedule = {
  type: typeof DELETE_SCHEDULE;
  id: number;
};

type Action =
  | ReplaceAll
  | CreateMember
  | CreateGroup
  | CreateConstraint0
  | CreateSchedule
  | DeleteMember
  | DeleteGroup
  | DeleteKinmu
  | DeleteConstraint0
  | DeleteConstraint0Kinmu
  | DeleteSchedule;

export function replaceAll(all: All): ReplaceAll {
  return {
    all,
    type: REPLACE_ALL,
  };
}

export function createMember(
  is_enabled: boolean,
  name: string,
  group_ids: number[]
): CreateMember {
  return {
    group_ids,
    is_enabled,
    name,
    type: CREATE_MEMBER,
  };
}

export function createGroup(
  is_enabled: boolean,
  name: string,
  member_ids: number[]
): CreateGroup {
  return {
    is_enabled,
    member_ids,
    name,
    type: CREATE_GROUP,
  };
}

export function createConstraint0(
  is_enabled: boolean,
  kinmu_ids: number[]
): CreateConstraint0 {
  return {
    is_enabled,
    kinmu_ids,
    type: CREATE_CONSTRAINT0,
  };
}

export function createSchedule(
  new_assignments: assignments.Assignment[]
): CreateSchedule {
  return {
    new_assignments,
    type: CREATE_SCHEDULE,
  };
}

export function deleteMember(id: number): DeleteMember {
  return {
    id,
    type: DELETE_MEMBER,
  };
}

export function deleteGroup(id: number): DeleteGroup {
  return {
    id,
    type: DELETE_GROUP,
  };
}

export function deleteKinmu(id: number): DeleteKinmu {
  return {
    id,
    type: DELETE_KINMU,
  };
}

export function deleteConstraint0(id: number): DeleteConstraint0 {
  return {
    id,
    type: DELETE_CONSTRAINT0,
  };
}

export function deleteConstraint0Kinmu(id: number): DeleteConstraint0Kinmu {
  return {
    id,
    type: DELETE_CONSTRAINT0_KINMU,
  };
}

export function deleteSchedule(id: number): DeleteSchedule {
  return {
    id,
    type: DELETE_SCHEDULE,
  };
}

export type State = All;

const combinedReducer = combineReducers({
  assignments: assignments.reducer,
  constraint0_kinmus: constraint0_kinmus.reducer,
  constraints0: constraints0.reducer,
  constraints1: constraints1.reducer,
  constraints10: constraints10.reducer,
  constraints2: constraints2.reducer,
  constraints3: constraints3.reducer,
  constraints4: constraints4.reducer,
  constraints5: constraints5.reducer,
  constraints6: constraints6.reducer,
  constraints7: constraints7.reducer,
  constraints8: constraints8.reducer,
  constraints9: constraints9.reducer,
  group_members: group_members.reducer,
  groups: groups.reducer,
  kinmus: kinmus.reducer,
  members: members.reducer,
  schedules: schedules.reducer,
  terms: terms.reducer,
});

function crossSliceReducer(state: State, action: Action): State {
  switch (action.type) {
    case REPLACE_ALL:
      return action.all;
    case CREATE_MEMBER: {
      const member_id = Math.max(0, ...state.members.map(({ id }) => id)) + 1;
      const group_member_id =
        Math.max(0, ...state.group_members.map(({ id }) => id)) + 1;
      return {
        ...state,
        group_members: state.group_members.concat(
          action.group_ids.map((group_id, index) => ({
            group_id,
            id: group_member_id + index,
            member_id,
          }))
        ),
        members: state.members.concat({
          id: member_id,
          is_enabled: action.is_enabled,
          name: action.name,
        }),
      };
    }
    case CREATE_GROUP: {
      const group_id = Math.max(0, ...state.groups.map(({ id }) => id)) + 1;
      const group_member_id =
        Math.max(0, ...state.group_members.map(({ id }) => id)) + 1;
      return {
        ...state,
        group_members: state.group_members.concat(
          action.member_ids.map((member_id, index) => ({
            group_id,
            id: group_member_id + index,
            member_id,
          }))
        ),
        groups: state.groups.concat({
          id: group_id,
          is_enabled: action.is_enabled,
          name: action.name,
        }),
      };
    }
    case CREATE_CONSTRAINT0: {
      const constraint0_id =
        Math.max(0, ...state.constraints0.map(({ id }) => id)) + 1;
      const constraint0_kinmu_id =
        Math.max(0, ...state.constraint0_kinmus.map(({ id }) => id)) + 1;
      return {
        ...state,
        constraint0_kinmus: state.constraint0_kinmus.concat(
          action.kinmu_ids.map((kinmu_id, index) => ({
            constraint0_id,
            id: constraint0_kinmu_id + index,
            kinmu_id,
            sequence_number: index,
          }))
        ),
        constraints0: state.constraints0.concat({
          id: constraint0_id,
          is_enabled: action.is_enabled,
        }),
      };
    }
    case CREATE_SCHEDULE: {
      const schedule_id =
        Math.max(0, ...state.schedules.map(({ id }) => id)) + 1;
      const assignment_id =
        Math.max(0, ...state.assignments.map(({ id }) => id)) + 1;
      return {
        ...state,
        assignments: state.assignments.concat(
          action.new_assignments.map((new_assignment, index) => ({
            ...new_assignment,
            id: assignment_id + index,
            schedule_id,
          }))
        ),
        schedules: state.schedules.concat({ id: schedule_id }),
      };
    }
    case DELETE_MEMBER: {
      const filtered_assignments = state.assignments.filter(
        ({ member_id }) => member_id !== action.id
      );
      const filtered_assignment_schedule_ids = Array.from(
        new Set(filtered_assignments.map(({ schedule_id }) => schedule_id))
      );
      return {
        ...state,
        assignments: filtered_assignments,
        constraints10: state.constraints10.filter(
          (c) => c.member_id !== action.id
        ),
        constraints3: state.constraints3.filter(
          (c) => c.member_id !== action.id
        ),
        constraints4: state.constraints4.filter(
          (c) => c.member_id !== action.id
        ),
        constraints9: state.constraints9.filter(
          (c) => c.member_id !== action.id
        ),
        group_members: state.group_members.filter(
          ({ member_id }) => member_id !== action.id
        ),
        members: state.members.filter(({ id }) => id !== action.id),
        schedules: state.schedules.filter(({ id }) =>
          filtered_assignment_schedule_ids.includes(id)
        ),
      };
    }
    case DELETE_GROUP:
      return {
        ...state,
        constraints1: state.constraints1.filter(
          (c) => c.group_id !== action.id
        ),
        constraints2: state.constraints2.filter(
          (c) => c.group_id !== action.id
        ),
        group_members: state.group_members.filter(
          ({ group_id }) => group_id !== action.id
        ),
        groups: state.groups.filter(({ id }) => id !== action.id),
      };
    case DELETE_KINMU: {
      const deleted_constraint0_ids = Array.from(
        new Set(
          state.constraint0_kinmus
            .filter(({ kinmu_id }) => kinmu_id === action.id)
            .map(({ constraint0_id }) => constraint0_id)
        )
      );
      const deleted_schedule_ids = Array.from(
        new Set(
          state.assignments
            .filter(({ kinmu_id }) => kinmu_id === action.id)
            .map(({ schedule_id }) => schedule_id)
        )
      );
      return {
        ...state,
        assignments: state.assignments.filter(
          (assignment) => !deleted_schedule_ids.includes(assignment.schedule_id)
        ),
        constraint0_kinmus: state.constraint0_kinmus.filter(
          ({ kinmu_id }) => kinmu_id !== action.id
        ),
        constraints0: state.constraints0.filter(
          (c) => !deleted_constraint0_ids.includes(c.id)
        ),
        constraints1: state.constraints1.filter(
          (c) => c.kinmu_id !== action.id
        ),
        constraints10: state.constraints10.filter(
          (c) => c.kinmu_id !== action.id
        ),
        constraints2: state.constraints2.filter(
          (c) => c.kinmu_id !== action.id
        ),
        constraints3: state.constraints3.filter(
          (c) => c.kinmu_id !== action.id
        ),
        constraints4: state.constraints4.filter(
          (c) => c.kinmu_id !== action.id
        ),
        constraints5: state.constraints5.filter(
          (c) => c.kinmu_id !== action.id
        ),
        constraints6: state.constraints6.filter(
          (c) => c.kinmu_id !== action.id
        ),
        constraints7: state.constraints7.filter(
          (c) => c.kinmu_id !== action.id
        ),
        constraints8: state.constraints8.filter(
          (c) => c.kinmu_id !== action.id
        ),
        constraints9: state.constraints9.filter(
          (c) => c.kinmu_id !== action.id
        ),
        kinmus: state.kinmus.filter(({ id }) => id !== action.id),
        schedules: state.schedules.filter(
          ({ id }) => !deleted_schedule_ids.includes(id)
        ),
      };
    }
    case DELETE_CONSTRAINT0:
      return {
        ...state,
        constraint0_kinmus: state.constraint0_kinmus.filter(
          ({ constraint0_id }) => constraint0_id !== action.id
        ),
        constraints0: state.constraints0.filter((c) => c.id !== action.id),
      };
    case DELETE_CONSTRAINT0_KINMU: {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const deleted_constraint0_kinmu = state.constraint0_kinmus.find(
        ({ id }) => id === action.id
      )!;
      const filtered_constraint0_kinmus = state.constraint0_kinmus.filter(
        ({ id }) => id !== action.id
      );
      const filtered_constraint0_kinmu_constraint0_ids = Array.from(
        new Set(
          filtered_constraint0_kinmus.map(
            ({ constraint0_id }) => constraint0_id
          )
        )
      );
      return {
        ...state,
        constraint0_kinmus: filtered_constraint0_kinmus.map((c_kinmu) => {
          if (
            c_kinmu.constraint0_id !== deleted_constraint0_kinmu.constraint0_id
          ) {
            return c_kinmu;
          }
          const sequence_number =
            c_kinmu.sequence_number < deleted_constraint0_kinmu.sequence_number
              ? c_kinmu.sequence_number
              : c_kinmu.sequence_number - 1;
          return { ...c_kinmu, sequence_number };
        }),
        constraints0: state.constraints0.filter(({ id }) =>
          filtered_constraint0_kinmu_constraint0_ids.includes(id)
        ),
      };
    }
    case DELETE_SCHEDULE:
      return {
        ...state,
        assignments: state.assignments.filter(
          ({ schedule_id }) => schedule_id !== action.id
        ),
        schedules: state.schedules.filter(({ id }) => id !== action.id),
      };
  }
  return state;
}

export const reducer: Reducer<State, Action> = (state, action) =>
  crossSliceReducer(combinedReducer(state, action), action);
