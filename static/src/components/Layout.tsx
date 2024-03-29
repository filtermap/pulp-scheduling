import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import MenuIcon from "@mui/icons-material/Menu";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Collapse from "@mui/material/Collapse";
import Drawer from "@mui/material/Drawer";
import IconButton from "@mui/material/IconButton";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import useTheme from "@mui/material/styles/useTheme";
import useMediaQuery from "@mui/material/useMediaQuery";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import {
  Link as RouterLink,
  LinkProps as RouterLinkProps,
  Route,
  Routes,
  useLocation,
  useMatch,
} from "react-router-dom";
import { ActionCreators } from "redux-undo";
import { useImmer } from "use-immer";

import * as all from "../modules/all";
import * as assignments from "../modules/assignments";
import * as constraint0_kinmus from "../modules/constraint0_kinmus";
import * as constraints0 from "../modules/constraints0";
import * as constraints1 from "../modules/constraints1";
import * as constraints10 from "../modules/constraints10";
import * as constraints2 from "../modules/constraints2";
import * as constraints3 from "../modules/constraints3";
import * as constraints4 from "../modules/constraints4";
import * as constraints5 from "../modules/constraints5";
import * as constraints6 from "../modules/constraints6";
import * as constraints7 from "../modules/constraints7";
import * as constraints8 from "../modules/constraints8";
import * as constraints9 from "../modules/constraints9";
import * as group_members from "../modules/group_members";
import * as groups from "../modules/groups";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import * as schedules from "../modules/schedules";
import * as terms from "../modules/terms";
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
import Schedules from "./Schedules";
import Terms from "./Terms";
import TermName from "./names/TermName";
import RotationalExpandMore from "./parts/RotationalExpandMore";

const drawerWidth = 240;

type State = {
  drawerIsOpen: boolean;
};

// eslint-disable-next-line react/display-name
const ListItemLink = React.memo((props: { to: string; primary: string }) => {
  const { primary, to } = props;
  const location = useLocation();
  const Link = React.useCallback(
    // eslint-disable-next-line react-memo/require-memo
    (itemProps, ref) => <RouterLink to={to} ref={ref} {...itemProps} />,
    [to]
  );
  const renderLink = React.useMemo(
    () =>
      React.forwardRef<HTMLAnchorElement, Omit<RouterLinkProps, "to">>(Link),
    [Link]
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
});

// eslint-disable-next-line react/display-name
const TermListItems = React.memo((props: { term: terms.Term }) => {
  const { t } = useTranslation();
  const params = useMatch("/terms/:termIdName/*")?.params;
  const [state, updateState] = useImmer<{ expanded: boolean }>({
    expanded: false,
  });
  React.useEffect(() => {
    if (!params) return;
    const { termIdName } = params;
    if (!termIdName) return;
    const termId = parseInt(termIdName, 10);
    if (termId !== props.term.id) return;
    updateState((state) => {
      state.expanded = true;
    });
  }, [props.term.id, params, updateState]);
  const handleClickTerm = () =>
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  return (
    <>
      <ListItem button={true} onClick={handleClickTerm}>
        <ListItemText primary={<TermName term={props.term} />} />
        <RotationalExpandMore expanded={state.expanded} />
      </ListItem>
      <Collapse in={state.expanded}>
        <List component="div" disablePadding>
          <ListItemLink
            to={`/terms/${props.term.id}/schedules`}
            primary={t("勤務表")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/members`}
            primary={t("職員")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/kinmus`}
            primary={t("勤務")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/groups`}
            primary={t("グループ")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints0`}
            primary={t("連続禁止勤務並び")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints1`}
            primary={t("期間中勤務にグループから割り当てる職員数の下限")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints2`}
            primary={t("期間中勤務にグループから割り当てる職員数の上限")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints3`}
            primary={t("職員への勤務の割り当て数の下限")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints4`}
            primary={t("職員への勤務の割り当て数の上限")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints5`}
            primary={t("勤務の連続日数の下限")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints6`}
            primary={t("勤務の連続日数の上限")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints7`}
            primary={t("勤務の間隔日数の下限")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints8`}
            primary={t("勤務の間隔日数の上限")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints9`}
            primary={t("期間中職員に割り当てる勤務")}
          />
          <ListItemLink
            to={`/terms/${props.term.id}/constraints10`}
            primary={t("期間中職員に割り当てない勤務")}
          />
        </List>
      </Collapse>
    </>
  );
});

// eslint-disable-next-line react/display-name
const Layout = React.memo((): JSX.Element => {
  const { t } = useTranslation();
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
  const [state, updateState] = useImmer<State>({
    drawerIsOpen: viewportIsWide,
  });
  React.useEffect(() => {
    (async () => {
      const response = await utils.sendJSONRPCRequest("read_all");
      if ("error" in response) throw new Error(response.error.message);
      const { result } = response;
      if (!all.PlainAll.is(result)) throw new Error("!all.PlainAll.is(result)");
      dispatch(all.replaceAll(result));
    })();
  }, [dispatch]);
  const handleDrawerToggle = () => {
    updateState((state) => {
      state.drawerIsOpen = !state.drawerIsOpen;
    });
  };
  const handleClickUndo = () => {
    dispatch(ActionCreators.undo());
  };
  const handleClickRedo = () => {
    dispatch(ActionCreators.redo());
  };
  const writeAll = () => {
    const plainAll: all.PlainAll = {
      assignments: selectedAssignments,
      constraint0_kinmus: selectedConstraint0Kinmus,
      constraints0: selectedConstraints0,
      constraints1: selectedConstraints1,
      constraints10: selectedConstraints10,
      constraints2: selectedConstraints2,
      constraints3: selectedConstraints3,
      constraints4: selectedConstraints4,
      constraints5: selectedConstraints5,
      constraints6: selectedConstraints6,
      constraints7: selectedConstraints7,
      constraints8: selectedConstraints8,
      constraints9: selectedConstraints9,
      group_members: selectedGroupMembers,
      groups: selectedGroups,
      kinmus: selectedKinmus,
      members: selectedMembers,
      schedules: selectedSchedules,
      terms: selectedTerms,
    };
    utils.sendJSONRPCRequest("write_all", [plainAll]);
  };
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
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(["margin", "width"], {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.easeOut,
            }),
            width: `calc(100% - ${drawerWidth}px)`,
          }),
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onClick={handleDrawerToggle}
            size="large"
            sx={{ ...(state.drawerIsOpen && { display: "none" }) }}
          >
            <MenuIcon />
          </IconButton>
          <Typography
            variant="h6"
            color="inherit"
            noWrap={true}
            sx={{ flexGrow: 1 }}
          >
            {t("pulp-scheduling")}
            <Typography
              component="span"
              variant="subtitle2"
              sx={{ marginLeft: 3 }}
            >
              {t("version")}
            </Typography>
          </Typography>
          <Button
            color="inherit"
            onClick={handleClickUndo}
            disabled={!selectedPastExists}
          >
            {t("元に戻す")}
          </Button>
          <Button
            color="inherit"
            onClick={handleClickRedo}
            disabled={!selectedFutureExists}
          >
            {t("やり直す")}
          </Button>
          <Button color="inherit" onClick={writeAll}>
            {t("保存")}
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        anchor="left"
        variant="persistent"
        open={state.drawerIsOpen}
        sx={{
          "& .MuiDrawer-paper": {
            boxSizing: "border-box",
            width: drawerWidth,
          },
          flexShrink: 0,
        }}
      >
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
          <ListItemLink to="/terms" primary={t("期間")} />
          {selectedTerms
            .filter(({ is_enabled }) => is_enabled)
            .map((term) => (
              <TermListItems key={term.id} term={term} />
            ))}
        </List>
      </Drawer>
      <Box
        sx={(theme) => ({
          flexGrow: 1,
          transition: theme.transitions.create(["margin", "width"], {
            duration: theme.transitions.duration.leavingScreen,
            easing: theme.transitions.easing.sharp,
          }),
          ...(state.drawerIsOpen && {
            marginLeft: `${drawerWidth}px`,
            transition: theme.transitions.create(["margin", "width"], {
              duration: theme.transitions.duration.enteringScreen,
              easing: theme.transitions.easing.easeOut,
            }),
            width: `calc(100% - ${drawerWidth}px)`,
          }),
        })}
      >
        <Toolbar />
        <Routes>
          <Route path="/" element={<Terms />} />
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
});

export default Layout;
