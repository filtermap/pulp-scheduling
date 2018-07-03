import AppBar from '@material-ui/core/AppBar'
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
import { Link, Route } from 'react-router-dom'
import GroupMembers from '../containers/GroupMembers'
import Groups from '../containers/Groups'
import Kinmus from '../containers/Kinmus'
import Members from '../containers/Members'
import RenzokuKinshiKinmus from '../containers/RenzokuKinshiKinmus'
import Terms from '../containers/Terms'

const drawerWidth = 240

const styles = (theme: Theme) => createStyles({
  appBar: {
    marginLeft: drawerWidth,
    [theme.breakpoints.up('md')]: {
      width: `calc(100% - ${drawerWidth}px)`,
    },
    position: 'absolute',
  },
  content: {
    backgroundColor: theme.palette.background.default,
    flexGrow: 1,
    padding: theme.spacing.unit * 3,
  },
  drawerPaper: {
    width: drawerWidth,
    [theme.breakpoints.up('md')]: {
      position: 'relative',
    },
  },
  navIconHide: {
    [theme.breakpoints.up('md')]: {
      display: 'none',
    },
  },
  root: {
    display: 'flex',
    flexGrow: 1,
    height: 430,
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
    zIndex: 1,
  },
  toolbar: theme.mixins.toolbar,
})

type Props = { theme: Theme } & WithStyles<typeof styles>

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

class ResponsiveDrawer extends React.Component<Props, State> {
  public state = {
    mobileOpen: false,
  }

  public handleDrawerToggle = () => {
    this.setState(state => ({ mobileOpen: !state.mobileOpen }))
  }

  public render() {
    const { classes, theme } = this.props
    const drawer = (
      <div>
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
        </List>
      </div>
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
            <Typography variant="title" color="inherit" noWrap={true}>データ</Typography>
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
              </Grid>
            </Grid>
          </div>
        </main>
      </div>
    )
  }
}

export default withTheme()(withStyles(styles)(ResponsiveDrawer))
