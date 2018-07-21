import reduceReducer from 'reduce-reducers'
import { combineReducers } from 'redux'
import * as assignments from './assignments'
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
import * as renzoku_kinshi_kinmus from './renzoku_kinshi_kinmus'
import * as terms from './terms'

const REPLACE_ALL = "REPLACE_ALL"
const CREATE_MEMBER = 'CREATE_MEMBER'
const CREATE_GROUP = 'CREATE_GROUP'
const DELETE_MEMBER = 'DELETE_MEMBER'
const DELETE_GROUP = 'DELETE_GROUP'
const DELETE_KINMU = 'DELETE_KINMU'

export type All = {
  members: members.Member[]
  terms: terms.Term[]
  kinmus: kinmus.Kinmu[]
  groups: groups.Group[]
  group_members: group_members.GroupMember[]
  renzoku_kinshi_kinmus: renzoku_kinshi_kinmus.RenzokuKinshiKinmu[]
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

type Action =
  | ReplaceAll
  | CreateMember
  | CreateGroup
  | DeleteMember
  | DeleteGroup
  | DeleteKinmu

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

export type State = All

const combinedReducer: (state: State, action: Action) => State = combineReducers({
  assignments: assignments.reducer,
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
  renzoku_kinshi_kinmus: renzoku_kinshi_kinmus.reducer,
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
    case DELETE_KINMU:
      return {
        ...state,
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
        renzoku_kinshi_kinmus: state.renzoku_kinshi_kinmus.filter(renzoku_kinshi_kinmu => renzoku_kinshi_kinmu.kinmu_index !== action.index),
      }
  }
  return state
}

export const reducer = reduceReducer(combinedReducer, crossSliceReducer)
