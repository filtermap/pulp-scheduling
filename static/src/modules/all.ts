import reduceReducer from 'reduce-reducers'
import { combineReducers } from 'redux'
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

export const REPLACE_ALL = "REPLACE_ALL"

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
}

type Replace = {
  type: typeof REPLACE_ALL
  all: All
}

export type Action = Replace

export function replace(all: All): Replace {
  return {
    all,
    type: REPLACE_ALL
  }
}

export type State = All

const combinedReducer: (state: State, action: Action) => State = combineReducers({
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
  }
  return state
}

export const reducer = reduceReducer(combinedReducer, crossSliceReducer)
