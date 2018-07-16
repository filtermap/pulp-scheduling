import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogTitle from '@material-ui/core/DialogTitle'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import * as all from '../modules/all'
import * as kinmus from '../modules/kinmus'

type Props = {
  dispatch: Dispatch
  kinmus: kinmus.Kinmu[]
}

type State = {
  open: boolean
  name: string
}

class Kinmus extends React.Component<Props, State> {
  public state: State = {
    name: '',
    open: false,
  }
  public handleChange(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(kinmus.updateKinmuName(index, event.target.value))
    }
  }
  public handleClickDeleteKinmu(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(all.deleteKinmu(index))
    }
  }
  public handleClickOpenDialog = () => {
    this.setState({ open: true })
  }
  public handleCloseDialog = () => {
    this.setState({ open: false })
  }
  public handleChangeNewKinmuName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ name: event.target.value })
  }
  public handleClickCreateKinmu = () => {
    this.setState({ open: false, name: '' })
    this.props.dispatch(kinmus.createKinmu(this.state.name))
  }
  public render() {
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務</Typography>
          <Button size="small" onClick={this.handleClickOpenDialog}>追加</Button>
        </Toolbar>
        {this.props.kinmus.map(kinmu => (
          <ExpansionPanel key={kinmu.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{kinmu.name}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                label="勤務名"
                defaultValue={kinmu.name}
                onChange={this.handleChange(kinmu.index)}
                margin="normal"
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickDeleteKinmu(kinmu.index)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
          <DialogTitle>勤務の追加</DialogTitle>
          <DialogContent style={{ display: 'flex' }}>
            <TextField
              label="勤務名"
              defaultValue={this.state.name}
              onChange={this.handleChangeNewKinmuName}
              fullWidth={true}
            />
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickCreateKinmu}>追加</Button>
            <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
          </DialogActions>
        </Dialog>
      </>
    )
  }
}

function mapStateToProps(state: all.State) {
  return {
    kinmus: state.kinmus
  }
}

export default connect(mapStateToProps)(Kinmus)
