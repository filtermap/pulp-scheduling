import Grid from '@material-ui/core/Grid'
import * as React from 'react'
import * as allModule from '../modules/all'
import GroupMembers from './GroupMembers'
import Groups from './Groups'
import Kinmus from './Kinmus'
import Members from './Members'
import RenzokuKinshiKinmus from './RenzokuKinshiKinmus'
import Terms from './Terms'

type Props = allModule.State & {
  replace(state: allModule.State): void
}

export default function All(props: Props) {
  return (
    <div style={{ padding: 4 }}>
      <Grid container={true} spacing={8}>
        <Grid item={true} xs={12}>
          <Terms terms={props.terms} />
        </Grid>
        <Grid item={true} xs={12}>
          <Members members={props.members} />
        </Grid>
        <Grid item={true} xs={12}>
          <Kinmus kinmus={props.kinmus} />
        </Grid>
        <Grid item={true} xs={12}>
          <Groups groups={props.groups} />
        </Grid>
        <Grid item={true} xs={12}>
          <GroupMembers group_members={props.group_members} />
        </Grid>
        <Grid item={true} xs={12}>
          <RenzokuKinshiKinmus renzoku_kinshi_kinmus={props.renzoku_kinshi_kinmus} />
        </Grid>
      </Grid>
    </div>
  )
}
