import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import Divider from "@material-ui/core/Divider";
import Drawer from "@material-ui/core/Drawer";
import Hidden from "@material-ui/core/Hidden";
import IconButton from "@material-ui/core/IconButton";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import {
  createStyles,
  withStyles,
  WithStyles,
  withTheme,
  WithTheme,
} from "@material-ui/core/styles";
import { Theme } from "@material-ui/core/styles/createMuiTheme";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import MenuIcon from "@material-ui/icons/Menu";
import * as React from "react";
import { connect } from "react-redux";
import { Link, Route, RouteComponentProps, withRouter } from "react-router-dom";
import { Dispatch } from "redux";
import { ActionCreators, StateWithHistory } from "redux-undo";
import * as all from "../modules/all";
import * as utils from "../utils";
import Constraints0 from "./Constraints0";
import Constraints1 from "./Constraints1";
import Constraints10 from "./Constraints10";
import Constraints2 from "./Constraints2";
import Constraints3 from "./Constraints3";
import Constraints4 from "./Constraints4";
import Constraints5 from "./Constraints5";
import Constraints6 from "./Constraints6";
import Constraints7 from "./Constraints7";
import Constraints8 from "./Constraints8";
import Constraints9 from "./Constraints9";
import Groups from "./Groups";
import Kinmus from "./Kinmus";
import Members from "./Members";
import Rosters from "./Rosters";
import Terms from "./Terms";

const drawerWidth = 240;

const styles = (theme: Theme) =>
  createStyles({
    appBar: {
      [theme.breakpoints.up("md")]: {
        width: `calc(100% - ${drawerWidth}px)`,
      },
      position: "fixed",
    },
    content: {
      [theme.breakpoints.up("md")]: {
        maxWidth: `calc(100% - ${drawerWidth}px)`,
      },
      flex: 1,
      maxWidth: "100%",
    },
    drawerDocked: {
      width: drawerWidth,
    },
    drawerPaper: {
      width: drawerWidth,
    },
    navIconHide: {
      [theme.breakpoints.up("md")]: {
        display: "none",
      },
    },
    root: {
      display: "flex",
    },
    title: {
      flex: 1,
    },
    toolbar: theme.mixins.toolbar,
    version: {
      ...theme.typography.subtitle2,
      marginLeft: theme.spacing(3),
    },
  });

type Props = {
  dispatch: Dispatch;
  pastExists: boolean;
  all: all.All;
  futureExists: boolean;
} & WithTheme &
  WithStyles<typeof styles> &
  RouteComponentProps<{}>;

type State = {
  mobileOpen: boolean;
};

function LinkTo(to: string) {
  return (props: any) => {
    return <Link to={to} {...props} />;
  };
}

const ListItemLink = withRouter(
  (props: { to: string; text: string } & RouteComponentProps<{}>) => (
    <ListItem
      button={true}
      selected={props.to === props.location.pathname}
      component={LinkTo(props.to)}
    >
      <ListItemText primary={props.text} />
    </ListItem>
  )
);

class ResponsiveDrawer extends React.Component<Props, State> {
  public state: State = {
    mobileOpen: false,
  };
  public handleDrawerToggle = () => {
    this.setState((state) => ({ mobileOpen: !state.mobileOpen }));
  };
  public handleClickUndo = () => {
    this.props.dispatch(ActionCreators.undo());
  };
  public handleClickRedo = () => {
    this.props.dispatch(ActionCreators.redo());
  };
  public writeAll = () => {
    utils.sendJSONRPCRequest("write_all", [this.props.all]);
  };
  public render() {
    const { classes, theme } = this.props;
    const drawer = (
      <>
        <div className={classes.toolbar} />
        <Divider />
        <List>
          <ListItemLink to="/rosters" text="勤務表" />
        </List>
        <Divider />
        <List>
          <ListItemLink to="/terms" text="期間" />
          <ListItemLink to="/members" text="職員" />
          <ListItemLink to="/kinmus" text="勤務" />
          <ListItemLink to="/groups" text="グループ" />
        </List>
        <Divider />
        <List>
          <ListItemLink to="/constraints0" text="連続禁止勤務並び" />
          <ListItemLink
            to="/constraints1"
            text="期間の勤務にグループから割り当てる職員数の下限"
          />
          <ListItemLink
            to="/constraints2"
            text="期間の勤務にグループから割り当てる職員数の上限"
          />
          <ListItemLink
            to="/constraints3"
            text="職員の勤務の割り当て数の下限"
          />
          <ListItemLink
            to="/constraints4"
            text="職員の勤務の割り当て数の上限"
          />
          <ListItemLink to="/constraints5" text="勤務の連続日数の下限" />
          <ListItemLink to="/constraints6" text="勤務の連続日数の上限" />
          <ListItemLink to="/constraints7" text="勤務の間隔日数の下限" />
          <ListItemLink to="/constraints8" text="勤務の間隔日数の上限" />
          <ListItemLink to="/constraints9" text="職員の期間に割り当てる勤務" />
          <ListItemLink
            to="/constraints10"
            text="職員の期間に割り当てない勤務"
          />
        </List>
      </>
    );
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
            <Typography
              variant="h6"
              color="inherit"
              noWrap={true}
              className={classes.title}
            >
              pulp-scheduling<span className={classes.version}>v0.1.9</span>
            </Typography>
            <Button
              color="inherit"
              onClick={this.handleClickUndo}
              disabled={!this.props.pastExists}
            >
              元に戻す
            </Button>
            <Button
              color="inherit"
              onClick={this.handleClickRedo}
              disabled={!this.props.futureExists}
            >
              やり直す
            </Button>
            <Button color="inherit" onClick={this.writeAll}>
              保存
            </Button>
          </Toolbar>
        </AppBar>
        <Hidden mdUp={true}>
          <Drawer
            variant="temporary"
            anchor={theme.direction === "rtl" ? "right" : "left"}
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
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Route path="/rosters" component={Rosters} />
          <Route path="/terms" component={Terms} />
          <Route path="/members" component={Members} />
          <Route path="/kinmus" component={Kinmus} />
          <Route path="/groups" component={Groups} />
          <Route path="/constraints0" component={Constraints0} />
          <Route path="/constraints1" component={Constraints1} />
          <Route path="/constraints2" component={Constraints2} />
          <Route path="/constraints3" component={Constraints3} />
          <Route path="/constraints4" component={Constraints4} />
          <Route path="/constraints5" component={Constraints5} />
          <Route path="/constraints6" component={Constraints6} />
          <Route path="/constraints7" component={Constraints7} />
          <Route path="/constraints8" component={Constraints8} />
          <Route path="/constraints9" component={Constraints9} />
          <Route path="/constraints10" component={Constraints10} />
        </div>
      </div>
    );
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    all: state.present,
    futureExists: state.future.length > 0,
    pastExists: state.past.length > 0,
  };
}

export default withTheme(
  withStyles(styles)(withRouter(connect(mapStateToProps)(ResponsiveDrawer)))
);
