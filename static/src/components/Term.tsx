import Card from '@material-ui/core/Card'
import CardContent from '@material-ui/core/CardContent'
import CardHeader from '@material-ui/core/CardHeader'
import Collapse from '@material-ui/core/Collapse'
import Grid from '@material-ui/core/Grid'
import IconButton from '@material-ui/core/IconButton'
import { Theme, WithStyles } from '@material-ui/core/styles'
import createStyles from '@material-ui/core/styles/createStyles'
import withStyles from '@material-ui/core/styles/withStyles'
import TextField from '@material-ui/core/TextField'
import ExpandMoreIcon from '@material-ui/icons/ExpandMore'
import classnames from 'classnames'
import * as React from 'react'
import { connect } from 'react-redux'
import { Dispatch } from 'redux'
import * as terms from '../modules/terms'
import * as utils from '../utils'

type Props = {
  dispatch: Dispatch
  term: terms.Term
} & WithStyles<typeof styles>

type Dirty = {
  termStartDateName: string
  termStopDateName: string
}

type ErrorMessages = {
  termStartDateName: string[]
  termStopDateName: string[]
}

type State = {
  expanded: boolean
  dirty: Dirty
  errorMessages: ErrorMessages
}

class Term extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = {
      dirty: {
        termStartDateName: props.term.start_date_name,
        termStopDateName: props.term.stop_date_name,
      },
      errorMessages: {
        termStartDateName: [],
        termStopDateName: []
      },
      expanded: false,
    }
  }
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  public validate(dirty: Dirty): ErrorMessages {
    const errorMessages: ErrorMessages = {
      termStartDateName: [],
      termStopDateName: [],
    }
    if (!utils.stringToDate(dirty.termStartDateName)) { errorMessages.termStartDateName.push('開始日の形式が正しくありません') }
    if (!utils.stringToDate(dirty.termStopDateName)) { errorMessages.termStopDateName.push('終了日の形式が正しくありません') }
    return errorMessages
  }
  public handleChangeTermStartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const termStartDateName = event.target.value
    const dirty = { ...this.state.dirty, termStartDateName }
    const errorMessages = this.validate(dirty)
    this.setState({ dirty, errorMessages })
    if (errorMessages.termStartDateName.length > 0) { return }
    this.props.dispatch(terms.updateTermStartDateName(this.props.term.id, termStartDateName))
  }
  public handleChangeTermStopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    const termStopDateName = event.target.value
    const dirty = { ...this.state.dirty, termStopDateName }
    const errorMessages = this.validate(dirty)
    this.setState({ dirty, errorMessages })
    if (errorMessages.termStopDateName.length > 0) { return }
    this.props.dispatch(terms.updateTermStopDateName(this.props.term.id, termStopDateName))
  }
  public render() {
    return (
      <Card>
        <CardHeader
          action={
            <IconButton
              className={classnames(this.props.classes.expand, {
                [this.props.classes.expandOpen]: this.state.expanded,
              })}
              onClick={this.handleClickExpand}
              aria-expanded={this.state.expanded}
            >
              <ExpandMoreIcon />
            </IconButton>
          }
          title={`${this.props.term.start_date_name}から${this.props.term.stop_date_name}まで`}
        />
        <Collapse in={this.state.expanded} timeout="auto" unmountOnExit={true}>
          <CardContent>
            <Grid container={true} spacing={8}>
              <Grid item={true} xs={12}>
                <TextField
                  label="開始日"
                  type="date"
                  defaultValue={this.props.term.start_date_name}
                  onChange={this.handleChangeTermStartDateName}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={this.state.errorMessages.termStartDateName.length > 0}
                  FormHelperTextProps={{
                    component: 'div',
                  }}
                  helperText={this.state.errorMessages.termStartDateName.map(message =>
                    <div key={message}>{message}</div>
                  )}
                />
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label="終了日"
                  type="date"
                  defaultValue={this.props.term.stop_date_name}
                  onChange={this.handleChangeTermStopDateName}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={this.state.errorMessages.termStopDateName.length > 0}
                  FormHelperTextProps={{
                    component: 'div',
                  }}
                  helperText={this.state.errorMessages.termStopDateName.map(message =>
                    <div key={message}>{message}</div>
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
        </Collapse>
      </Card>
    )
  }
}

const styles = (theme: Theme) => createStyles({
  expand: {
    transform: 'rotate(0deg)',
    transition: theme.transitions.create('transform', {
      duration: theme.transitions.duration.shortest,
    }),
  },
  expandOpen: {
    transform: 'rotate(180deg)',
  },
})

export default withStyles(styles)(connect()(Term))
