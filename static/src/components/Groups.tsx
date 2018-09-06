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
import { WithStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
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
import Group from './Group'

type Props = {
  dispatch: Dispatch
  groups: groups.Group[]
  members: members.Member[]
  group_members: group_members.GroupMember[]
} & WithStyles<typeof styles>

type State = {
  creationDialogIsOpen: boolean
  newGroupIsEnabled: boolean
  newGroupName: string
  newGroupMemberIndices: number[]
}

type ErrorMessages = {
  newGroupName: string[]
}

class Groups extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    newGroupIsEnabled: true,
    newGroupMemberIndices: [],
    newGroupName: '',
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewGroupIsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newGroupIsEnabled: checked })
  }
  public validate(newGroupName: string): ErrorMessages {
    const errorMessages: ErrorMessages = {
      newGroupName: [],
    }
    if (newGroupName === '') { errorMessages.newGroupName.push('グループ名を入力してください') }
    return errorMessages
  }
  public handleChangeNewGroupName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newGroupName: event.target.value })
  }
  public handleChangeNewGroupMember(memberId: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        this.setState({ newGroupMemberIndices: this.state.newGroupMemberIndices.concat(memberId) })
        return
      }
      this.setState({ newGroupMemberIndices: this.state.newGroupMemberIndices.filter(member_id => member_id !== memberId) })
    }
  }
  public handleClickCreateGroup = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(all.createGroup(this.state.newGroupIsEnabled, this.state.newGroupName, this.state.newGroupMemberIndices))
  }
  public render() {
    const errorMessages = this.validate(this.state.newGroupName)
    return (
      <>
        <div className={this.props.classes.gridFrame}>
          <Grid container={true} spacing={8}>
            <Grid item={true} xs={12}>
              <Toolbar>
                <Typography variant="subheading" className={this.props.classes.toolbarTitle}>グループ</Typography>
                <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
              </Toolbar>
            </Grid>
            {this.props.groups.map(group => (
              <Grid key={group.id} item={true} xs={12}>
                <Group group={group} />
              </Grid>
            ))}
          </Grid>
        </div>
        <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>グループの追加</DialogTitle>
          <DialogContent>
            <Grid container={true} spacing={8}>
              <Grid item={true} xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.newGroupIsEnabled}
                      onChange={this.handleChangeNewGroupIsEnabled}
                      color="primary"
                    />
                  }
                  label="有効"
                />
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label="グループ名"
                  defaultValue={this.state.newGroupName}
                  onChange={this.handleChangeNewGroupName}
                  fullWidth={true}
                  error={errorMessages.newGroupName.length > 0}
                  FormHelperTextProps={{
                    component: 'div',
                  }}
                  helperText={errorMessages.newGroupName.map(message =>
                    <div key={message}>{message}</div>
                  )}
                />
              </Grid>
              <Grid item={true} xs={12}>
                <FormControl fullWidth={true}>
                  <FormLabel>グループに所属する職員</FormLabel>
                  <FormGroup>
                    {this.props.members.map(member => (
                      <FormControlLabel
                        key={member.id}
                        label={member.name}
                        control={
                          <Checkbox
                            checked={this.state.newGroupMemberIndices.some(member_id => member_id === member.id)}
                            onChange={this.handleChangeNewGroupMember(member.id)}
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
            <Button
              color="primary"
              disabled={Object.values(errorMessages).some(messages => messages.length > 0)}
              onClick={this.handleClickCreateGroup}
            >追加</Button>
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

const styles = createStyles({
  gridFrame: {
    padding: 8,
  },
  toolbarTitle: {
    flex: 1,
  },
})

export default withStyles(styles)(connect(mapStateToProps)(Groups))
