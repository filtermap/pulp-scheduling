import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
import Grid from '@material-ui/core/Grid'
import MenuItem from '@material-ui/core/MenuItem'
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
import * as constraints9 from '../modules/constraints9'
import * as kinmus from '../modules/kinmus'
import * as members from '../modules/members'
import * as terms from '../modules/terms'
import * as utils from '../utils'
import Constraint9 from './Constraint9'

type Props = {
  dispatch: Dispatch
  constraints9: constraints9.Constraint9[]
  members: members.Member[]
  terms: terms.Term[]
  kinmus: kinmus.Kinmu[]
} & WithStyles<typeof styles>

type State = {
  creationDialogIsOpen: boolean
  newConstraint9IsEnabled: boolean
  newConstraint9MemberId: number
  newConstraint9StartDateName: string
  newConstraint9StopDateName: string
  newConstraint9KinmuId: number
}

class Constraints9 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    const todayString = utils.dateToString(new Date())
    this.state = {
      creationDialogIsOpen: false,
      newConstraint9IsEnabled: true,
      newConstraint9KinmuId: this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newConstraint9MemberId: this.props.members.length > 0 ? this.props.members[0].id : 0,
      newConstraint9StartDateName: todayString,
      newConstraint9StopDateName: todayString,
    }
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewConstraint9IsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newConstraint9IsEnabled: checked })
  }
  public handleChangeNewConstraint9MemberId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint9MemberId: parseInt(event.target.value, 10) })
  }
  public handleChangeNewConstraint9StartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint9StartDateName: event.target.value })
  }
  public handleChangeNewConstraint9StopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint9StopDateName: event.target.value })
  }
  public handleChangeNewConstraint9KinmuId = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newConstraint9KinmuId: parseInt(event.target.value, 10) })
  }
  public handleClickCreateConstraint9 = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(constraints9.createConstraint9(this.state.newConstraint9IsEnabled, this.state.newConstraint9MemberId, this.state.newConstraint9StartDateName, this.state.newConstraint9StopDateName, this.state.newConstraint9KinmuId))
  }
  public render() {
    return (
      <>
        <div className={this.props.classes.gridFrame}>
          <Grid container={true} spacing={8}>
            <Grid item={true} xs={12}>
              <Toolbar>
                <Typography variant="subheading" className={this.props.classes.toolbarTitle}>職員の期間に割り当てる勤務</Typography>
                <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
              </Toolbar>
            </Grid>
            {this.props.constraints9.map(c => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint9 constraint9={c} />
              </Grid>
            ))}
          </Grid>
        </div>
        {this.props.members.length === 0 && this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
            <DialogTitle>職員の期間に割り当てる勤務を追加できません</DialogTitle>
            <DialogContent>
              {this.props.members.length === 0 ? <DialogContentText>職員がいません</DialogContentText> : null}
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          (() => {
            const newConstraint9Member = this.props.members.find(({ id }) => id === this.state.newConstraint9MemberId)!
            const newConstraint9StartDate = utils.stringToDate(this.state.newConstraint9StartDateName)
            const newConstraint9StopDate = utils.stringToDate(this.state.newConstraint9StopDateName)
            const newConstraint9TermIsIncluded = this.props.terms.every(({ start_date_name, stop_date_name }) => utils.stringToDate(start_date_name) <= newConstraint9StartDate && newConstraint9StopDate <= utils.stringToDate(stop_date_name))
            const newConstraint9Kinmu = this.props.kinmus.find(({ id }) => id === this.state.newConstraint9KinmuId)!
            const relativesAreEnabled = newConstraint9Member.is_enabled && newConstraint9TermIsIncluded && newConstraint9Kinmu.is_enabled
            return (
              <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
                <DialogTitle>職員の機関に割り当てる勤務の追加</DialogTitle>
                <DialogContent>
                  <Grid container={true} spacing={8}>
                    <Grid item={true} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={this.state.newConstraint9IsEnabled && relativesAreEnabled}
                            disabled={!relativesAreEnabled}
                            onChange={this.handleChangeNewConstraint9IsEnabled}
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
                        value={this.state.newConstraint9MemberId}
                        onChange={this.handleChangeNewConstraint9MemberId}
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
                        defaultValue={this.state.newConstraint9StartDateName}
                        onChange={this.handleChangeNewConstraint9StartDateName}
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
                        defaultValue={this.state.newConstraint9StopDateName}
                        onChange={this.handleChangeNewConstraint9StopDateName}
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
                        value={this.state.newConstraint9KinmuId}
                        onChange={this.handleChangeNewConstraint9KinmuId}
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
                  <Button color="primary" onClick={this.handleClickCreateConstraint9}>追加</Button>
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
    constraints9: state.present.constraints9,
    kinmus: state.present.kinmus,
    members: state.present.members,
    terms: state.present.terms,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraints9))
