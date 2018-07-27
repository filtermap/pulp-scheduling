import AppBar from '@material-ui/core/AppBar'
import Button from '@material-ui/core/Button'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Grid from '@material-ui/core/Grid'
import Hidden from '@material-ui/core/Hidden'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import { createStyles, withStyles, WithStyles, withTheme, WithTheme } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link, Route, RouteComponentProps, withRouter } from 'react-router-dom'
import { Dispatch } from 'redux'
import { ActionCreators, StateWithHistory } from 'redux-undo'
import * as all from '../modules/all'
import * as utils from '../utils'
import C0 from './C0'
import C1 from './C1'
import C10 from './C10'
import C2 from './C2'
import C3 from './C3'
import C4 from './C4'
import C5 from './C5'
import C6 from './C6'
import C7 from './C7'
import C8 from './C8'
import C9 from './C9'
import Groups from './Groups'
import Kinmus from './Kinmus'
import Members from './Members'
import Rosters from './Rosters'
import Terms from './Terms'

const drawerWidth = 240

const styles = (theme: Theme) => createStyles({
  appBar: {
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    position: 'fixed',
  },
  content: {
    [theme.breakpoints.up('md')]: {
      maxWidth: `calc(100% - ${drawerWidth}px)`,
    },
    flex: 1,
    maxWidth: '100%',
  },
  drawerDocked: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  root: {
    display: 'flex',
  },
  title: {
    flex: 1,
  },
  toolbar: theme.mixins.toolbar,
})

type Props = {
  dispatch: Dispatch
  pastExists: boolean
  all: all.All
  futureExists: boolean
} & WithTheme & WithStyles<typeof styles> & RouteComponentProps<{}>

type State = {
  mobileOpen: boolean,
}

function RostersLink(props: any) {
  return <Link to="/rosters" {...props} />
}

function TermsLink(props: any) {
  return <Link to="/terms" {...props} />
}

function MembersLink(props: any) {
  return <Link to="/members" {...props} />
}

function KinmusLink(props: any) {
  return <Link to="/kinmus" {...props} />
}

function GroupsLink(props: any) {
  return <Link to="/groups" {...props} />
}

function C0Link(props: any) {
  return <Link to="/c0" {...props} />
}

function C1Link(props: any) {
  return <Link to="/c1" {...props} />
}

function C2Link(props: any) {
  return <Link to="/c2" {...props} />
}

function C3Link(props: any) {
  return <Link to="/c3" {...props} />
}

function C4Link(props: any) {
  return <Link to="/c4" {...props} />
}

function C5Link(props: any) {
  return <Link to="/c5" {...props} />
}

function C6Link(props: any) {
  return <Link to="/c6" {...props} />
}

function C7Link(props: any) {
  return <Link to="/c7" {...props} />
}

function C8Link(props: any) {
  return <Link to="/c8" {...props} />
}

function C9Link(props: any) {
  return <Link to="/c9" {...props} />
}

function C10Link(props: any) {
  return <Link to="/c10" {...props} />
}

class ResponsiveDrawer extends React.Component<Props, State> {
  public state: State = {
    mobileOpen: false,
  }
  public handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }))
  }
  public handleClickUndo = () => {
    this.props.dispatch(ActionCreators.undo())
  }
  public handleClickRedo = () => {
    this.props.dispatch(ActionCreators.redo())
  }
  public writeAll = () => {
    utils.sendJSONRPCRequest('write_all', [this.props.all])
  }
  public render() {
    const { classes, theme } = this.props
    const drawer = (
      <>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <ListItem button={true} component={RostersLink}>
            <ListItemText primary="勤務表" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button={true} component={TermsLink}>
            <ListItemText primary="期間" />
          </ListItem>
          <ListItem button={true} component={MembersLink}>
            <ListItemText primary="職員" />
          </ListItem>
          <ListItem button={true} component={KinmusLink}>
            <ListItemText primary="勤務" />
          </ListItem>
          <ListItem button={true} component={GroupsLink}>
            <ListItemText primary="グループ" />
          </ListItem>
        </List>
        <Divider />
        <List>
          <ListItem button={true} component={C0Link}>
            <ListItemText primary="連続禁止勤務並び" />
          </ListItem>
          <ListItem button={true} component={C1Link}>
            <ListItemText primary="期間の勤務にグループから割り当てる職員数の下限" />
          </ListItem>
          <ListItem button={true} component={C2Link}>
            <ListItemText primary="期間の勤務にグループから割り当てる職員数の上限" />
          </ListItem>
          <ListItem button={true} component={C3Link}>
            <ListItemText primary="職員の勤務の割り当て数の下限" />
          </ListItem>
          <ListItem button={true} component={C4Link}>
            <ListItemText primary="職員の勤務の割り当て数の上限" />
          </ListItem>
          <ListItem button={true} component={C5Link}>
            <ListItemText primary="勤務の連続日数の下限" />
          </ListItem>
          <ListItem button={true} component={C6Link}>
            <ListItemText primary="勤務の連続日数の上限" />
          </ListItem>
          <ListItem button={true} component={C7Link}>
            <ListItemText primary="勤務の間隔日数の下限" />
          </ListItem>
          <ListItem button={true} component={C8Link}>
            <ListItemText primary="勤務の間隔日数の上限" />
          </ListItem>
          <ListItem button={true} component={C9Link}>
            <ListItemText primary="職員の期間に割り当てる勤務" />
          </ListItem>
          <ListItem button={true} component={C10Link}>
            <ListItemText primary="職員の期間に割り当てない勤務" />
          </ListItem>
        </List>
      </>
    )
    return (
      <div className={classes.root}>
        <AppBar className={classes.appBar} position="sticky">
          <Toolbar>
            <IconButton
              color="inherit"
              aria-label="open drawer"
              onClick={this.handleDrawerToggle}
              className={classes.navIconHide}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="title" color="inherit" noWrap={true} className={classes.title}>データ</Typography>
            <Button color="inherit" onClick={this.handleClickUndo} disabled={!this.props.pastExists}>元に戻す</Button>
            <Button color="inherit" onClick={this.handleClickRedo} disabled={!this.props.futureExists}>やり直す</Button>
            <Button color="inherit" onClick={this.writeAll}>保存</Button>
          </Toolbar>
        </AppBar>
        <Hidden mdUp={true}>
          <Drawer
            variant="temporary"
            anchor={theme.direction === 'rtl' ? 'right' : 'left'}
            open={this.state.mobileOpen}
            onClose={this.handleDrawerToggle}
            classes={{
              paper: classes.drawerPaper,
            }}
            ModalProps={{
              keepMounted: true, // Better open performance on mobile.
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <Hidden smDown={true} implementation="css">
          <Drawer
            variant="permanent"
            open={true}
            classes={{
              docked: classes.drawerDocked,
              paper: classes.drawerPaper,
            }}
          >
            {drawer}
          </Drawer>
        </Hidden>
        <main className={classes.content}>
          <div className={classes.toolbar} />
          <div style={{ padding: 16 }}>
            <Grid container={true} spacing={32}>
              <Grid item={true} xs={12}>
                <Route path="/rosters" component={Rosters} />
                <Route path="/terms" component={Terms} />
                <Route path="/members" component={Members} />
                <Route path="/kinmus" component={Kinmus} />
                <Route path="/groups" component={Groups} />
                <Route path="/c0" component={C0} />
                <Route path="/c1" component={C1} />
                <Route path="/c2" component={C2} />
                <Route path="/c3" component={C3} />
                <Route path="/c4" component={C4} />
                <Route path="/c5" component={C5} />
                <Route path="/c6" component={C6} />
                <Route path="/c7" component={C7} />
                <Route path="/c8" component={C8} />
                <Route path="/c9" component={C9} />
                <Route path="/c10" component={C10} />
              </Grid>
            </Grid>
          </div>
        </main>
      </div>
    )
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    all: state.present,
    futureExists: state.future.length > 0,
    pastExists: state.past.length > 0,
  }
}

export default withTheme()(withStyles(styles)(withRouter(connect(mapStateToProps)(ResponsiveDrawer))))
