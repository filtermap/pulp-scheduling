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

type Props = {
  dispatch: Dispatch
  term: terms.Term
} & WithStyles<typeof styles>

type State = {
  expanded: boolean
}

class Term extends React.Component<Props, State> {
  public state: State = {
    expanded: false,
  }
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded })
  }
  public handleChangeTermStartDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(terms.updateTermStartDateName(this.props.term.id, event.target.value))
  }
  public handleChangeTermStopDateName = (event: React.ChangeEvent<HTMLInputElement>) => {
    this.props.dispatch(terms.updateTermStopDateName(this.props.term.id, event.target.value))
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
