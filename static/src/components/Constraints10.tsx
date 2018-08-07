import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
import Switch from '@material-ui/core/Switch'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as constraints10 from '../modules/constraints10'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'
import * as utils from '../utils'
import Constraint10 from './Constraint10'

type Props = {
  dispatch: Dispatch
  constraints10: constraints10.Constraint10[]
  members: members.Member[]
  kinmus: kinmus.Kinmu[]
}

type State = {
  creationDialogIsOpen: boolean
  newConstraint10IsEnabled: boolean
  newConstraint10MemberId: number
  newConstraint10StartDateName: string
  newConstraint10StopDateName: string
  newConstraint10KinmuId: number
}

class Constraints10 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const todayString = utils.dateToString(new Date())
    this.state = {
      creationDialogIsOpen: false,
      newConstraint10IsEnabled: true,
      newConstraint10KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newConstraint10MemberId: this.props.members.length > 0 ? this.props.members[0].id : 0,
      newConstraint10StartDateName: todayString,
      newConstraint10StopDateName: todayString,
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint10IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint10IsEnabled: checked })
  }
  public handleChangeNewConstraint10MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint10MemberId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint10StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint10StartDateName: event.target.value })
  }
  public handleChangeNewConstraint10StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint10StopDateName: event.target.value })
  }
  public handleChangeNewConstraint10KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint10KinmuId: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint10 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints10.createConstraint10(this.state.newConstraint10IsEnabled, this.state.newConstraint10MemberId, this.state.newConstraint10StartDateName, this.state.newConstraint10StopDateName, this.state.newConstraint10KinmuId))
  }
  public render() {
    return (
      <>
        <div style={{ padding: 8 }}>
          <Grid container={true} spacing={8}>
            <Grid item={true} xs={12}>
              <Toolbar>
                <Typography variant="subheading" style={{ flex: 1 }}>職員の期間に割り当てない勤務</Typography>
                <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
              </Toolbar>
            </Grid>
            {this.props.constraints10.map(c => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint10 constraint10={c} />
              </Grid>
            ))}
          </Grid>
        </div>
        {this.props.members.length === 0 && this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の期間に割り当てない勤務を追加できません</DialogTitle>
            <DialogContent>
              {this.props.members.length === 0 ? <DialogContentText>職員がいません</DialogContentText> : null}
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          (() => {
            const newConstraint10Member = this.props.members.find(({ id }) => id === this.state.newConstraint10MemberId)!
            const newConstraint10Kinmu = this.props.kinmus.find(({ id }) => id === this.state.newConstraint10KinmuId)!
            const relativesAreEnabled = newConstraint10Member.is_enabled && newConstraint10Kinmu.is_enabled
            return (
              <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
                <DialogTitle>職員の期間に割り当てない勤務の追加</DialogTitle>
                <DialogContent>
                  <Grid container={true} spacing={8}>
                    <Grid item={true} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={this.state.newConstraint10IsEnabled && relativesAreEnabled}
                            disabled={!relativesAreEnabled}
                            onChange={this.handleChangeNewConstraint10IsEnabled}
                            color="primary"
                          />
                        }
                        label="有効"
                      />
                    </Grid>
                    <Grid item={true} xs={12}>
                      <TextField
                        select={true}
                        label="職員"
                        value={this.state.newConstraint10MemberId}
                        onChange={this.handleChangeNewConstraint10MemberId}
                        fullWidth={true}
                      >
                        {this.props.members.map(member => (
                          <MenuItem key={member.id} value={member.id}>{member.name}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item={true} xs={12}>
                      <TextField
                        label="開始日"
                        type="date"
                        defaultValue={this.state.newConstraint10StartDateName}
                        onChange={this.handleChangeNewConstraint10StartDateName}
                        fullWidth={true}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item={true} xs={12}>
                      <TextField
                        label="終了日"
                        type="date"
                        defaultValue={this.state.newConstraint10StopDateName}
                        onChange={this.handleChangeNewConstraint10StopDateName}
                        fullWidth={true}
                        InputLabelProps={{
                          shrink: true,
                        }}
                      />
                    </Grid>
                    <Grid item={true} xs={12}>
                      <TextField
                        select={true}
                        label="勤務"
                        value={this.state.newConstraint10KinmuId}
                        onChange={this.handleChangeNewConstraint10KinmuId}
                        fullWidth={true}
                      >
                        {this.props.kinmus.map(kinmu => (
                          <MenuItem key={kinmu.id} value={kinmu.id}>{kinmu.name}</MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button color="primary" onClick={this.handleClickCreateConstraint10}>追加</Button>
                  <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
                </DialogActions>
              </Dialog>
            )
          })()}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints10: state.present.constraints10,
    kinmus: state.present.kinmus,
    members: state.present.members,
  }
}

export default connect(mapStateToProps)(Constraints10)
