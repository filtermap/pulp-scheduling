import reduceReducer from 'reduce-reducers'
import { combineReducers } from 'redux'
import * as assignments from './assignments'
import * as c0 from './c0'
import * as c0_kinmus from './c0_kinmus'
import * as c1 from './c1'
import * as c10 from './c10'
import * as c2 from './c2'
import * as c3 from './c3'
import * as c4 from './c4'
import * as c5 from './c5'
import * as c6 from './c6'
import * as c7 from './c7'
import * as c8 from './c8'
import * as c9 from './c9'
import * as group_members from './group_members'
import * as groups from './groups'
import * as kinmus from './kinmus'
import * as members from './members'
import * as rosters from './rosters'
import * as terms from './terms'

const REPLACE_ALL = "REPLACE_ALL"
const CREATE_MEMBER = 'CREATE_MEMBER'
const CREATE_GROUP = 'CREATE_GROUP'
const CREATE_C0 = 'CREATE_C0'
const CREATE_ROSTER = 'CREATE_ROSTER'
const DELETE_MEMBER = 'DELETE_MEMBER'
const DELETE_GROUP = 'DELETE_GROUP'
const DELETE_KINMU = 'DELETE_KINMU'
const DELETE_C0 = 'DELETE_C0'
const DELETE_ROSTER = 'DELETE_ROSTER'

export type All = {
  members: members.Member[]
  terms: terms.Term[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
  group_members: group_members.GroupMember[]
  c0: c0.C0[]
  c0_kinmus: c0_kinmus.C0Kinmu[]
  c1: c1.C1[]
  c2: c2.C2[]
  c3: c3.C3[]
  c4: c4.C4[]
  c5: c5.C5[]
  c6: c6.C6[]
  c7: c7.C7[]
  c8: c8.C8[]
  c9: c9.C9[]
  c10: c10.C10[]
  rosters: rosters.Roster[]
  assignments: assignments.Assignment[]
}

type ReplaceAll = {
  type: typeof REPLACE_ALL
  all: All
}

type CreateMember = {
  type: typeof CREATE_MEMBER
  name: string
  group_ids: number[]
}

type CreateGroup = {
  type: typeof CREATE_GROUP
  name: string
  member_ids: number[]
}

type CreateC0 = {
  type: typeof CREATE_C0
  kinmu_ids: number[]
}

type CreateRoster = {
  type: typeof CREATE_ROSTER
  new_assignments: assignments.Assignment[]
}

type DeleteMember = {
  type: typeof DELETE_MEMBER
  id: number
}

type DeleteGroup = {
  type: typeof DELETE_GROUP
  id: number
}

type DeleteKinmu = {
  type: typeof DELETE_KINMU
  id: number
}

type DeleteC0 = {
  type: typeof DELETE_C0
  id: number
}

type DeleteRoster = {
  type: typeof DELETE_ROSTER
  id: number
}

type Action =
  | ReplaceAll
  | CreateMember
  | CreateGroup
  | CreateC0
  | CreateRoster
  | DeleteMember
  | DeleteGroup
  | DeleteKinmu
  | DeleteC0
  | DeleteRoster

export function replaceAll(all: All): ReplaceAll {
  return {
    all,
    type: REPLACE_ALL
  }
}

export function createMember(name: string, group_ids: number[]): CreateMember {
  return {
    group_ids,
    name,
    type: CREATE_MEMBER,
  }
}

export function createGroup(name: string, member_ids: number[]): CreateGroup {
  return {
    member_ids,
    name,
    type: CREATE_GROUP,
  }
}

export function createC0(kinmu_ids: number[]): CreateC0 {
  return {
    kinmu_ids,
    type: CREATE_C0,
  }
}

export function createRoster(new_assignments: assignments.Assignment[]): CreateRoster {
  return {
    new_assignments,
    type: CREATE_ROSTER,
  }
}

export function deleteMember(id: number): DeleteMember {
  return {
    id,
    type: DELETE_MEMBER,
  }
}

export function deleteGroup(id: number): DeleteGroup {
  return {
    id,
    type: DELETE_GROUP,
  }
}

export function deleteKinmu(id: number): DeleteKinmu {
  return {
    id,
    type: DELETE_KINMU,
  }
}

export function deleteC0(id: number): DeleteC0 {
  return {
    id,
    type: DELETE_C0,
  }
}

export function deleteRoster(id: number): DeleteRoster {
  return {
    id,
    type: DELETE_ROSTER,
  }
}

export type State = All

const combinedReducer: (state: State, action: Action) => State = combineReducers({
  assignments: assignments.reducer,
  c0: c0.reducer,
  c0_kinmus: c0_kinmus.reducer,
  c1: c1.reducer,
  c10: c10.reducer,
  c2: c2.reducer,
  c3: c3.reducer,
  c4: c4.reducer,
  c5: c5.reducer,
  c6: c6.reducer,
  c7: c7.reducer,
  c8: c8.reducer,
  c9: c9.reducer,
  group_members: group_members.reducer,
  groups: groups.reducer,
  kinmus: kinmus.reducer,
  members: members.reducer,
  rosters: rosters.reducer,
  terms: terms.reducer,
})

function crossSliceReducer(state: State, action: Action): State {
  switch (action.type) {
    case REPLACE_ALL:
      return action.all
    case CREATE_MEMBER: {
      const member_id = Math.max(0, ...state.members.map(({ id }) => id)) + 1
      const group_member_id = Math.max(0, ...state.group_members.map(({ id }) => id)) + 1
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
          name: action.name,
        }),
      }
    }
    case CREATE_GROUP: {
      const group_id = Math.max(0, ...state.groups.map(({ id }) => id)) + 1
      const group_member_id = Math.max(0, ...state.group_members.map(({ id }) => id)) + 1
      return {
        ...state,
        group_members: state.group_members.concat(action.member_ids.map((member_id, index) => ({
          group_id,
          id: group_member_id + index,
          member_id,
        }))),
        groups: state.groups.concat({
          id: group_id,
          name: action.name,
        }),
      }
    }
    case CREATE_C0: {
      const c0_id = Math.max(0, ...state.c0.map(({ id }) => id)) + 1
      const c0_kinmu_id = Math.max(0, ...state.c0_kinmus.map(({ id }) => id)) + 1
      return {
        ...state,
        c0: state.c0.concat({ id: c0_id }),
        c0_kinmus: state.c0_kinmus.concat(action.kinmu_ids.map((kinmu_id, index) => ({
          c0_id,
          id: c0_kinmu_id + index,
          kinmu_id,
          sequence_number: index,
        }))),
      }
    }
    case CREATE_ROSTER: {
      const roster_id = Math.max(0, ...state.rosters.map(({ id }) => id)) + 1
      const assignment_id = Math.max(0, ...state.assignments.map(({ id }) => id)) + 1
      return {
        ...state,
        assignments: state.assignments.concat(action.new_assignments.map((new_assignment, index) => ({
          ...new_assignment,
          id: assignment_id + index,
          roster_id,
        }))),
        rosters: state.rosters.concat({ id: roster_id, }),
      }
    }
    case DELETE_MEMBER: {
      const filtered_assignments = state.assignments.filter(({ member_id }) => member_id !== action.id)
      const filtered_assignment_roster_ids = Array.from(new Set(filtered_assignments.map(({ roster_id }) => roster_id)))
      return {
        ...state,
        assignments: filtered_assignments,
        c10: state.c10.filter(c => c.member_id !== action.id),
        c3: state.c3.filter(c => c.member_id !== action.id),
        c4: state.c4.filter(c => c.member_id !== action.id),
        c9: state.c9.filter(c => c.member_id !== action.id),
        group_members: state.group_members.filter(({ member_id }) => member_id !== action.id),
        members: state.members.filter(({ id }) => id !== action.id),
        rosters: state.rosters.filter(({ id }) => filtered_assignment_roster_ids.includes(id))
      }
    }
    case DELETE_GROUP:
      return {
        ...state,
        c1: state.c1.filter(c => c.group_id !== action.id),
        c2: state.c2.filter(c => c.group_id !== action.id),
        group_members: state.group_members.filter(({ group_id }) => group_id !== action.id),
        groups: state.groups.filter(({ id }) => id !== action.id),
      }
    case DELETE_KINMU: {
      const deleted_c0_ids = Array.from(new Set(state.c0_kinmus.filter(({ kinmu_id }) => kinmu_id === action.id).map(({ c0_id }) => c0_id)))
      const deleted_roster_ids = Array.from(new Set(state.assignments.filter(({ kinmu_id }) => kinmu_id === action.id).map(({ roster_id }) => roster_id)))
      return {
        ...state,
        assignments: state.assignments.filter(assignment => !deleted_roster_ids.includes(assignment.roster_id)),
        c0: state.c0.filter(c => !deleted_c0_ids.includes(c.id)),
        c0_kinmus: state.c0_kinmus.filter(({ kinmu_id }) => kinmu_id !== action.id),
        c1: state.c1.filter(c => c.kinmu_id !== action.id),
        c10: state.c10.filter(c => c.kinmu_id !== action.id),
        c2: state.c2.filter(c => c.kinmu_id !== action.id),
        c3: state.c3.filter(c => c.kinmu_id !== action.id),
        c4: state.c4.filter(c => c.kinmu_id !== action.id),
        c5: state.c5.filter(c => c.kinmu_id !== action.id),
        c6: state.c6.filter(c => c.kinmu_id !== action.id),
        c7: state.c7.filter(c => c.kinmu_id !== action.id),
        c8: state.c8.filter(c => c.kinmu_id !== action.id),
        c9: state.c9.filter(c => c.kinmu_id !== action.id),
        kinmus: state.kinmus.filter(({ id }) => id !== action.id),
        rosters: state.rosters.filter(({ id }) => !deleted_roster_ids.includes(id)),
      }
    }
    case DELETE_C0:
      return {
        ...state,
        c0: state.c0.filter(c => c.id !== action.id),
        c0_kinmus: state.c0_kinmus.filter(({ c0_id }) => c0_id !== action.id),
      }
    case DELETE_ROSTER:
      return {
        ...state,
        assignments: state.assignments.filter(({ roster_id }) => roster_id !== action.id),
        rosters: state.rosters.filter(({ id }) => id !== action.id),
      }
  }
  return state
}

export const reducer = reduceReducer(combinedReducer, crossSliceReducer)
