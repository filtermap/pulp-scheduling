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
import { createStyles, withStyles, WithStyles, withTheme } from '@material-ui/core/styles'
import { Theme } from '@material-ui/core/styles/createMuiTheme'
import Toolbar from '@material-ui/core/Toolbar'
import Typography from '@material-ui/core/Typography'
import MenuIcon from '@material-ui/icons/Menu'
import * as React from 'react'
import { connect } from 'react-redux'
import { Link, Route, RouteComponentProps, withRouter } from 'react-router-dom'
import * as all from '../modules/all'
import * as utils from '../utils'
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
import GroupMembers from './GroupMembers'
import Groups from './Groups'
import Kinmus from './Kinmus'
import Members from './Members'
import RenzokuKinshiKinmus from './RenzokuKinshiKinmus'
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
    flex: 1,
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

type Props = { all: all.All, theme: Theme } & WithStyles<typeof styles> & RouteComponentProps<{}>

type State = {
  mobileOpen: boolean,
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

function GroupMembersLink(props: any) {
  return <Link to="/group-members" {...props} />
}

function RenzokuKinshiKinmusLink(props: any) {
  return <Link to="/renzoku-kinshi-kinmus" {...props} />
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
  public state = {
    mobileOpen: false,
  }

  public handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }))
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
          <ListItem button={true} component={GroupMembersLink}>
            <ListItemText primary="グループに所属する職員" />
          </ListItem>
          <Divider />
          <ListItem button={true} component={RenzokuKinshiKinmusLink}>
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
            <ListItemText primary="職員の日付に割り当てる勤務" />
          </ListItem>
          <ListItem button={true} component={C10Link}>
            <ListItemText primary="職員の日付に割り当てない勤務" />
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
          <div style={{ padding: 4 }}>
            <Grid container={true} spacing={8}>
              <Grid item={true} xs={12}>
                <Route path="/terms" component={Terms} />
                <Route path="/members" component={Members} />
                <Route path="/kinmus" component={Kinmus} />
                <Route path="/groups" component={Groups} />
                <Route path="/group-members" component={GroupMembers} />
                <Route path="/renzoku-kinshi-kinmus" component={RenzokuKinshiKinmus} />
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

function mapStateToProps(state: all.State) {
  return {
    all: state
  }
}

export default withTheme()(withStyles(styles)(withRouter(connect(mapStateToProps)(ResponsiveDrawer))))
