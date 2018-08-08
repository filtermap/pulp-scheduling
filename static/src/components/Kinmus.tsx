import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import FormControlLabel from '@material-ui/core/FormControlLabel'
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
import * as kinmus from '../modules/kinmus'
import Kinmu from './Kinmu'

type Props = {
  dispatch: Dispatch
  kinmus: kinmus.Kinmu[]
} & WithStyles<typeof styles>

type State = {
  creationDialogIsOpen: boolean
  newKinmuIsEnabled: boolean
  newKinmuName: string
}

class Kinmus extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    newKinmuIsEnabled: true,
    newKinmuName: '',
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true })
  }
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false })
  }
  public handleChangeNewKinmuIsEnabled = (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
    this.setState({ newKinmuIsEnabled: checked })
  }
  public handleChangeNewKinmuName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ newKinmuName: event.target.value })
  }
  public handleClickCreateKinmu = () => {
    this.setState({ creationDialogIsOpen: false })
    this.props.dispatch(kinmus.createKinmu(this.state.newKinmuIsEnabled, this.state.newKinmuName))
  }
  public render() {
    return (
      <>
        <div className={this.props.classes.gridFrame}>
          <Grid container={true} spacing={8}>
            <Grid item={true} xs={12}>
              <Toolbar>
                <Typography variant="subheading" className={this.props.classes.toolbarTitle}>勤務</Typography>
                <Button size="small" onClick={this.handleClickOpenCreationDialog}>追加</Button>
              </Toolbar>
            </Grid>
            {this.props.kinmus.map(kinmu => (
              <Grid key={kinmu.id} item={true} xs={12}>
                <Kinmu kinmu={kinmu} />
              </Grid>
            ))}
          </Grid>
        </div>
        <Dialog onClose={this.handleCloseCreationDialog} open={this.state.creationDialogIsOpen} fullWidth={true} maxWidth="md">
          <DialogTitle>勤務の追加</DialogTitle>
          <DialogContent>
            <Grid container={true} spacing={8}>
              <Grid item={true} xs={12}>
                <FormControlLabel
                  control={
                    <Switch
                      checked={this.state.newKinmuIsEnabled}
                      onChange={this.handleChangeNewKinmuIsEnabled}
                      color="primary"
                    />
                  }
                  label="有効"
                />
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label="勤務名"
                  defaultValue={this.state.newKinmuName}
                  onChange={this.handleChangeNewKinmuName}
                  fullWidth={true}
                />
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickCreateKinmu}>追加</Button>
            <Button color="primary" onClick={this.handleCloseCreationDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    kinmus: state.present.kinmus,
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

export default withStyles(styles)(connect(mapStateToProps)(Kinmus))
