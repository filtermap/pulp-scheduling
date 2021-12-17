import { createSlice, PayloadAction, Update } from "@reduxjs/toolkit";
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

export type PlainAll = {
  terms: terms.Term[];
  members: members.Member[];
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

export type All = {
  terms: ReturnType<typeof terms.reducer>;
  members: ReturnType<typeof members.reducer>;
  kinmus: ReturnType<typeof kinmus.reducer>;
  groups: ReturnType<typeof groups.reducer>;
  group_members: ReturnType<typeof group_members.reducer>;
  constraints0: ReturnType<typeof constraints0.reducer>;
  constraint0_kinmus: ReturnType<typeof constraint0_kinmus.reducer>;
  constraints1: ReturnType<typeof constraints1.reducer>;
  constraints2: ReturnType<typeof constraints2.reducer>;
  constraints3: ReturnType<typeof constraints3.reducer>;
  constraints4: ReturnType<typeof constraints4.reducer>;
  constraints5: ReturnType<typeof constraints5.reducer>;
  constraints6: ReturnType<typeof constraints6.reducer>;
  constraints7: ReturnType<typeof constraints7.reducer>;
  constraints8: ReturnType<typeof constraints8.reducer>;
  constraints9: ReturnType<typeof constraints9.reducer>;
  constraints10: ReturnType<typeof constraints10.reducer>;
  schedules: ReturnType<typeof schedules.reducer>;
  assignments: ReturnType<typeof assignments.reducer>;
};

const initialState: All = {
  terms: terms.adapter.getInitialState(),
  members: members.adapter.getInitialState(),
  kinmus: kinmus.adapter.getInitialState(),
  groups: groups.adapter.getInitialState(),
  group_members: group_members.adapter.getInitialState(),
  constraints0: constraints0.adapter.getInitialState(),
  constraint0_kinmus: constraint0_kinmus.adapter.getInitialState(),
  constraints1: constraints1.adapter.getInitialState(),
  constraints2: constraints2.adapter.getInitialState(),
  constraints3: constraints3.adapter.getInitialState(),
  constraints4: constraints4.adapter.getInitialState(),
  constraints5: constraints5.adapter.getInitialState(),
  constraints6: constraints6.adapter.getInitialState(),
  constraints7: constraints7.adapter.getInitialState(),
  constraints8: constraints8.adapter.getInitialState(),
  constraints9: constraints9.adapter.getInitialState(),
  constraints10: constraints10.adapter.getInitialState(),
  schedules: schedules.adapter.getInitialState(),
  assignments: assignments.adapter.getInitialState(),
};

function maxId<T extends { id: number }>(array: T[]): number {
  return Math.max(0, ...array.map(({ id }) => id));
}

// TODO: think more meaningfull function name
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
    replaceAll: (state, action: PayloadAction<PlainAll>) => {
      terms.adapter.setAll(state.terms, action.payload.terms);
      members.adapter.setAll(state.members, action.payload.members);
      kinmus.adapter.setAll(state.kinmus, action.payload.kinmus);
      groups.adapter.setAll(state.groups, action.payload.groups);
      group_members.adapter.setAll(
        state.group_members,
        action.payload.group_members
      );
      constraints0.adapter.setAll(
        state.constraints0,
        action.payload.constraints0
      );
      constraint0_kinmus.adapter.setAll(
        state.constraint0_kinmus,
        action.payload.constraint0_kinmus
      );
      constraints1.adapter.setAll(
        state.constraints1,
        action.payload.constraints1
      );
      constraints2.adapter.setAll(
        state.constraints2,
        action.payload.constraints2
      );
      constraints3.adapter.setAll(
        state.constraints3,
        action.payload.constraints3
      );
      constraints4.adapter.setAll(
        state.constraints4,
        action.payload.constraints4
      );
      constraints5.adapter.setAll(
        state.constraints5,
        action.payload.constraints5
      );
      constraints6.adapter.setAll(
        state.constraints6,
        action.payload.constraints6
      );
      constraints7.adapter.setAll(
        state.constraints7,
        action.payload.constraints7
      );
      constraints8.adapter.setAll(
        state.constraints8,
        action.payload.constraints8
      );
      constraints9.adapter.setAll(
        state.constraints9,
        action.payload.constraints9
      );
      constraints10.adapter.setAll(
        state.constraints10,
        action.payload.constraints10
      );
      schedules.adapter.setAll(state.schedules, action.payload.schedules);
      assignments.adapter.setAll(state.assignments, action.payload.assignments);
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          state.members.ids.map((id) => state.members.entities[id]!),
          "term_id",
          action.payload.from_term_id,
          action.payload.into_term_id
        );
      const { copied: copiedKinmus, idMap: kinmuIdMap } =
        doubleItemsByKey<kinmus.Kinmu>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          state.kinmus.ids.map((id) => state.kinmus.entities[id]!),
          "term_id",
          action.payload.from_term_id,
          action.payload.into_term_id
        );
      const { copied: copiedGroups, idMap: groupIdMap } =
        doubleItemsByKey<groups.Group>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          state.groups.ids.map((id) => state.groups.entities[id]!),
          "term_id",
          action.payload.from_term_id,
          action.payload.into_term_id
        );
      const { copied: copiedGroupMembers } = state.group_members.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.group_members.entities[id]!)
        .reduce<{
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
          {
            lastId: Math.max(0, ...(state.group_members.ids as number[])),
            copied: [],
          }
        );
      const { copied: copiedConstraints0, idMap: constraint0IdMap } =
        doubleItemsByKey<constraints0.Constraint0>(
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          state.constraints0.ids.map((id) => state.constraints0.entities[id]!),
          "term_id",
          action.payload.from_term_id,
          action.payload.into_term_id
        );
      const { copied: copiedConstraint0Kinmus } = state.constraint0_kinmus.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.constraint0_kinmus.entities[id]!)
        .reduce<{
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
          {
            lastId: Math.max(0, ...(state.constraint0_kinmus.ids as number[])),
            copied: [],
          }
        );
      const { copied: copiedConstraints1 } = state.constraints1.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.constraints1.entities[id]!)
        .reduce<{
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
          {
            lastId: Math.max(0, ...(state.constraints1.ids as number[])),
            copied: [],
          }
        );
      const { copied: copiedConstraints2 } = state.constraints2.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.constraints2.entities[id]!)
        .reduce<{
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
          {
            lastId: Math.max(0, ...(state.constraints2.ids as number[])),
            copied: [],
          }
        );
      const { copied: copiedConstraints3 } = state.constraints3.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.constraints3.entities[id]!)
        .reduce<{
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
          {
            lastId: Math.max(0, ...(state.constraints3.ids as number[])),
            copied: [],
          }
        );
      const { copied: copiedConstraints4 } = state.constraints4.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.constraints4.entities[id]!)
        .reduce<{
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
          {
            lastId: Math.max(0, ...(state.constraints4.ids as number[])),
            copied: [],
          }
        );
      const { copied: copiedConstraints5 } = state.constraints5.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.constraints5.entities[id]!)
        .reduce<{
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
          {
            lastId: Math.max(0, ...(state.constraints5.ids as number[])),
            copied: [],
          }
        );
      const { copied: copiedConstraints6 } = state.constraints6.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.constraints6.entities[id]!)
        .reduce<{
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
          {
            lastId: Math.max(0, ...(state.constraints6.ids as number[])),
            copied: [],
          }
        );
      const { copied: copiedConstraints7 } = state.constraints7.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.constraints7.entities[id]!)
        .reduce<{
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
          {
            lastId: Math.max(0, ...(state.constraints7.ids as number[])),
            copied: [],
          }
        );
      const { copied: copiedConstraints8 } = state.constraints8.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.constraints8.entities[id]!)
        .reduce<{
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
          {
            lastId: Math.max(0, ...(state.constraints8.ids as number[])),
            copied: [],
          }
        );
      const { copied: copiedConstraints9 } = state.constraints9.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.constraints9.entities[id]!)
        .reduce<{
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
          {
            lastId: Math.max(0, ...(state.constraints9.ids as number[])),
            copied: [],
          }
        );
      const { copied: copiedConstraints10 } = state.constraints10.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.constraints10.entities[id]!)
        .reduce<{
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
          {
            lastId: Math.max(0, ...(state.constraints10.ids as number[])),
            copied: [],
          }
        );
      members.adapter.addMany(state.members, copiedMembers);
      kinmus.adapter.addMany(state.kinmus, copiedKinmus);
      groups.adapter.addMany(state.groups, copiedGroups);
      group_members.adapter.addMany(state.group_members, copiedGroupMembers);
      constraints0.adapter.addMany(state.constraints0, copiedConstraints0);
      constraint0_kinmus.adapter.addMany(
        state.constraint0_kinmus,
        copiedConstraint0Kinmus
      );
      constraints1.adapter.addMany(state.constraints1, copiedConstraints1);
      constraints2.adapter.addMany(state.constraints2, copiedConstraints2);
      constraints3.adapter.addMany(state.constraints3, copiedConstraints3);
      constraints4.adapter.addMany(state.constraints4, copiedConstraints4);
      constraints5.adapter.addMany(state.constraints5, copiedConstraints5);
      constraints6.adapter.addMany(state.constraints6, copiedConstraints6);
      constraints7.adapter.addMany(state.constraints7, copiedConstraints7);
      constraints8.adapter.addMany(state.constraints8, copiedConstraints8);
      constraints9.adapter.addMany(state.constraints9, copiedConstraints9);
      constraints10.adapter.addMany(state.constraints10, copiedConstraints10);
    },
    createMember: (
      state,
      action: PayloadAction<{
        member: {
          term_id: number;
          is_enabled: boolean;
          name: string;
        };
        group_ids: number[];
      }>
    ) => {
      const member_id = Math.max(0, ...(state.members.ids as number[])) + 1;
      members.adapter.addOne(state.members, {
        ...action.payload.member,
        id: member_id,
      });
      const group_member_id =
        Math.max(0, ...(state.group_members.ids as number[])) + 1;
      group_members.adapter.addMany(
        state.group_members,
        action.payload.group_ids.map((group_id, index) => ({
          id: group_member_id + index,
          group_id,
          member_id,
        }))
      );
    },
    addGroup: (
      state,
      action: PayloadAction<{
        group: {
          term_id: number;
          is_enabled: boolean;
          name: string;
        };
        member_ids: number[];
      }>
    ) => {
      const group_id = Math.max(0, ...(state.groups.ids as number[])) + 1;
      groups.adapter.addOne(state.groups, {
        ...action.payload.group,
        id: group_id,
      });
      const group_member_id =
        Math.max(0, ...(state.group_members.ids as number[])) + 1;
      group_members.adapter.addMany(
        state.group_members,
        action.payload.member_ids.map((member_id, index) => ({
          id: group_member_id + index,
          group_id,
          member_id,
        }))
      );
    },
    createConstraint0: (
      state,
      action: PayloadAction<{
        constraint0: {
          term_id: number;
          is_enabled: boolean;
        };
        kinmu_ids: number[];
      }>
    ) => {
      const constraint0_id =
        Math.max(0, ...(state.constraints0.ids as number[])) + 1;
      constraints0.adapter.addOne(state.constraints0, {
        ...action.payload.constraint0,
        id: constraint0_id,
      });
      const constraint0_kinmu_id =
        Math.max(0, ...(state.constraint0_kinmus.ids as number[])) + 1;
      constraint0_kinmus.adapter.addMany(
        state.constraint0_kinmus,
        action.payload.kinmu_ids.map((kinmu_id, index) => ({
          constraint0_id,
          id: constraint0_kinmu_id + index,
          kinmu_id,
          sequence_number: index,
        }))
      );
    },
    createSchedule: (
      state,
      action: PayloadAction<{
        schedule: {
          term_id: number;
        };
        new_assignments: assignments.Assignment[];
      }>
    ) => {
      const schedule_id = Math.max(0, ...(state.schedules.ids as number[])) + 1;
      schedules.adapter.addOne(state.schedules, {
        ...action.payload.schedule,
        id: schedule_id,
      });
      const assignment_id =
        Math.max(0, ...(state.assignments.ids as number[])) + 1;
      assignments.adapter.addMany(
        state.assignments,
        action.payload.new_assignments.map((new_assignment, index) => ({
          ...new_assignment,
          id: assignment_id + index,
          schedule_id,
        }))
      );
    },
    removeTerm: (state, action: PayloadAction<number>) => {
      const deleted_group_ids = new Set(
        state.groups.ids.filter(
          (id) => state.groups.entities[id]?.term_id === action.payload
        )
      );
      const deleted_constraint0_ids = state.constraints0.ids.filter(
        (id) => state.constraints0.entities[id]?.term_id === action.payload
      );
      const deleted_schedule_ids = new Set(
        state.schedules.ids.filter(
          (id) => state.schedules.entities[id]?.term_id === action.payload
        )
      );
      terms.adapter.removeOne(state.terms, action.payload);
      members.adapter.removeMany(
        state.members,
        state.members.ids.filter(
          (id) => state.members.entities[id]?.term_id === action.payload
        )
      );
      kinmus.adapter.removeMany(
        state.kinmus,
        state.kinmus.ids.filter(
          (id) => state.kinmus.entities[id]?.term_id === action.payload
        )
      );
      groups.adapter.removeMany(
        state.groups,
        state.groups.ids.filter(
          (id) => state.groups.entities[id]?.term_id === action.payload
        )
      );
      group_members.adapter.removeMany(
        state.group_members,
        state.group_members.ids.filter((id) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          deleted_group_ids.has(state.group_members.entities[id]!.group_id)
        )
      );
      constraints0.adapter.removeMany(
        state.constraints0,
        deleted_constraint0_ids
      );
      constraint0_kinmus.adapter.removeMany(
        state.constraint0_kinmus,
        state.constraint0_kinmus.ids.filter((id) =>
          deleted_constraint0_ids.includes(
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            state.constraint0_kinmus.entities[id]!.constraint0_id
          )
        )
      );
      constraints1.adapter.removeMany(
        state.constraints1,
        state.constraints1.ids.filter(
          (id) => state.constraints1.entities[id]?.term_id === action.payload
        )
      );
      constraints2.adapter.removeMany(
        state.constraints2,
        state.constraints2.ids.filter(
          (id) => state.constraints2.entities[id]?.term_id === action.payload
        )
      );
      constraints3.adapter.removeMany(
        state.constraints3,
        state.constraints3.ids.filter(
          (id) => state.constraints3.entities[id]?.term_id === action.payload
        )
      );
      constraints4.adapter.removeMany(
        state.constraints4,
        state.constraints4.ids.filter(
          (id) => state.constraints4.entities[id]?.term_id === action.payload
        )
      );
      constraints5.adapter.removeMany(
        state.constraints5,
        state.constraints5.ids.filter(
          (id) => state.constraints5.entities[id]?.term_id === action.payload
        )
      );
      constraints6.adapter.removeMany(
        state.constraints6,
        state.constraints6.ids.filter(
          (id) => state.constraints6.entities[id]?.term_id === action.payload
        )
      );
      constraints7.adapter.removeMany(
        state.constraints7,
        state.constraints7.ids.filter(
          (id) => state.constraints7.entities[id]?.term_id === action.payload
        )
      );
      constraints8.adapter.removeMany(
        state.constraints8,
        state.constraints8.ids.filter(
          (id) => state.constraints8.entities[id]?.term_id === action.payload
        )
      );
      constraints9.adapter.removeMany(
        state.constraints9,
        state.constraints9.ids.filter(
          (id) => state.constraints9.entities[id]?.term_id === action.payload
        )
      );
      constraints10.adapter.removeMany(
        state.constraints10,
        state.constraints10.ids.filter(
          (id) => state.constraints10.entities[id]?.term_id === action.payload
        )
      );
      schedules.adapter.removeMany(
        state.schedules,
        state.schedules.ids.filter(
          (id) => state.schedules.entities[id]?.term_id !== action.payload
        )
      );
      assignments.adapter.removeMany(
        state.assignments,
        state.assignments.ids.filter((id) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          deleted_schedule_ids.has(state.assignments.entities[id]!.schedule_id)
        )
      );
    },
    removeMember: (state, action: PayloadAction<number>) => {
      members.adapter.removeOne(state.members, action.payload);
      const deleted_assignments = state.assignments.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.assignments.entities[id]!)
        .filter(({ kinmu_id }) => kinmu_id === action.payload);
      const deleted_assignment_ids = deleted_assignments.map(({ id }) => id);
      const deleted_schedule_ids = deleted_assignments.map(
        ({ schedule_id }) => schedule_id
      );
      group_members.adapter.removeMany(
        state.group_members,
        state.group_members.ids.filter(
          (id) => state.group_members.entities[id]?.member_id === action.payload
        )
      );
      constraints3.adapter.removeMany(
        state.constraints3,
        state.constraints3.ids.filter(
          (id) => state.constraints3.entities[id]?.member_id === action.payload
        )
      );
      constraints4.adapter.removeMany(
        state.constraints4,
        state.constraints4.ids.filter(
          (id) => state.constraints4.entities[id]?.member_id === action.payload
        )
      );
      constraints9.adapter.removeMany(
        state.constraints9,
        state.constraints9.ids.filter(
          (id) => state.constraints9.entities[id]?.member_id === action.payload
        )
      );
      constraints10.adapter.removeMany(
        state.constraints10,
        state.constraints10.ids.filter(
          (id) => state.constraints10.entities[id]?.member_id === action.payload
        )
      );
      schedules.adapter.removeMany(state.schedules, deleted_schedule_ids);
      assignments.adapter.removeMany(state.assignments, deleted_assignment_ids);
    },
    deleteGroup: (state, action: PayloadAction<number>) => {
      groups.adapter.removeOne(state.groups, action.payload);
      constraints1.adapter.removeMany(
        state.constraints1,
        state.constraints1.ids.filter(
          (id) => state.constraints1.entities[id]?.group_id === action.payload
        )
      );
      constraints2.adapter.removeMany(
        state.constraints2,
        state.constraints2.ids.filter(
          (id) => state.constraints2.entities[id]?.group_id === action.payload
        )
      );
      group_members.adapter.removeMany(
        state.group_members,
        state.group_members.ids.filter(
          (id) => state.group_members.entities[id]?.group_id === action.payload
        )
      );
    },
    removeKinmu: (state, action: PayloadAction<number>) => {
      kinmus.adapter.removeOne(state.kinmus, action.payload);
      const deleted_constraint0_ids = state.constraint0_kinmus.ids.filter(
        (id) =>
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          state.constraint0_kinmus.entities[id]!.kinmu_id === action.payload
      );
      constraint0_kinmus.adapter.removeMany(
        state.constraint0_kinmus,
        deleted_constraint0_ids
      );
      constraints0.adapter.removeMany(
        state.constraints0,
        deleted_constraint0_ids
      );
      constraints1.adapter.removeMany(
        state.constraints1,
        state.constraints1.ids.filter(
          (id) => state.constraints1.entities[id]?.kinmu_id === action.payload
        )
      );
      constraints2.adapter.removeMany(
        state.constraints2,
        state.constraints2.ids.filter(
          (id) => state.constraints2.entities[id]?.kinmu_id === action.payload
        )
      );
      constraints3.adapter.removeMany(
        state.constraints3,
        state.constraints3.ids.filter(
          (id) => state.constraints3.entities[id]?.kinmu_id === action.payload
        )
      );
      constraints4.adapter.removeMany(
        state.constraints4,
        state.constraints4.ids.filter(
          (id) => state.constraints4.entities[id]?.kinmu_id === action.payload
        )
      );
      constraints5.adapter.removeMany(
        state.constraints5,
        state.constraints5.ids.filter(
          (id) => state.constraints5.entities[id]?.kinmu_id === action.payload
        )
      );
      constraints6.adapter.removeMany(
        state.constraints6,
        state.constraints6.ids.filter(
          (id) => state.constraints6.entities[id]?.kinmu_id === action.payload
        )
      );
      constraints7.adapter.removeMany(
        state.constraints7,
        state.constraints7.ids.filter(
          (id) => state.constraints7.entities[id]?.kinmu_id === action.payload
        )
      );
      constraints8.adapter.removeMany(
        state.constraints8,
        state.constraints8.ids.filter(
          (id) => state.constraints8.entities[id]?.kinmu_id === action.payload
        )
      );
      constraints9.adapter.removeMany(
        state.constraints9,
        state.constraints9.ids.filter(
          (id) => state.constraints9.entities[id]?.kinmu_id === action.payload
        )
      );
      constraints10.adapter.removeMany(
        state.constraints10,
        state.constraints10.ids.filter(
          (id) => state.constraints10.entities[id]?.kinmu_id === action.payload
        )
      );
      const deleted_assignments = state.assignments.ids
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        .map((id) => state.assignments.entities[id]!)
        .filter(({ kinmu_id }) => kinmu_id === action.payload);
      const deleted_assignment_ids = deleted_assignments.map(({ id }) => id);
      assignments.adapter.removeMany(state.assignments, deleted_assignment_ids);
      const deleted_schedule_ids = deleted_assignments.map(
        ({ schedule_id }) => schedule_id
      );
      schedules.adapter.removeMany(state.schedules, deleted_schedule_ids);
    },
    removeConstraint0: (state, action: PayloadAction<number>) => {
      constraints0.adapter.removeOne(state.constraints0, action.payload);
      constraint0_kinmus.adapter.removeMany(
        state.constraint0_kinmus,
        state.constraint0_kinmus.ids.filter(
          (id) =>
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            state.constraint0_kinmus.entities[id]!.constraint0_id ===
            action.payload
        )
      );
    },
    removeConstraint0Kinmu: (state, action: PayloadAction<number>) => {
      const deleted_constraint0_kinmu =
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        state.constraint0_kinmus.entities[action.payload]!;
      constraint0_kinmus.adapter.removeOne(
        state.constraint0_kinmus,
        action.payload
      );
      const updatedConstraint0Kinmus: Update<constraint0_kinmus.Constraint0Kinmu>[] =
        state.constraint0_kinmus.ids
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          .map((id) => state.constraint0_kinmus.entities[id]!)
          .filter(
            (c) =>
              c.constraint0_id === deleted_constraint0_kinmu.constraint0_id &&
              c.sequence_number >= deleted_constraint0_kinmu.sequence_number
          )
          .map((c) => ({
            id: c.id,
            changes: {
              sequence_number: c.sequence_number - 1,
            },
          }));
      constraint0_kinmus.adapter.updateMany(
        state.constraint0_kinmus,
        updatedConstraint0Kinmus
      );
    },
    removeSchedule: (state, action: PayloadAction<number>) => {
      schedules.adapter.removeOne(state.schedules, action.payload);
      assignments.adapter.removeMany(
        state.assignments,
        state.assignments.ids.filter(
          (id) => state.assignments.entities[id]?.schedule_id === action.payload
        )
      );
    },
  },
});

export const {
  replaceAll,
  importData,
  createMember,
  addGroup,
  createConstraint0,
  createSchedule,
  removeTerm,
  removeMember,
  deleteGroup,
  removeKinmu,
  removeConstraint0,
  removeConstraint0Kinmu,
  removeSchedule,
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
