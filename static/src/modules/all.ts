const REPLACE_ALL = "REPLACE_ALL"

export type Member = {
  index: number
  name: string
}

export type Term = {
  index: number
  start_date_name: string
  stop_date_name: string
}

export type Kinmu = {
  index: number
  name: string
}

export type Group = {
  index: number
  name: string
}

export type GroupMember = {
  index: number
  group_name: string
  member_name: string
}

export type RenzokuKinshiKinmu = {
  index: number
  sequence_id: number
  sequence_number: number
  kinmu_name: string
}

export type C1 = {
  index: number
  start_date_name: string
  stop_date_name: string
  kinmu_name: string
  group_name: string
  min_number_of_assignments: number
}

export type C2 = {
  index: number
  start_date_name: string
  stop_date_name: string
  kinmu_name: string
  group_name: string
  max_number_of_assignments: number
}

export type C3 = {
  index: number
  member_name: string
  kinmu_name: string
  min_number_of_assignments: number
}

export type C4 = {
  index: number
  member_name: string
  kinmu_name: string
  max_number_of_assignments: number
}

export type C5 = {
  index: number
  kinmu_name: string
  min_number_of_days: number
}

export type C6 = {
  index: number
  kinmu_name: string
  max_number_of_days: number
}

export type C7 = {
  index: number
  kinmu_name: string
  min_number_of_days: number
}

export type C8 = {
  index: number
  kinmu_name: string
  max_number_of_days: number
}

export type C9 = {
  index: number
  member_name: string
  date_name: string
  kinmu_name: string
}

export type C10 = {
  index: number
  member_name: string
  date_name: string
  kinmu_name: string
}

export type All = {
  members: Member[]
  terms: Term[]
  kinmus: Kinmu[]
  groups: Group[]
  group_members: GroupMember[]
  renzoku_kinshi_kinmus: RenzokuKinshiKinmu[]
  c1: C1[]
  c2: C2[]
  c3: C3[]
  c4: C4[]
  c5: C5[]
  c6: C6[]
  c7: C7[]
  c8: C8[]
  c9: C9[]
  c10: C10[]
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

const initialState: State = {
  c1: [],
  c10: [],
  c2: [],
  c3: [],
  c4: [],
  c5: [],
  c6: [],
  c7: [],
  c8: [],
  c9: [],
  group_members: [],
  groups: [],
  kinmus: [],
  members: [],
  renzoku_kinshi_kinmus: [],
  terms: []
}

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case REPLACE_ALL:
      return { ...state, ...action.all }
  }
  return state
}
