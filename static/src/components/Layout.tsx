import AppBar from "@mui/material/AppBar";
import Button from "@mui/material/Button";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import MenuIcon from "@mui/icons-material/Menu";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  Route,
  Routes,
  useLocation,
} from "react-router-dom";
import { ActionCreators } from "redux-undo";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import Box from "@mui/material/Box";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import useMediaQuery from "@mui/material/useMediaQuery";
import useTheme from "@mui/material/styles/useTheme";
import * as utils from "../utils";
import * as terms from "../modules/terms";
import * as members from "../modules/members";
import * as kinmus from "../modules/kinmus";
import * as groups from "../modules/groups";
import * as group_members from "../modules/group_members";
import * as constraints0 from "../modules/constraints0";
import * as constraint0_kinmus from "../modules/constraint0_kinmus";
import * as constraints1 from "../modules/constraints1";
import * as constraints2 from "../modules/constraints2";
import * as constraints3 from "../modules/constraints3";
import * as constraints4 from "../modules/constraints4";
import * as constraints5 from "../modules/constraints5";
import * as constraints6 from "../modules/constraints6";
import * as constraints7 from "../modules/constraints7";
import * as constraints8 from "../modules/constraints8";
import * as constraints9 from "../modules/constraints9";
import * as constraints10 from "../modules/constraints10";
import * as schedules from "../modules/schedules";
import * as assignments from "../modules/assignments";
import * as all from "../modules/all";
import { useAppSelector } from "../modules/hooks";
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
import Schedules from "./Schedules";
import Terms from "./Terms";

const drawerWidth = 240;

type State = {
  drawerIsOpen: boolean;
};

function ListItemLink(props: { to: string; primary: string }) {
  const { primary, to } = props;
  const location = useLocation();
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, "to">>(
        function Link(itemProps, ref) {
          return <RouterLink to={to} ref={ref} {...itemProps} />;
        }
      ),
    [to]
  );
  return (
    <ListItem
      button={true}
      selected={to === location.pathname}
      component={renderLink}
    >
      <ListItemText primary={primary} />
    </ListItem>
  );
}

function TermListItems(props: { term: terms.Term }) {
  const [state, setState] = React.useState<{ isOpen: boolean }>({
    isOpen: false,
  });
  const handleClickTerm = () =>
    setState((state) => ({ ...state, isOpen: !state.isOpen }));
  return (
    <>
      <ListItem button={true} onClick={handleClickTerm}>
        <ListItemText
          primary={`${props.term.start_date_name}から${props.term.stop_date_name}まで`}
        />
        {state.isOpen ? <ExpandLess /> : <ExpandMore />}
      </ListItem>
      <Collapse in={state.isOpen}>
        <List component="div" disablePadding>
          <ListItemLink
            to={`/terms/${props.term.id}/schedules`}
            primary="勤務表"
          />
          <ListItemLink to={`/terms/${props.term.id}/members`} primary="職員" />
          <ListItemLink to={`/terms/${props.term.id}/kinmus`} primary="勤務" />
          <ListItemLink
            to={`/terms/${props.term.id}/groups`}
            primary="グループ"
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints0`}
            primary="連続禁止勤務並び"
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints1`}
            primary="期間の勤務にグループから割り当てる職員数の下限"
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints2`}
            primary="期間の勤務にグループから割り当てる職員数の上限"
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints3`}
            primary="職員の勤務の割り当て数の下限"
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints4`}
            primary="職員の勤務の割り当て数の上限"
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints5`}
            primary="勤務の連続日数の下限"
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints6`}
            primary="勤務の連続日数の上限"
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints7`}
            primary="勤務の間隔日数の下限"
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints8`}
            primary="勤務の間隔日数の上限"
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints9`}
            primary="職員の期間に割り当てる勤務"
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints10`}
            primary="職員の期間に割り当てない勤務"
          />
        </List>
      </Collapse>
    </>
  );
}

export default function Layout(): JSX.Element {
  const dispatch = useDispatch();
  const selectedFutureExists = useAppSelector(
    (state) => state.future.length > 0
  );
  const selectedPastExists = useAppSelector((state) => state.past.length > 0);
  const selectedTerms = useSelector(terms.selectors.selectAll);
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const selectedGroupMembers = useSelector(group_members.selectors.selectAll);
  const selectedConstraints0 = useSelector(constraints0.selectors.selectAll);
  const selectedConstraint0Kinmus = useSelector(
    constraint0_kinmus.selectors.selectAll
  );
  const selectedConstraints1 = useSelector(constraints1.selectors.selectAll);
  const selectedConstraints2 = useSelector(constraints2.selectors.selectAll);
  const selectedConstraints3 = useSelector(constraints3.selectors.selectAll);
  const selectedConstraints4 = useSelector(constraints4.selectors.selectAll);
  const selectedConstraints5 = useSelector(constraints5.selectors.selectAll);
  const selectedConstraints6 = useSelector(constraints6.selectors.selectAll);
  const selectedConstraints7 = useSelector(constraints7.selectors.selectAll);
  const selectedConstraints8 = useSelector(constraints8.selectors.selectAll);
  const selectedConstraints9 = useSelector(constraints9.selectors.selectAll);
  const selectedConstraints10 = useSelector(constraints10.selectors.selectAll);
  const selectedSchedules = useSelector(schedules.selectors.selectAll);
  const selectedAssignments = useSelector(assignments.selectors.selectAll);
  const theme = useTheme();
  const viewportIsWide = useMediaQuery(theme.breakpoints.up("md"), {
    noSsr: true,
  });
  const [state, setState] = React.useState<State>({
    drawerIsOpen: viewportIsWide,
  });
  React.useEffect(() => {
    async function f(): Promise<void> {
      const { result } = (await utils.sendJSONRPCRequest("read_all")) as {
        result: all.PlainAll;
      };
      dispatch(all.replaceAll(result));
    }
    f();
  }, [dispatch]);
  const handleDrawerToggle = () => {
    setState((state) => ({ ...state, drawerIsOpen: !state.drawerIsOpen }));
  };
  const handleClickUndo = () => {
    dispatch(ActionCreators.undo());
  };
  const handleClickRedo = () => {
    dispatch(ActionCreators.redo());
  };
  const writeAll = () => {
    const plainAll: all.PlainAll = {
      terms: selectedTerms,
      members: selectedMembers,
      kinmus: selectedKinmus,
      groups: selectedGroups,
      group_members: selectedGroupMembers,
      constraints0: selectedConstraints0,
      constraint0_kinmus: selectedConstraint0Kinmus,
      constraints1: selectedConstraints1,
      constraints2: selectedConstraints2,
      constraints3: selectedConstraints3,
      constraints4: selectedConstraints4,
      constraints5: selectedConstraints5,
      constraints6: selectedConstraints6,
      constraints7: selectedConstraints7,
      constraints8: selectedConstraints8,
      constraints9: selectedConstraints9,
      constraints10: selectedConstraints10,
      schedules: selectedSchedules,
      assignments: selectedAssignments,
    };
    utils.sendJSONRPCRequest("write_all", [plainAll]);
  };
  const drawer = (
    <>
      <Toolbar
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "flex-end",
          padding: [0, 1],
        }}
      >
        <IconButton onClick={handleDrawerToggle}>
          <ChevronLeftIcon />
        </IconButton>
      </Toolbar>
      <List component="div" disablePadding>
        <ListItemLink to="/terms" primary="期間" />
        {selectedTerms
          .filter(({ is_enabled }) => is_enabled)
          .map((term) => (
            <TermListItems key={term.id} term={term} />
          ))}
      </List>
    </>
  );
  return (
    <Box sx={{ display: "flex" }}>
      <AppBar
        sx={(theme) => ({
          position: "fixed",
          transition: theme.transitions.create(["margin", "width"], {
            duration: theme.transitions.duration.leavingScreen,
            easing: theme.transitions.easing.sharp,
          }),
          ...(state.drawerIsOpen && {
            marginLeft: { md: `${drawerWidth}px` },
            transition: theme.transitions.create(["margin", "width"], {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.easeOut,
            }),
            width: { md: `calc(100% - ${drawerWidth}px)` },
          }),
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            size="large"
            sx={{ ...(state.drawerIsOpen && { display: { md: "none" } }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            noWrap={true}
            sx={{ flexGrow: 1 }}
          >
            pulp-scheduling
            <Typography
              component="span"
              variant="subtitle2"
              sx={{ marginLeft: 3 }}
            >
              v0.2.0
            </Typography>
          </Typography>
          <Button
            color="inherit"
            onClick={handleClickUndo}
            disabled={!selectedPastExists}
          >
            元に戻す
          </Button>
          <Button
            color="inherit"
            onClick={handleClickRedo}
            disabled={!selectedFutureExists}
          >
            やり直す
          </Button>
          <Button color="inherit" onClick={writeAll}>
            保存
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        variant="temporary"
        open={state.drawerIsOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true, // Better open performance on mobile.
        }}
        sx={{
          display: { xs: "block", md: "none" },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Drawer
        anchor="left"
        variant="persistent"
        open={state.drawerIsOpen}
        sx={{
          display: { xs: "none", md: "block" },
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
        }}
      >
        {drawer}
      </Drawer>
      <Box
        sx={(theme) => ({
          flexGrow: 1,
          transition: theme.transitions.create(["margin", "width"], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          ...(state.drawerIsOpen && {
            marginLeft: { md: `${drawerWidth}px` },
            transition: theme.transitions.create(["margin", "width"], {
              easing: theme.transitions.easing.easeOut,
              duration: theme.transitions.duration.enteringScreen,
            }),
            width: { md: `calc(100% - ${drawerWidth}px)` },
          }),
        })}
      >
        <Toolbar />
        <Routes>
          <Route path="/terms" element={<Terms />} />
          <Route path="/terms/:termIdName/schedules" element={<Schedules />} />
          <Route path="/terms/:termIdName/members" element={<Members />} />
          <Route path="/terms/:termIdName/kinmus" element={<Kinmus />} />
          <Route path="/terms/:termIdName/groups" element={<Groups />} />
          <Route
            path="/terms/:termIdName/constraints0"
            element={<Constraints0 />}
          />
          <Route
            path="/terms/:termIdName/constraints1"
            element={<Constraints1 />}
          />
          <Route
            path="/terms/:termIdName/constraints2"
            element={<Constraints2 />}
          />
          <Route
            path="/terms/:termIdName/constraints3"
            element={<Constraints3 />}
          />
          <Route
            path="/terms/:termIdName/constraints4"
            element={<Constraints4 />}
          />
          <Route
            path="/terms/:termIdName/constraints5"
            element={<Constraints5 />}
          />
          <Route
            path="/terms/:termIdName/constraints6"
            element={<Constraints6 />}
          />
          <Route
            path="/terms/:termIdName/constraints7"
            element={<Constraints7 />}
          />
          <Route
            path="/terms/:termIdName/constraints8"
            element={<Constraints8 />}
          />
          <Route
            path="/terms/:termIdName/constraints9"
            element={<Constraints9 />}
          />
          <Route
            path="/terms/:termIdName/constraints10"
            element={<Constraints10 />}
          />
        </Routes>
      </Box>
    </Box>
  );
}
