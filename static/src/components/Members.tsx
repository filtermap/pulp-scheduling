import Button from '@material-ui/core/Button'
import Checkbox from '@material-ui/core/Checkbox'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControl from '@material-ui/core/FormControl'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import FormGroup from '@material-ui/core/FormGroup'
import FormLabel from '@material-ui/core/FormLabel'
import Grid from '@material-ui/core/Grid'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as group_members from '../modules/group_members'
import * as groups from '../modules/groups'
import * as members from '../modules/members'
import Member from './Member'

type Props = {
  dispatch: Dispatch
  members: members.Member[]
  groups: groups.Group[]
  group_members: group_members.GroupMember[]
}

type State = {
  creationDialogIsOpen: boolean
  newMemberIsEnabled: boolean
  newMemberName: string
  newMemberGroupIndices: number[]
}

class Members extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    newMemberGroupIndices: [],
    newMemberIsEnabled: true,
    newMemberName: '',
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewMemberIsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newMemberIsEnabled: checked })
  }
  public handleChangeNewMemberName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newMemberName: event.target.value })
  }
  public handleChangeNewGroupMember(groupId: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        this.setState({ newMemberGroupIndices: this.state.newMemberGroupIndices.concat(groupId) })
        return
      }
      this.setState({ newMemberGroupIndices: this.state.newMemberGroupIndices.filter(group_id => group_id !== groupId) })
    }
  }
  public handleClickCreateMember = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(all.createMember(this.state.newMemberIsEnabled, this.state.newMemberName, this.state.newMemberGroupIndices))
  }
  public render() {
    return (
      <>
        <div style={{ padding: 8 }}>
          <Grid container={true} spacing={8}>
            <Grid item={true} xs={12}>
              <Toolbar>
                <Typography variant="subheading" style={{ flex: 1 }}>職員</Typography>
                <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
              </Toolbar>
            </Grid>
            {this.props.members.map(member => (
              <Grid key={member.id} item={true} xs={12}>
                <Member member={member} />
              </Grid>
            ))}
          </Grid>
        </div>
        <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>職員の追加</DialogTitle>
          <DialogContent>
            <Grid container={true} spacing={8}>
              <Grid item={true} xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.newMemberIsEnabled}
                      onChange={this.handleChangeNewMemberIsEnabled}
                      color="primary"
                    />
                  }
                  label="有効"
                />
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label="職員名"
                  defaultValue={this.state.newMemberName}
                  onChange={this.handleChangeNewMemberName}
                  fullWidth={true}
                />
              </Grid>
              <Grid item={true} xs={12}>
                <FormControl fullWidth={true}>
                  <FormLabel>職員が所属するグループ</FormLabel>
                  <FormGroup>
                    {this.props.groups.map(group => (
                      <FormControlLabel
                        key={group.id}
                        label={group.name}
                        control={
                          <Checkbox
                            checked={this.state.newMemberGroupIndices.some(group_id => group_id === group.id)}
                            onChange={this.handleChangeNewGroupMember(group.id)}
                            color="primary"
                          />
                        }
                      />
                    ))}
                  </FormGroup>
                </FormControl>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickCreateMember}>追加</Button>
            <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    group_members: state.present.group_members,
    groups: state.present.groups,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(Members)
