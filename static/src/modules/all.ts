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
import * as terms from './terms'

const REPLACE_ALL = "REPLACE_ALL"
const CREATE_MEMBER = 'CREATE_MEMBER'
const CREATE_GROUP = 'CREATE_GROUP'
const CREATE_C0 = 'CREATE_C0'
const DELETE_MEMBER = 'DELETE_MEMBER'
const DELETE_GROUP = 'DELETE_GROUP'
const DELETE_KINMU = 'DELETE_KINMU'
const DELETE_C0 = 'DELETE_C0'

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
  assignments: assignments.Assignment[]
}

type ReplaceAll = {
  type: typeof REPLACE_ALL
  all: All
}

type CreateMember = {
  type: typeof CREATE_MEMBER
  name: string
  group_indices: number[]
}

type CreateGroup = {
  type: typeof CREATE_GROUP
  name: string
  member_indices: number[]
}

type CreateC0 = {
  type: typeof CREATE_C0
  kinmu_indices: number[]
}

type DeleteMember = {
  type: typeof DELETE_MEMBER
  index: number
}

type DeleteGroup = {
  type: typeof DELETE_GROUP
  index: number
}

type DeleteKinmu = {
  type: typeof DELETE_KINMU
  index: number
}

type DeleteC0 = {
  type: typeof DELETE_C0
  sequence_id: number
}

type Action =
  | ReplaceAll
  | CreateMember
  | CreateGroup
  | CreateC0
  | DeleteMember
  | DeleteGroup
  | DeleteKinmu
  | DeleteC0

export function replaceAll(all: All): ReplaceAll {
  return {
    all,
    type: REPLACE_ALL
  }
}

export function createMember(name: string, group_indices: number[]): CreateMember {
  return {
    group_indices,
    name,
    type: CREATE_MEMBER,
  }
}

export function createGroup(name: string, member_indices: number[]): CreateGroup {
  return {
    member_indices,
    name,
    type: CREATE_GROUP,
  }
}

export function createC0(kinmu_indices: number[]): CreateC0 {
  return {
    kinmu_indices,
    type: CREATE_C0,
  }
}

export function deleteMember(index: number): DeleteMember {
  return {
    index,
    type: DELETE_MEMBER,
  }
}

export function deleteGroup(index: number): DeleteGroup {
  return {
    index,
    type: DELETE_GROUP,
  }
}

export function deleteKinmu(index: number): DeleteKinmu {
  return {
    index,
    type: DELETE_KINMU,
  }
}

export function deleteC0(sequence_id: number): DeleteC0 {
  return {
    sequence_id,
    type: DELETE_C0,
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
  terms: terms.reducer,
})

function crossSliceReducer(state: State, action: Action): State {
  switch (action.type) {
    case REPLACE_ALL:
      return action.all
    case CREATE_MEMBER: {
      const member_index = Math.max(0, ...state.members.map(member => member.index)) + 1
      const group_member_index = Math.max(0, ...state.group_members.map(group_member => group_member.index)) + 1
      return {
        ...state,
        group_members: state.group_members.concat(
          action.group_indices.map((group_index, index) => ({ index: group_member_index + index, group_index, member_index }))
        ),
        members: state.members.concat({ index: member_index, name: action.name }),
      }
    }
    case CREATE_GROUP: {
      const group_index = Math.max(0, ...state.groups.map(group => group.index)) + 1
      const group_member_index = Math.max(0, ...state.group_members.map(group_member => group_member.index)) + 1
      return {
        ...state,
        group_members: state.group_members.concat(
          action.member_indices.map((member_index, index) => ({ index: group_member_index + index, group_index, member_index }))
        ),
        groups: state.groups.concat({ index: group_index, name: action.name }),
      }
    }
    case CREATE_C0: {
      const sequence_id = Math.max(0, ...state.c0.map(c => c.sequence_id)) + 1
      const c0_kinmu_index = Math.max(0, ...state.c0_kinmus.map(c0_kinmu => c0_kinmu.index)) + 1
      return {
        ...state,
        c0: state.c0.concat({
          index: Math.max(0, ...state.c0.map(c => c.index)) + 1,
          sequence_id,
        }),
        c0_kinmus: state.c0_kinmus.concat(action.kinmu_indices.map((kinmu_index, index) => ({
          index: c0_kinmu_index + index,
          kinmu_index,
          sequence_id,
          sequence_number: index,
        }))),
      }
    }
    case DELETE_MEMBER:
      return {
        ...state,
        assignments: state.assignments.filter(assignment => assignment.member_index !== action.index),
        c10: state.c10.filter(c => c.member_index !== action.index),
        c3: state.c3.filter(c => c.member_index !== action.index),
        c4: state.c4.filter(c => c.member_index !== action.index),
        c9: state.c9.filter(c => c.member_index !== action.index),
        group_members: state.group_members.filter(group_member => group_member.member_index !== action.index),
        members: state.members.filter(member => member.index !== action.index),
      }
    case DELETE_GROUP:
      return {
        ...state,
        c1: state.c1.filter(c => c.group_index !== action.index),
        c2: state.c2.filter(c => c.group_index !== action.index),
        group_members: state.group_members.filter(group_member => group_member.group_index !== action.index),
        groups: state.groups.filter(group => group.index !== action.index),
      }
    case DELETE_KINMU: {
      const deleted_c0_sequence_ids = Array.from(new Set(state.c0_kinmus.filter(c0_kinmu => c0_kinmu.kinmu_index === action.index).map(({ sequence_id }) => sequence_id)))
      const deleted_roster_ids = Array.from(new Set(state.assignments.filter(assignment => assignment.kinmu_index === action.index).map(assignment => assignment.roster_id)))
      return {
        ...state,
        assignments: state.assignments.filter(assignment => !deleted_roster_ids.includes(assignment.roster_id)),
        c0: state.c0.filter(c => !deleted_c0_sequence_ids.includes(c.sequence_id)),
        c0_kinmus: state.c0_kinmus.filter(c0_kinmu => c0_kinmu.kinmu_index !== action.index),
        c1: state.c1.filter(c => c.kinmu_index !== action.index),
        c10: state.c10.filter(c => c.kinmu_index !== action.index),
        c2: state.c2.filter(c => c.kinmu_index !== action.index),
        c3: state.c3.filter(c => c.kinmu_index !== action.index),
        c4: state.c4.filter(c => c.kinmu_index !== action.index),
        c5: state.c5.filter(c => c.kinmu_index !== action.index),
        c6: state.c6.filter(c => c.kinmu_index !== action.index),
        c7: state.c7.filter(c => c.kinmu_index !== action.index),
        c8: state.c8.filter(c => c.kinmu_index !== action.index),
        c9: state.c9.filter(c => c.kinmu_index !== action.index),
        kinmus: state.kinmus.filter(kinmu => kinmu.index !== action.index),
      }
    }
    case DELETE_C0:
      return {
        ...state,
        c0: state.c0.filter(c => c.sequence_id !== action.sequence_id),
        c0_kinmus: state.c0_kinmus.filter(c0_kinmu => c0_kinmu.sequence_id !== action.sequence_id)
      }
  }
  return state
}

export const reducer = reduceReducer(combinedReducer, crossSliceReducer)
