import AppBar from '@material-ui/core/AppBar'
import Grid from '@material-ui/core/Grid'
import Paper from '@material-ui/core/Paper'
import Table from '@material-ui/core/Table'
import TableBody from '@material-ui/core/TableBody'
import TableCell from '@material-ui/core/TableCell'
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import * as allModule from '../modules/all'

type Props = allModule.State & {
  replace(state: allModule.State): void
}

export default function All(props: Props) {
  return (
    <React.Fragment>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="title" color="inherit">データ</Typography>
        </Toolbar>
      </AppBar>
      <div style={{ padding: 4 }}>
        <Grid container={true} spacing={8}>
          <Grid item={true} xs={12}>
            <Paper>
              <Toolbar>
                <Typography variant="subheading">期間</Typography>
              </Toolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>開始日</TableCell>
                    <TableCell>終了日</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.terms.map(term => (
                    <TableRow key={term.index}>
                      <TableCell>{term.start_date_name}</TableCell>
                      <TableCell>{term.stop_date_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item={true} xs={12}>
            <Paper>
              <Toolbar>
                <Typography variant="subheading">職員</Typography>
              </Toolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>職員名</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.members.map(member => (
                    <TableRow key={member.index}>
                      <TableCell>{member.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item={true} xs={12}>
            <Paper>
              <Toolbar>
                <Typography variant="subheading">勤務</Typography>
              </Toolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>勤務名</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.kinmus.map(kinmu => (
                    <TableRow key={kinmu.index}>
                      <TableCell>{kinmu.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item={true} xs={12}>
            <Paper>
              <Toolbar>
                <Typography variant="subheading">グループ</Typography>
              </Toolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>グループ名</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.groups.map(group => (
                    <TableRow key={group.index}>
                      <TableCell>{group.name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item={true} xs={12}>
            <Paper>
              <Toolbar>
                <Typography variant="subheading">グループに所属する職員</Typography>
              </Toolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>グループ名</TableCell>
                    <TableCell>職員名</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.group_members.map(group_member => (
                    <TableRow key={group_member.index}>
                      <TableCell>{group_member.group_name}</TableCell>
                      <TableCell>{group_member.member_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
          <Grid item={true} xs={12}>
            <Paper>
              <Toolbar>
                <Typography variant="subheading">連続禁止勤務並び</Typography>
              </Toolbar>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>並びID</TableCell>
                    <TableCell>並び順</TableCell>
                    <TableCell>勤務名</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {props.renzoku_kinshi_kinmus.map(renzoku_kinshi_kinmu => (
                    <TableRow key={renzoku_kinshi_kinmu.index}>
                      <TableCell>{renzoku_kinshi_kinmu.sequence_id}</TableCell>
                      <TableCell>{renzoku_kinshi_kinmu.sequence_number}</TableCell>
                      <TableCell>{renzoku_kinshi_kinmu.kinmu_name}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </Paper>
          </Grid>
        </Grid>
      </div>
    </React.Fragment>
  )
}
