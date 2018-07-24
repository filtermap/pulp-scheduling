import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import ExpansionPanel from '@material-ui/core/ExpansionPanel'
import ExpansionPanelActions from '@material-ui/core/ExpansionPanelActions'
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails/ExpansionPanelDetails'
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary'
import MenuItem from '@material-ui/core/MenuItem'
import TextField from '@material-ui/core/TextField'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import { StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as c7 from '../modules/c7'
import * as kinmus from '../modules/kinmus'

type State = {
  open: boolean
  kinmu_index: number
  min_number_of_days: number
}

type Props = {
  dispatch: Dispatch
  c7: c7.C7[]
  kinmus: kinmus.Kinmu[]
}

class C7 extends React.Component<Props, State> {
  public state: State = {
    kinmu_index: this.props.kinmus.length > 0 ? this.props.kinmus[0].index : 0,
    min_number_of_days: 0,
    open: false,
  }
  public handleChangeC7KinmuIndex(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c7.updateC7KinmuIndex(index, parseInt(event.target.value, 10)))
    }
  }
  public handleChangeC7MinNumberOfDays(index: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(c7.updateC7MinNumberOfDays(index, parseInt(event.target.value, 10)))
    }
  }
  public handleClickDeleteC7(index: number) {
    return (_: React.MouseEvent<HTMLButtonElement>) => {
      this.props.dispatch(c7.deleteC7(index))
    }
  }
  public handleClickOpenDialog = () => {
    this.setState({ open: true })
  }
  public handleCloseDialog = () => {
    this.setState({ open: false })
  }
  public handleChangeNewC7KinmuIndex = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ kinmu_index: parseInt(event.target.value, 10) })
  }
  public handleChangeNewC7MinNumberOfDays = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.setState({ min_number_of_days: parseInt(event.target.value, 10) })
  }
  public handleClickCreateC7 = () => {
    this.setState({ open: false })
    this.props.dispatch(c7.createC7(this.state.kinmu_index, this.state.min_number_of_days))
  }
  public render() {
    return (
      <>
        <Toolbar>
          <Typography variant="subheading" style={{ flex: 1 }}>勤務の間隔日数の下限</Typography>
          <Button size="small" onClick={this.handleClickOpenDialog}>追加</Button>
        </Toolbar>
        {this.props.c7.map(c => (
          <ExpansionPanel key={c.index}>
            <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
              <Typography>{`${this.props.kinmus.find(kinmu => kinmu.index === c.kinmu_index)!.name}の間隔日数を${c.min_number_of_days}日以上にする`}</Typography>
            </ExpansionPanelSummary>
            <ExpansionPanelDetails>
              <TextField
                select={true}
                label="勤務"
                value={c.kinmu_index}
                onChange={this.handleChangeC7KinmuIndex(c.index)}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="間隔日数下限"
                type="number"
                defaultValue={c.min_number_of_days}
                onChange={this.handleChangeC7MinNumberOfDays(c.index)}
                fullWidth={true}
              />
            </ExpansionPanelDetails>
            <ExpansionPanelActions>
              <Button size="small" onClick={this.handleClickDeleteC7(c.index)}>削除</Button>
            </ExpansionPanelActions>
          </ExpansionPanel>
        ))}
        {this.props.kinmus.length === 0 ?
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の間隔日数の下限を追加できません</DialogTitle>
            <DialogContent>
              {this.props.kinmus.length === 0 ? <DialogContentText>勤務がありません</DialogContentText> : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
            </DialogActions>
          </Dialog> :
          <Dialog onClose={this.handleCloseDialog} open={this.state.open} fullWidth={true} maxWidth="md">
            <DialogTitle>勤務の間隔日数の下限の追加</DialogTitle>
            <DialogContent style={{ display: 'flex' }}>
              <TextField
                select={true}
                label="勤務"
                value={this.state.kinmu_index}
                onChange={this.handleChangeNewC7KinmuIndex}
                fullWidth={true}
              >
                {this.props.kinmus.map(kinmu => (
                  <MenuItem key={kinmu.index} value={kinmu.index}>{kinmu.name}</MenuItem>
                ))}
              </TextField>
              <TextField
                label="間隔日数下限"
                type="number"
                defaultValue={this.state.min_number_of_days}
                onChange={this.handleChangeNewC7MinNumberOfDays}
                fullWidth={true}
              />
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleClickCreateC7}>追加</Button>
              <Button color="primary" onClick={this.handleCloseDialog}>閉じる</Button>
            </DialogActions>
          </Dialog>}
      </>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    c7: state.present.c7,
    kinmus: state.present.kinmus
  }
}

export default connect(mapStateToProps)(C7)
