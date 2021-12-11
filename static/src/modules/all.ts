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
const IMPORT_DATA = "IMPORT_DATA";
const CREATE_MEMBER = "CREATE_MEMBER";
const CREATE_GROUP = "CREATE_GROUP";
const CREATE_CONSTRAINT0 = "CREATE_CONSTRAINT0";
const CREATE_SCHEDULE = "CREATE_SCHEDULE";
const DELETE_TERM = "DELETE_TERM";
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

type ImportData = {
  type: typeof IMPORT_DATA;
  from_term_id: number;
  into_term_id: number;
};

type CreateMember = {
  type: typeof CREATE_MEMBER;
  term_id: number;
  is_enabled: boolean;
  name: string;
  group_ids: number[];
};

type CreateGroup = {
  type: typeof CREATE_GROUP;
  term_id: number;
  is_enabled: boolean;
  name: string;
  member_ids: number[];
};

type CreateConstraint0 = {
  type: typeof CREATE_CONSTRAINT0;
  term_id: number;
  is_enabled: boolean;
  kinmu_ids: number[];
};

type CreateSchedule = {
  type: typeof CREATE_SCHEDULE;
  term_id: number;
  new_assignments: assignments.Assignment[];
};

type DeleteTerm = {
  type: typeof DELETE_TERM;
  id: number;
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
  | ImportData
  | CreateMember
  | CreateGroup
  | CreateConstraint0
  | CreateSchedule
  | DeleteTerm
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

export function importData(
  from_term_id: number,
  into_term_id: number
): ImportData {
  return {
    from_term_id,
    into_term_id,
    type: IMPORT_DATA,
  };
}

export function createMember(
  term_id: number,
  is_enabled: boolean,
  name: string,
  group_ids: number[]
): CreateMember {
  return {
    group_ids,
    term_id,
    is_enabled,
    name,
    type: CREATE_MEMBER,
  };
}

export function createGroup(
  term_id: number,
  is_enabled: boolean,
  name: string,
  member_ids: number[]
): CreateGroup {
  return {
    term_id,
    is_enabled,
    member_ids,
    name,
    type: CREATE_GROUP,
  };
}

export function createConstraint0(
  term_id: number,
  is_enabled: boolean,
  kinmu_ids: number[]
): CreateConstraint0 {
  return {
    term_id,
    is_enabled,
    kinmu_ids,
    type: CREATE_CONSTRAINT0,
  };
}

export function createSchedule(
  term_id: number,
  new_assignments: assignments.Assignment[]
): CreateSchedule {
  return {
    term_id,
    new_assignments,
    type: CREATE_SCHEDULE,
  };
}

export function deleteTerm(id: number): DeleteTerm {
  return {
    id,
    type: DELETE_TERM,
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

// TODO: think more semantic function name
function doubleItems<
  T extends {
    id: number;
  }
>(
  array: T[],
  keyOfItem: keyof T,
  fromValue: T[keyof T],
  toValue: T[keyof T]
): { copied: T[]; idMap: Map<number, number>; lastId: number } {
  return array.reduce<{
    copied: T[];
    idMap: Map<number, number>;
    lastId: number;
  }>(
    (acc, value) => {
      acc.copied.push(value);
      if (value[keyOfItem] === fromValue) {
        acc.lastId++;
        acc.copied.push({
          ...value,
          id: acc.lastId,
          [keyOfItem]: toValue,
        });
        acc.idMap.set(value.id, acc.lastId);
      }
      return acc;
    },
    {
      lastId: Math.max(0, ...array.map(({ id }) => id)),
      copied: [],
      idMap: new Map(),
    }
  );
}

function crossSliceReducer(state: State, action: Action): State {
  switch (action.type) {
    case REPLACE_ALL:
      return action.all;
    case IMPORT_DATA: {
      const { copied: copiedMembers, idMap: memberIdMap } =
        doubleItems<members.Member>(
          state.members,
          "term_id",
          action.from_term_id,
          action.into_term_id
        );
      const { copied: copiedKinmus, idMap: kinmuIdMap } =
        doubleItems<kinmus.Kinmu>(
          state.kinmus,
          "term_id",
          action.from_term_id,
          action.into_term_id
        );
      const { copied: copiedGroups, idMap: groupIdMap } =
        doubleItems<groups.Group>(
          state.groups,
          "term_id",
          action.from_term_id,
          action.into_term_id
        );
      const { copied: copiedGroupMembers } = state.group_members.reduce<{
        lastId: number;
        copied: group_members.GroupMember[];
      }>(
        (acc, gm) => {
          acc.copied.push(gm);
          const group_id = groupIdMap.get(gm.group_id);
          const member_id = memberIdMap.get(gm.member_id);
          if (group_id && member_id) {
            acc.lastId++;
            acc.copied.push({
              ...gm,
              id: acc.lastId,
              group_id,
              member_id,
            });
          }
          return acc;
        },
        {
          lastId: Math.max(0, ...state.group_members.map(({ id }) => id)),
          copied: [],
        }
      );
      const { copied: copiedConstraints0, idMap: constraint0IdMap } =
        doubleItems<constraints0.Constraint0>(
          state.constraints0,
          "term_id",
          action.from_term_id,
          action.into_term_id
        );
      const { copied: copiedConstraint0Kinmus } =
        state.constraint0_kinmus.reduce<{
          lastId: number;
          copied: constraint0_kinmus.Constraint0Kinmu[];
        }>(
          (acc, ck) => {
            acc.copied.push(ck);
            const constraint0_id = constraint0IdMap.get(ck.constraint0_id);
            const kinmu_id = kinmuIdMap.get(ck.kinmu_id);
            if (constraint0_id && kinmu_id) {
              acc.lastId++;
              acc.copied.push({
                ...ck,
                id: acc.lastId,
                constraint0_id,
                kinmu_id,
              });
            }
            return acc;
          },
          {
            lastId: Math.max(
              0,
              ...state.constraint0_kinmus.map(({ id }) => id)
            ),
            copied: [],
          }
        );
      const { copied: copiedConstraints1 } = state.constraints1.reduce<{
        lastId: number;
        copied: constraints1.Constraint1[];
      }>(
        (acc, c) => {
          acc.copied.push(c);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          const group_id = groupIdMap.get(c.group_id);
          if (kinmu_id && group_id) {
            acc.lastId++;
            acc.copied.push({
              ...c,
              id: acc.lastId,
              term_id: action.into_term_id,
              kinmu_id,
              group_id,
            });
          }
          return acc;
        },
        {
          lastId: Math.max(0, ...state.constraints1.map(({ id }) => id)),
          copied: [],
        }
      );
      const { copied: copiedConstraints2 } = state.constraints2.reduce<{
        lastId: number;
        copied: constraints2.Constraint2[];
      }>(
        (acc, c) => {
          acc.copied.push(c);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          const group_id = groupIdMap.get(c.group_id);
          if (kinmu_id && group_id) {
            acc.lastId++;
            acc.copied.push({
              ...c,
              id: acc.lastId,
              term_id: action.into_term_id,
              kinmu_id,
              group_id,
            });
          }
          return acc;
        },
        {
          lastId: Math.max(0, ...state.constraints2.map(({ id }) => id)),
          copied: [],
        }
      );
      const { copied: copiedConstraints3 } = state.constraints3.reduce<{
        lastId: number;
        copied: constraints3.Constraint3[];
      }>(
        (acc, c) => {
          acc.copied.push(c);
          const member_id = memberIdMap.get(c.member_id);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (member_id && kinmu_id) {
            acc.lastId++;
            acc.copied.push({
              ...c,
              id: acc.lastId,
              term_id: action.into_term_id,
              member_id,
              kinmu_id,
            });
          }
          return acc;
        },
        {
          lastId: Math.max(0, ...state.constraints3.map(({ id }) => id)),
          copied: [],
        }
      );
      const { copied: copiedConstraints4 } = state.constraints4.reduce<{
        lastId: number;
        copied: constraints4.Constraint4[];
      }>(
        (acc, c) => {
          acc.copied.push(c);
          const member_id = memberIdMap.get(c.member_id);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (member_id && kinmu_id) {
            acc.lastId++;
            acc.copied.push({
              ...c,
              id: acc.lastId,
              term_id: action.into_term_id,
              member_id,
              kinmu_id,
            });
          }
          return acc;
        },
        {
          lastId: Math.max(0, ...state.constraints4.map(({ id }) => id)),
          copied: [],
        }
      );
      const { copied: copiedConstraints5 } = state.constraints5.reduce<{
        lastId: number;
        copied: constraints5.Constraint5[];
      }>(
        (acc, c) => {
          acc.copied.push(c);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (kinmu_id) {
            acc.lastId++;
            acc.copied.push({
              ...c,
              id: acc.lastId,
              term_id: action.into_term_id,
              kinmu_id,
            });
          }
          return acc;
        },
        {
          lastId: Math.max(0, ...state.constraints5.map(({ id }) => id)),
          copied: [],
        }
      );
      const { copied: copiedConstraints6 } = state.constraints6.reduce<{
        lastId: number;
        copied: constraints6.Constraint6[];
      }>(
        (acc, c) => {
          acc.copied.push(c);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (kinmu_id) {
            acc.lastId++;
            acc.copied.push({
              ...c,
              id: acc.lastId,
              term_id: action.into_term_id,
              kinmu_id,
            });
          }
          return acc;
        },
        {
          lastId: Math.max(0, ...state.constraints6.map(({ id }) => id)),
          copied: [],
        }
      );
      const { copied: copiedConstraints7 } = state.constraints7.reduce<{
        lastId: number;
        copied: constraints7.Constraint7[];
      }>(
        (acc, c) => {
          acc.copied.push(c);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (kinmu_id) {
            acc.lastId++;
            acc.copied.push({
              ...c,
              id: acc.lastId,
              term_id: action.into_term_id,
              kinmu_id,
            });
          }
          return acc;
        },
        {
          lastId: Math.max(0, ...state.constraints7.map(({ id }) => id)),
          copied: [],
        }
      );
      const { copied: copiedConstraints8 } = state.constraints8.reduce<{
        lastId: number;
        copied: constraints8.Constraint8[];
      }>(
        (acc, c) => {
          acc.copied.push(c);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (kinmu_id) {
            acc.lastId++;
            acc.copied.push({
              ...c,
              id: acc.lastId,
              term_id: action.into_term_id,
              kinmu_id,
            });
          }
          return acc;
        },
        {
          lastId: Math.max(0, ...state.constraints8.map(({ id }) => id)),
          copied: [],
        }
      );
      const { copied: copiedConstraints9 } = state.constraints9.reduce<{
        lastId: number;
        copied: constraints9.Constraint9[];
      }>(
        (acc, c) => {
          acc.copied.push(c);
          const member_id = memberIdMap.get(c.member_id);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (member_id && kinmu_id) {
            acc.lastId++;
            acc.copied.push({
              ...c,
              id: acc.lastId,
              term_id: action.into_term_id,
              member_id,
              kinmu_id,
            });
          }
          return acc;
        },
        {
          lastId: Math.max(0, ...state.constraints9.map(({ id }) => id)),
          copied: [],
        }
      );
      const { copied: copiedConstraints10 } = state.constraints10.reduce<{
        lastId: number;
        copied: constraints10.Constraint10[];
      }>(
        (acc, c) => {
          acc.copied.push(c);
          const member_id = memberIdMap.get(c.member_id);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (member_id && kinmu_id) {
            acc.lastId++;
            acc.copied.push({
              ...c,
              id: acc.lastId,
              term_id: action.into_term_id,
              member_id,
              kinmu_id,
            });
          }
          return acc;
        },
        {
          lastId: Math.max(0, ...state.constraints10.map(({ id }) => id)),
          copied: [],
        }
      );
      return {
        ...state,
        members: copiedMembers,
        kinmus: copiedKinmus,
        groups: copiedGroups,
        group_members: copiedGroupMembers,
        constraints0: copiedConstraints0,
        constraint0_kinmus: copiedConstraint0Kinmus,
        constraints1: copiedConstraints1,
        constraints2: copiedConstraints2,
        constraints3: copiedConstraints3,
        constraints4: copiedConstraints4,
        constraints5: copiedConstraints5,
        constraints6: copiedConstraints6,
        constraints7: copiedConstraints7,
        constraints8: copiedConstraints8,
        constraints9: copiedConstraints9,
        constraints10: copiedConstraints10,
      };
    }
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
          term_id: action.term_id,
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
          term_id: action.term_id,
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
          term_id: action.term_id,
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
        schedules: state.schedules.concat({
          id: schedule_id,
          term_id: action.term_id,
        }),
      };
    }
    case DELETE_TERM: {
      const deleted_group_ids = new Set(
        state.groups
          .filter(({ term_id }) => term_id === action.id)
          .map(({ id }) => id)
      );
      const deleted_constraint0_ids = new Set(
        state.constraints0
          .filter(({ term_id }) => term_id === action.id)
          .map(({ id }) => id)
      );
      const deleted_schedule_ids = new Set(
        state.schedules
          .filter(({ term_id }) => term_id === action.id)
          .map(({ id }) => id)
      );
      return {
        ...state,
        members: state.members.filter(({ term_id }) => term_id !== action.id),
        terms: state.terms.filter(({ id }) => id !== action.id),
        kinmus: state.kinmus.filter(({ term_id }) => term_id !== action.id),
        groups: state.groups.filter(({ term_id }) => term_id !== action.id),
        group_members: state.group_members.filter(
          ({ group_id }) => !deleted_group_ids.has(group_id)
        ),
        constraints0: state.constraints0.filter(
          ({ term_id }) => term_id !== action.id
        ),
        constraint0_kinmus: state.constraint0_kinmus.filter(
          ({ constraint0_id }) => !deleted_constraint0_ids.has(constraint0_id)
        ),
        constraints1: state.constraints1.filter(
          ({ term_id }) => term_id !== action.id
        ),
        constraints2: state.constraints2.filter(
          ({ term_id }) => term_id !== action.id
        ),
        constraints3: state.constraints3.filter(
          ({ term_id }) => term_id !== action.id
        ),
        constraints4: state.constraints4.filter(
          ({ term_id }) => term_id !== action.id
        ),
        constraints5: state.constraints5.filter(
          ({ term_id }) => term_id !== action.id
        ),
        constraints6: state.constraints6.filter(
          ({ term_id }) => term_id !== action.id
        ),
        constraints7: state.constraints7.filter(
          ({ term_id }) => term_id !== action.id
        ),
        constraints8: state.constraints8.filter(
          ({ term_id }) => term_id !== action.id
        ),
        constraints9: state.constraints9.filter(
          ({ term_id }) => term_id !== action.id
        ),
        constraints10: state.constraints10.filter(
          ({ term_id }) => term_id !== action.id
        ),
        schedules: state.schedules.filter(
          ({ term_id }) => term_id !== action.id
        ),
        assignments: state.assignments.filter(
          ({ schedule_id }) => !deleted_schedule_ids.has(schedule_id)
        ),
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
