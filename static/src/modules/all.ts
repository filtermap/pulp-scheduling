const REPLACE_ALL = "REPLACE_ALL"

type Member = {
  index: number
  name: string
}

type Date = {
  index: number
  name: string
}

type Kinmu = {
  index: number
  name: string
}

type Group = {
  index: number
  name: string
}

type GroupMember = {
  index: number
  group_index: number
  member_index: number
}

type RenzokuKinshiKinmu = {
  index: number
  sequence_id: number
  sequence_number: number
  kinmu_index: number
}

type C1 = {
  index: number
  date_index: number
  kinmu_index: number
  group_index: number
  min_number_of_assignments: number
}

type C2 = {
  index: number
  date_index: number
  kinmu_index: number
  group_index: number
  max_number_of_assignments: number
}

type C3 = {
  index: number
  member_index: number
  kinmu_index: number
  min_number_of_assignments: number
}

type C4 = {
  index: number
  member_index: number
  kinmu_index: number
  max_number_of_assignments: number
}

type C5 = {
  index: number
  kinmu_index: number
  min_number_of_days: number
}

type C6 = {
  index: number
  kinmu_index: number
  max_number_of_days: number
}

type C7 = {
  index: number
  kinmu_index: number
  min_number_of_days: number
}

type C8 = {
  index: number
  kinmu_index: number
  max_number_of_days: number
}

type C9 = {
  index: number
  member_index: number
  date_index: number
  kinmu_index: number
}

type C10 = {
  index: number
  member_index: number
  date_index: number
  kinmu_index: number
}

type All = {
  members: Member[]
  dates: Date[]
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
  dates: [],
  group_members: [],
  groups: [],
  kinmus: [],
  members: [],
  renzoku_kinshi_kinmus: [],
}

export function reducer(state: State = initialState, action: Action): State {
  switch (action.type) {
    case REPLACE_ALL:
      return { ...state, ...action.all }
  }
  return state
}
