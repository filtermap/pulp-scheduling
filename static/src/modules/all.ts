import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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

const initialState: All = {
  members: [],
  terms: [],
  kinmus: [],
  groups: [],
  group_members: [],
  constraints0: [],
  constraint0_kinmus: [],
  constraints1: [],
  constraints2: [],
  constraints3: [],
  constraints4: [],
  constraints5: [],
  constraints6: [],
  constraints7: [],
  constraints8: [],
  constraints9: [],
  constraints10: [],
  schedules: [],
  assignments: [],
};

function maxId<T extends { id: number }>(array: T[]): number {
  return Math.max(0, ...array.map(({ id }) => id));
}

// TODO: think more semantic function name
function doubleItemsByKey<T extends { id: number }>(
  array: T[],
  keyOfItem: keyof T,
  fromValue: T[keyof T],
  toValue: T[keyof T]
): { copied: T[]; idMap: Map<number, number> } {
  return array.reduce<{
    copied: T[];
    idMap: Map<number, number>;
    lastId: number;
  }>(
    (acc, value) => {
      if (value[keyOfItem] !== fromValue) return acc;
      acc.lastId++;
      acc.copied.push({
        ...value,
        id: acc.lastId,
        [keyOfItem]: toValue,
      });
      acc.idMap.set(value.id, acc.lastId);
      return acc;
    },
    { lastId: maxId(array), copied: [], idMap: new Map() }
  );
}

const all = createSlice({
  name: "all",
  initialState,
  reducers: {
    replaceAll: (
      _,
      action: PayloadAction<{
        all: All;
      }>
    ) => {
      return action.payload.all;
    },
    importData: (
      state,
      action: PayloadAction<{
        from_term_id: number;
        into_term_id: number;
      }>
    ) => {
      const { copied: copiedMembers, idMap: memberIdMap } =
        doubleItemsByKey<members.Member>(
          state.members,
          "term_id",
          action.payload.from_term_id,
          action.payload.into_term_id
        );
      const { copied: copiedKinmus, idMap: kinmuIdMap } =
        doubleItemsByKey<kinmus.Kinmu>(
          state.kinmus,
          "term_id",
          action.payload.from_term_id,
          action.payload.into_term_id
        );
      const { copied: copiedGroups, idMap: groupIdMap } =
        doubleItemsByKey<groups.Group>(
          state.groups,
          "term_id",
          action.payload.from_term_id,
          action.payload.into_term_id
        );
      const { copied: copiedGroupMembers } = state.group_members.reduce<{
        lastId: number;
        copied: group_members.GroupMember[];
      }>(
        (acc, gm) => {
          const group_id = groupIdMap.get(gm.group_id);
          const member_id = memberIdMap.get(gm.member_id);
          if (!group_id || !member_id) return acc;
          acc.lastId++;
          acc.copied.push({
            ...gm,
            id: acc.lastId,
            group_id,
            member_id,
          });
          return acc;
        },
        { lastId: maxId(state.group_members), copied: [] }
      );
      const { copied: copiedConstraints0, idMap: constraint0IdMap } =
        doubleItemsByKey<constraints0.Constraint0>(
          state.constraints0,
          "term_id",
          action.payload.from_term_id,
          action.payload.into_term_id
        );
      const { copied: copiedConstraint0Kinmus } =
        state.constraint0_kinmus.reduce<{
          lastId: number;
          copied: constraint0_kinmus.Constraint0Kinmu[];
        }>(
          (acc, ck) => {
            const constraint0_id = constraint0IdMap.get(ck.constraint0_id);
            const kinmu_id = kinmuIdMap.get(ck.kinmu_id);
            if (!constraint0_id || !kinmu_id) return acc;
            acc.lastId++;
            acc.copied.push({
              ...ck,
              id: acc.lastId,
              constraint0_id,
              kinmu_id,
            });
            return acc;
          },
          { lastId: maxId(state.constraint0_kinmus), copied: [] }
        );
      const { copied: copiedConstraints1 } = state.constraints1.reduce<{
        lastId: number;
        copied: constraints1.Constraint1[];
      }>(
        (acc, c) => {
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          const group_id = groupIdMap.get(c.group_id);
          if (!kinmu_id || !group_id) return acc;
          acc.lastId++;
          acc.copied.push({
            ...c,
            id: acc.lastId,
            term_id: action.payload.into_term_id,
            kinmu_id,
            group_id,
          });
          return acc;
        },
        { lastId: maxId(state.constraints1), copied: [] }
      );
      const { copied: copiedConstraints2 } = state.constraints2.reduce<{
        lastId: number;
        copied: constraints2.Constraint2[];
      }>(
        (acc, c) => {
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          const group_id = groupIdMap.get(c.group_id);
          if (!kinmu_id || !group_id) return acc;
          acc.lastId++;
          acc.copied.push({
            ...c,
            id: acc.lastId,
            term_id: action.payload.into_term_id,
            kinmu_id,
            group_id,
          });
          return acc;
        },
        { lastId: maxId(state.constraints2), copied: [] }
      );
      const { copied: copiedConstraints3 } = state.constraints3.reduce<{
        lastId: number;
        copied: constraints3.Constraint3[];
      }>(
        (acc, c) => {
          const member_id = memberIdMap.get(c.member_id);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (!member_id || !kinmu_id) return acc;
          acc.lastId++;
          acc.copied.push({
            ...c,
            id: acc.lastId,
            term_id: action.payload.into_term_id,
            member_id,
            kinmu_id,
          });
          return acc;
        },
        { lastId: maxId(state.constraints3), copied: [] }
      );
      const { copied: copiedConstraints4 } = state.constraints4.reduce<{
        lastId: number;
        copied: constraints4.Constraint4[];
      }>(
        (acc, c) => {
          const member_id = memberIdMap.get(c.member_id);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (!member_id || !kinmu_id) return acc;
          acc.lastId++;
          acc.copied.push({
            ...c,
            id: acc.lastId,
            term_id: action.payload.into_term_id,
            member_id,
            kinmu_id,
          });
          return acc;
        },
        { lastId: maxId(state.constraints4), copied: [] }
      );
      const { copied: copiedConstraints5 } = state.constraints5.reduce<{
        lastId: number;
        copied: constraints5.Constraint5[];
      }>(
        (acc, c) => {
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (!kinmu_id) return acc;
          acc.lastId++;
          acc.copied.push({
            ...c,
            id: acc.lastId,
            term_id: action.payload.into_term_id,
            kinmu_id,
          });
          return acc;
        },
        { lastId: maxId(state.constraints5), copied: [] }
      );
      const { copied: copiedConstraints6 } = state.constraints6.reduce<{
        lastId: number;
        copied: constraints6.Constraint6[];
      }>(
        (acc, c) => {
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (!kinmu_id) return acc;
          acc.lastId++;
          acc.copied.push({
            ...c,
            id: acc.lastId,
            term_id: action.payload.into_term_id,
            kinmu_id,
          });
          return acc;
        },
        { lastId: maxId(state.constraints6), copied: [] }
      );
      const { copied: copiedConstraints7 } = state.constraints7.reduce<{
        lastId: number;
        copied: constraints7.Constraint7[];
      }>(
        (acc, c) => {
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (!kinmu_id) return acc;
          acc.lastId++;
          acc.copied.push({
            ...c,
            id: acc.lastId,
            term_id: action.payload.into_term_id,
            kinmu_id,
          });
          return acc;
        },
        { lastId: maxId(state.constraints7), copied: [] }
      );
      const { copied: copiedConstraints8 } = state.constraints8.reduce<{
        lastId: number;
        copied: constraints8.Constraint8[];
      }>(
        (acc, c) => {
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (!kinmu_id) return acc;
          acc.lastId++;
          acc.copied.push({
            ...c,
            id: acc.lastId,
            term_id: action.payload.into_term_id,
            kinmu_id,
          });
          return acc;
        },
        { lastId: maxId(state.constraints8), copied: [] }
      );
      const { copied: copiedConstraints9 } = state.constraints9.reduce<{
        lastId: number;
        copied: constraints9.Constraint9[];
      }>(
        (acc, c) => {
          const member_id = memberIdMap.get(c.member_id);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (!member_id || !kinmu_id) return acc;
          acc.lastId++;
          acc.copied.push({
            ...c,
            id: acc.lastId,
            term_id: action.payload.into_term_id,
            member_id,
            kinmu_id,
          });
          return acc;
        },
        { lastId: maxId(state.constraints9), copied: [] }
      );
      const { copied: copiedConstraints10 } = state.constraints10.reduce<{
        lastId: number;
        copied: constraints10.Constraint10[];
      }>(
        (acc, c) => {
          const member_id = memberIdMap.get(c.member_id);
          const kinmu_id = kinmuIdMap.get(c.kinmu_id);
          if (!member_id || !kinmu_id) return acc;
          acc.lastId++;
          acc.copied.push({
            ...c,
            id: acc.lastId,
            term_id: action.payload.into_term_id,
            member_id,
            kinmu_id,
          });
          return acc;
        },
        { lastId: maxId(state.constraints10), copied: [] }
      );
      state.members.push(...copiedMembers);
      state.kinmus.push(...copiedKinmus);
      state.groups.push(...copiedGroups);
      state.group_members.push(...copiedGroupMembers);
      state.constraints0.push(...copiedConstraints0);
      state.constraint0_kinmus.push(...copiedConstraint0Kinmus);
      state.constraints1.push(...copiedConstraints1);
      state.constraints2.push(...copiedConstraints2);
      state.constraints3.push(...copiedConstraints3);
      state.constraints4.push(...copiedConstraints4);
      state.constraints5.push(...copiedConstraints5);
      state.constraints6.push(...copiedConstraints6);
      state.constraints7.push(...copiedConstraints7);
      state.constraints8.push(...copiedConstraints8);
      state.constraints9.push(...copiedConstraints9);
      state.constraints10.push(...copiedConstraints10);
    },
    createMember: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        name: string;
        group_ids: number[];
      }>
    ) => {
      const member_id = Math.max(0, ...state.members.map(({ id }) => id)) + 1;
      const group_member_id =
        Math.max(0, ...state.group_members.map(({ id }) => id)) + 1;
      state.group_members.push(
        ...action.payload.group_ids.map((group_id, index) => ({
          group_id,
          id: group_member_id + index,
          member_id,
        }))
      );
      state.members.push({
        id: member_id,
        term_id: action.payload.term_id,
        is_enabled: action.payload.is_enabled,
        name: action.payload.name,
      });
    },
    createGroup: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        name: string;
        member_ids: number[];
      }>
    ) => {
      const group_id = Math.max(0, ...state.groups.map(({ id }) => id)) + 1;
      const group_member_id =
        Math.max(0, ...state.group_members.map(({ id }) => id)) + 1;
      state.group_members.push(
        ...action.payload.member_ids.map((member_id, index) => ({
          group_id,
          id: group_member_id + index,
          member_id,
        }))
      );
      state.groups.push({
        id: group_id,
        term_id: action.payload.term_id,
        is_enabled: action.payload.is_enabled,
        name: action.payload.name,
      });
    },
    createConstraint0: (
      state,
      action: PayloadAction<{
        term_id: number;
        is_enabled: boolean;
        kinmu_ids: number[];
      }>
    ) => {
      const constraint0_id =
        Math.max(0, ...state.constraints0.map(({ id }) => id)) + 1;
      const constraint0_kinmu_id =
        Math.max(0, ...state.constraint0_kinmus.map(({ id }) => id)) + 1;
      state.constraint0_kinmus.push(
        ...action.payload.kinmu_ids.map((kinmu_id, index) => ({
          constraint0_id,
          id: constraint0_kinmu_id + index,
          kinmu_id,
          sequence_number: index,
        }))
      );
      state.constraints0.push({
        id: constraint0_id,
        term_id: action.payload.term_id,
        is_enabled: action.payload.is_enabled,
      });
    },
    createSchedule: (
      state,
      action: PayloadAction<{
        term_id: number;
        new_assignments: assignments.Assignment[];
      }>
    ) => {
      const schedule_id =
        Math.max(0, ...state.schedules.map(({ id }) => id)) + 1;
      const assignment_id =
        Math.max(0, ...state.assignments.map(({ id }) => id)) + 1;
      state.assignments.push(
        ...action.payload.new_assignments.map((new_assignment, index) => ({
          ...new_assignment,
          id: assignment_id + index,
          schedule_id,
        }))
      );
      state.schedules.push({
        id: schedule_id,
        term_id: action.payload.term_id,
      });
    },
    deleteTerm: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      const deleted_group_ids = new Set(
        state.groups
          .filter(({ term_id }) => term_id === action.payload.id)
          .map(({ id }) => id)
      );
      const deleted_constraint0_ids = new Set(
        state.constraints0
          .filter(({ term_id }) => term_id === action.payload.id)
          .map(({ id }) => id)
      );
      const deleted_schedule_ids = new Set(
        state.schedules
          .filter(({ term_id }) => term_id === action.payload.id)
          .map(({ id }) => id)
      );
      return {
        ...state,
        members: state.members.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        terms: state.terms.filter(({ id }) => id !== action.payload.id),
        kinmus: state.kinmus.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        groups: state.groups.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        group_members: state.group_members.filter(
          ({ group_id }) => !deleted_group_ids.has(group_id)
        ),
        constraints0: state.constraints0.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        constraint0_kinmus: state.constraint0_kinmus.filter(
          ({ constraint0_id }) => !deleted_constraint0_ids.has(constraint0_id)
        ),
        constraints1: state.constraints1.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        constraints2: state.constraints2.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        constraints3: state.constraints3.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        constraints4: state.constraints4.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        constraints5: state.constraints5.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        constraints6: state.constraints6.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        constraints7: state.constraints7.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        constraints8: state.constraints8.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        constraints9: state.constraints9.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        constraints10: state.constraints10.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        schedules: state.schedules.filter(
          ({ term_id }) => term_id !== action.payload.id
        ),
        assignments: state.assignments.filter(
          ({ schedule_id }) => !deleted_schedule_ids.has(schedule_id)
        ),
      };
    },
    deleteMember: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      const filtered_assignments = state.assignments.filter(
        ({ member_id }) => member_id !== action.payload.id
      );
      const filtered_assignment_schedule_ids = Array.from(
        new Set(filtered_assignments.map(({ schedule_id }) => schedule_id))
      );
      return {
        ...state,
        assignments: filtered_assignments,
        constraints10: state.constraints10.filter(
          (c) => c.member_id !== action.payload.id
        ),
        constraints3: state.constraints3.filter(
          (c) => c.member_id !== action.payload.id
        ),
        constraints4: state.constraints4.filter(
          (c) => c.member_id !== action.payload.id
        ),
        constraints9: state.constraints9.filter(
          (c) => c.member_id !== action.payload.id
        ),
        group_members: state.group_members.filter(
          ({ member_id }) => member_id !== action.payload.id
        ),
        members: state.members.filter(({ id }) => id !== action.payload.id),
        schedules: state.schedules.filter(({ id }) =>
          filtered_assignment_schedule_ids.includes(id)
        ),
      };
    },
    deleteGroup: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      return {
        ...state,
        constraints1: state.constraints1.filter(
          (c) => c.group_id !== action.payload.id
        ),
        constraints2: state.constraints2.filter(
          (c) => c.group_id !== action.payload.id
        ),
        group_members: state.group_members.filter(
          ({ group_id }) => group_id !== action.payload.id
        ),
        groups: state.groups.filter(({ id }) => id !== action.payload.id),
      };
    },
    deleteKinmu: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      const deleted_constraint0_ids = Array.from(
        new Set(
          state.constraint0_kinmus
            .filter(({ kinmu_id }) => kinmu_id === action.payload.id)
            .map(({ constraint0_id }) => constraint0_id)
        )
      );
      const deleted_schedule_ids = Array.from(
        new Set(
          state.assignments
            .filter(({ kinmu_id }) => kinmu_id === action.payload.id)
            .map(({ schedule_id }) => schedule_id)
        )
      );
      return {
        ...state,
        assignments: state.assignments.filter(
          (assignment) => !deleted_schedule_ids.includes(assignment.schedule_id)
        ),
        constraint0_kinmus: state.constraint0_kinmus.filter(
          ({ kinmu_id }) => kinmu_id !== action.payload.id
        ),
        constraints0: state.constraints0.filter(
          (c) => !deleted_constraint0_ids.includes(c.id)
        ),
        constraints1: state.constraints1.filter(
          (c) => c.kinmu_id !== action.payload.id
        ),
        constraints10: state.constraints10.filter(
          (c) => c.kinmu_id !== action.payload.id
        ),
        constraints2: state.constraints2.filter(
          (c) => c.kinmu_id !== action.payload.id
        ),
        constraints3: state.constraints3.filter(
          (c) => c.kinmu_id !== action.payload.id
        ),
        constraints4: state.constraints4.filter(
          (c) => c.kinmu_id !== action.payload.id
        ),
        constraints5: state.constraints5.filter(
          (c) => c.kinmu_id !== action.payload.id
        ),
        constraints6: state.constraints6.filter(
          (c) => c.kinmu_id !== action.payload.id
        ),
        constraints7: state.constraints7.filter(
          (c) => c.kinmu_id !== action.payload.id
        ),
        constraints8: state.constraints8.filter(
          (c) => c.kinmu_id !== action.payload.id
        ),
        constraints9: state.constraints9.filter(
          (c) => c.kinmu_id !== action.payload.id
        ),
        kinmus: state.kinmus.filter(({ id }) => id !== action.payload.id),
        schedules: state.schedules.filter(
          ({ id }) => !deleted_schedule_ids.includes(id)
        ),
      };
    },
    deleteConstraint0: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      return {
        ...state,
        constraint0_kinmus: state.constraint0_kinmus.filter(
          ({ constraint0_id }) => constraint0_id !== action.payload.id
        ),
        constraints0: state.constraints0.filter(
          (c) => c.id !== action.payload.id
        ),
      };
    },
    deleteConstraint0Kinmu: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      const deleted_constraint0_kinmu = state.constraint0_kinmus.find(
        ({ id }) => id === action.payload.id
      )!;
      const filtered_constraint0_kinmus = state.constraint0_kinmus.filter(
        ({ id }) => id !== action.payload.id
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
    },
    deleteSchedule: (
      state,
      action: PayloadAction<{
        id: number;
      }>
    ) => {
      return {
        ...state,
        assignments: state.assignments.filter(
          ({ schedule_id }) => schedule_id !== action.payload.id
        ),
        schedules: state.schedules.filter(({ id }) => id !== action.payload.id),
      };
    },
  },
});

export const {
  replaceAll,
  importData,
  createMember,
  createGroup,
  createConstraint0,
  createSchedule,
  deleteTerm,
  deleteMember,
  deleteGroup,
  deleteKinmu,
  deleteConstraint0,
  deleteConstraint0Kinmu,
  deleteSchedule,
} = all.actions;

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

export const reducer: Reducer<All> = (state, action) =>
  all.reducer(combinedReducer(state, action), action);
