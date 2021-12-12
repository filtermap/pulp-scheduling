import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import LinearProgress from "@mui/material/LinearProgress";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import * as all from "../modules/all";
import * as assignments from "../modules/assignments";
import * as utils from "../utils";
import * as constraints0 from "../modules/constraints0";
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
import * as groups from "../modules/groups";
import * as members from "../modules/members";
import * as terms from "../modules/terms";
import * as kinmus from "../modules/kinmus";
import * as constraint0_kinmus from "../modules/constraint0_kinmus";
import * as schedules from "../modules/schedules";
import * as group_members from "../modules/group_members";
import Schedule from "./Schedule";

const PREFIX = "Schedules";

const classes = {
  dialogTableContent: `${PREFIX}-dialogTableContent`,
  dialogTableWrapper: `${PREFIX}-dialogTableWrapper`,
  gridFrame: `${PREFIX}-gridFrame`,
  leftHeaderCell: `${PREFIX}-leftHeaderCell`,
  leftTopHeaderCell: `${PREFIX}-leftTopHeaderCell`,
  toolbarTitle: `${PREFIX}-toolbarTitle`,
  topHeaderCell: `${PREFIX}-topHeaderCell`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(({ theme }) => ({
  [`& .${classes.dialogTableContent}`]: {
    display: "flex",
  },
  [`& .${classes.dialogTableWrapper}`]: {
    overflow: "auto",
  },
  [`& .${classes.gridFrame}`]: {
    padding: 8,
  },
  [`& .${classes.leftHeaderCell}`]: {
    background: theme.palette.background.default,
    left: 0,
    position: "sticky",
  },
  [`& .${classes.leftTopHeaderCell}`]: {
    background: theme.palette.background.default,
    left: 0,
    position: "sticky",
    top: 0,
    zIndex: 2,
  },
  [`& .${classes.toolbarTitle}`]: {
    flex: 1,
  },
  [`& .${classes.topHeaderCell}`]: {
    background: theme.palette.background.default,
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
}));

const FIRST = "FIRST";
const SOLVE_IN_PROGRESS = "SOLVE_IN_PROGRESS";
const SOLVED = "SOLVED";
const UNSOLVED = "UNSOLVED";
const PURSUE_IN_PROGRESS = "PURSUE_IN_PROGRESS";
const PURSUED = "PURSUED";
const UNPURSUED = "UNPURSUED";

type First = {
  type: typeof FIRST;
};

type SolveInProgress = {
  type: typeof SOLVE_IN_PROGRESS;
};

type Solved = {
  type: typeof SOLVED;
  newScheduleAssignments: assignments.Assignment[];
};

type Unsolved = {
  type: typeof UNSOLVED;
  errorMessage: string;
};

type PursueInProgress = {
  type: typeof PURSUE_IN_PROGRESS;
};

type Pursued = {
  type: typeof PURSUED;
  constraint: {
    type: string;
    id: number;
  };
};

type Unpursued = {
  type: typeof UNPURSUED;
  errorMessage: string;
};

type DialogState =
  | First
  | SolveInProgress
  | Solved
  | Unsolved
  | PursueInProgress
  | Pursued
  | Unpursued;

type State = {
  creationDialogIsOpen: boolean;
  dialogState: DialogState;
};

function sortDateNames(dateNames: string[]): string[] {
  return [...dateNames].sort(
    (a, b) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      utils.stringToDate(a)!.getTime() - utils.stringToDate(b)!.getTime()
  );
}

function Schedules(): JSX.Element {
  const dispatch = useDispatch();
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const selectedGroupMembers = useSelector(group_members.selectors.selectAll);
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedTerms = useSelector(terms.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedConstraint0Kinmus = useSelector(
    constraint0_kinmus.selectors.selectAll
  );
  const selectedConstraints0 = useSelector(constraints0.selectors.selectAll);
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
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const initialState: State = {
    creationDialogIsOpen: false,
    dialogState: {
      type: FIRST,
    },
  };
  const [state, setState] = React.useState<State>(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setState(initialState), [termId]);
  const byTermId = ({ term_id }: { term_id: number }) => term_id === termId;
  const constraints0InTerm = selectedConstraints0.filter(byTermId);
  const constraint0IdsInTerm = new Set(constraints0InTerm.map(({ id }) => id));
  const groupsInTerm = selectedGroups.filter(byTermId);
  const groupIdsInTerm = new Set(groupsInTerm.map(({ id }) => id));
  const allInTerm = {
    terms: selectedTerms.filter(({ id }) => id === termId),
    members: selectedMembers.filter(byTermId),
    kinmus: selectedKinmus.filter(byTermId),
    groups: groupsInTerm,
    group_members: selectedGroupMembers.filter(({ group_id }) =>
      groupIdsInTerm.has(group_id)
    ),
    constraints0: constraints0InTerm,
    constraint0_kinmus: selectedConstraint0Kinmus.filter(({ constraint0_id }) =>
      constraint0IdsInTerm.has(constraint0_id)
    ),
    constraints1: selectedConstraints1.filter(byTermId),
    constraints2: selectedConstraints2.filter(byTermId),
    constraints3: selectedConstraints3.filter(byTermId),
    constraints4: selectedConstraints4.filter(byTermId),
    constraints5: selectedConstraints5.filter(byTermId),
    constraints6: selectedConstraints6.filter(byTermId),
    constraints7: selectedConstraints7.filter(byTermId),
    constraints8: selectedConstraints8.filter(byTermId),
    constraints9: selectedConstraints9.filter(byTermId),
    constraints10: selectedConstraints10.filter(byTermId),
    schedules: selectedSchedules.filter(byTermId),
  };
  const handleClickOpenCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: true }));
  };
  const handleCloseCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
  };
  const handleClickSolve = async () => {
    setState((state) => ({
      ...state,
      dialogState: {
        type: SOLVE_IN_PROGRESS,
      },
    }));
    const response = (await utils.sendJSONRPCRequest("solve", [allInTerm])) as
      | { error: { message: string } }
      | { result: assignments.Assignment[] };
    if ("error" in response) {
      setState((state) => ({
        ...state,
        dialogState: {
          errorMessage: response.error.message,
          type: UNSOLVED,
        },
      }));
      return;
    }
    setState((state) => ({
      ...state,
      dialogState: {
        newScheduleAssignments: response.result,
        type: SOLVED,
      },
    }));
  };
  const handleClickPursue = async () => {
    setState((state) => ({
      ...state,
      dialogState: {
        type: PURSUE_IN_PROGRESS,
      },
    }));
    const response = (await utils.sendJSONRPCRequest("pursue", [allInTerm])) as
      | { error: { message: string } }
      | { result: { constraint: { id: number; type: string } } };
    if ("error" in response) {
      setState((state) => ({
        ...state,
        dialogState: {
          errorMessage: response.error.message,
          type: UNPURSUED,
        },
      }));
      return;
    }
    setState((state) => ({
      ...state,
      dialogState: {
        constraint: {
          id: response.result.constraint.id,
          type: response.result.constraint.type,
        },
        type: PURSUED,
      },
    }));
  };
  const handleClickCreateSchedule = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    if (state.dialogState.type === SOLVED) {
      dispatch(
        all.createSchedule({
          schedule: {
            term_id: termId,
          },
          new_assignments: state.dialogState.newScheduleAssignments,
        })
      );
    }
  };
  const dialog = () => {
    switch (state.dialogState.type) {
      case FIRST:
        return (
          <Dialog
            onClose={handleCloseCreationDialog}
            open={state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>勤務表の追加</DialogTitle>
            <DialogContent>
              <Button size="small" onClick={handleClickSolve}>
                自動作成
              </Button>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleCloseCreationDialog}>
                閉じる
              </Button>
            </DialogActions>
          </Dialog>
        );
      case SOLVE_IN_PROGRESS:
        return (
          <Dialog
            open={state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>勤務表の追加</DialogTitle>
            <DialogContent>
              <DialogContentText>作成中...</DialogContentText>
              <LinearProgress variant="query" />
            </DialogContent>
          </Dialog>
        );
      case SOLVED: {
        const { newScheduleAssignments } = state.dialogState;
        const newScheduleDateNames = sortDateNames(
          Array.from(
            new Set(newScheduleAssignments.map(({ date_name }) => date_name))
          )
        );
        const newScheduleMemberIds = Array.from(
          new Set(newScheduleAssignments.map(({ member_id }) => member_id))
        );
        const newScheduleMembers = allInTerm.members.filter(({ id }) =>
          newScheduleMemberIds.includes(id)
        );
        return (
          <Dialog
            onClose={handleCloseCreationDialog}
            open={state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>勤務表の追加</DialogTitle>
            <DialogContent className={classes.dialogTableContent}>
              <div className={classes.dialogTableWrapper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        size="small"
                        className={classes.leftTopHeaderCell}
                      >
                        \
                      </TableCell>
                      {newScheduleDateNames.map((date_name) => (
                        <TableCell
                          key={date_name}
                          size="small"
                          className={classes.topHeaderCell}
                        >
                          {date_name}
                        </TableCell>
                      ))}
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {newScheduleMembers.map((member) => {
                      const newScheduleMemberAssignments =
                        newScheduleAssignments.filter(
                          (assignment) => assignment.member_id === member.id
                        );
                      return (
                        <TableRow key={member.id}>
                          <TableCell
                            size="small"
                            className={classes.leftHeaderCell}
                          >
                            {member.name}
                          </TableCell>
                          {newScheduleDateNames.map((date_name) => (
                            <TableCell size="small" key={date_name}>
                              {
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                allInTerm.kinmus.find(
                                  (kinmu) =>
                                    kinmu.id ===
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    newScheduleMemberAssignments.find(
                                      (assignment) =>
                                        assignment.date_name === date_name
                                    )!.kinmu_id
                                )!.name
                              }
                            </TableCell>
                          ))}
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleClickCreateSchedule}>
                追加
              </Button>
              <Button color="primary" onClick={handleCloseCreationDialog}>
                閉じる
              </Button>
            </DialogActions>
          </Dialog>
        );
      }
      case UNSOLVED:
        return (
          <Dialog
            onClose={handleCloseCreationDialog}
            open={state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>勤務表の追加</DialogTitle>
            <DialogContent>
              <DialogContentText>
                勤務表を作成できませんでした
              </DialogContentText>
              {state.dialogState.errorMessage === "Infeasible" ? (
                <>
                  <Typography>条件を満たす勤務表が存在しません</Typography>
                  <Button size="small" onClick={handleClickPursue}>
                    勤務表を作成できない原因となる条件を特定
                  </Button>
                </>
              ) : (
                <Typography>
                  pulp-schedulingの不具合やデータの破損などにより作成できない可能性があります（
                  {state.dialogState.errorMessage}）
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleCloseCreationDialog}>
                閉じる
              </Button>
            </DialogActions>
          </Dialog>
        );
      case PURSUE_IN_PROGRESS:
        return (
          <Dialog
            open={state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>勤務表の追加</DialogTitle>
            <DialogContent>
              <DialogContentText>
                勤務表を作成できない原因となる条件を特定中...
              </DialogContentText>
              <LinearProgress variant="query" />
            </DialogContent>
          </Dialog>
        );
      case PURSUED: {
        const constraint = state.dialogState.constraint;
        const constraintText = (() => {
          switch (constraint.type) {
            case "Constraint0": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint0 = allInTerm.constraints0.find(
                ({ id }) => id === constraint.id
              )!;
              const constraint0Constraint0Kinmus = allInTerm.constraint0_kinmus
                .filter(
                  ({ constraint0_id }) => constraint0_id === constraint0.id
                )
                .sort((a, b) => a.sequence_number - b.sequence_number);
              const constraint0Constraint0KinmuKinmus =
                constraint0Constraint0Kinmus.map(
                  ({ kinmu_id }) =>
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    allInTerm.kinmus.find((kinmu) => kinmu.id === kinmu_id)!
                );
              return constraint0Constraint0KinmuKinmus
                .map((kinmu) => kinmu.name)
                .join(", ");
            }
            case "Constraint1": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint1 = allInTerm.constraints1.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint1Kinmu = allInTerm.kinmus.find(
                ({ id }) => id === constraint1.kinmu_id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint1Group = allInTerm.groups.find(
                ({ id }) => id === constraint1.group_id
              )!;
              return `${constraint1.start_date_name}から${constraint1.stop_date_name}までの${constraint1Kinmu.name}に${constraint1Group.name}から${constraint1.min_number_of_assignments}人以上の職員を割り当てる`;
            }
            case "Constraint2": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint2 = allInTerm.constraints2.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint2Kinmu = allInTerm.kinmus.find(
                ({ id }) => id === constraint2.kinmu_id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint2Group = allInTerm.groups.find(
                ({ id }) => id === constraint2.group_id
              )!;
              return `${constraint2.start_date_name}から${constraint2.stop_date_name}までの${constraint2Kinmu.name}に${constraint2Group.name}から${constraint2.max_number_of_assignments}人以下の職員を割り当てる`;
            }
            case "Constraint3": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint3 = allInTerm.constraints3.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint3Member = allInTerm.members.find(
                ({ id }) => id === constraint3.member_id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint3Kinmu = allInTerm.kinmus.find(
                ({ id }) => id === constraint3.kinmu_id
              )!;
              return `${constraint3Member.name}に${constraint3Kinmu.name}を${constraint3.min_number_of_assignments}回以上割り当てる`;
            }
            case "Constraint4": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint4 = allInTerm.constraints4.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint4Member = allInTerm.members.find(
                ({ id }) => id === constraint4.member_id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint4Kinmu = allInTerm.kinmus.find(
                ({ id }) => id === constraint4.kinmu_id
              )!;
              return `${constraint4Member.name}に${constraint4Kinmu.name}を${constraint4.max_number_of_assignments}回以下割り当てる`;
            }
            case "Constraint5": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint5 = allInTerm.constraints5.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint5Kinmu = allInTerm.kinmus.find(
                ({ id }) => id === constraint5.kinmu_id
              )!;
              return `${constraint5Kinmu.name}の連続日数を${constraint5.min_number_of_days}日以上にする`;
            }
            case "Constraint6": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint6 = allInTerm.constraints6.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint6Kinmu = allInTerm.kinmus.find(
                ({ id }) => id === constraint6.kinmu_id
              )!;
              return `${constraint6Kinmu.name}の連続日数を${constraint6.max_number_of_days}日以下にする`;
            }
            case "Constraint7": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint7 = allInTerm.constraints7.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint7Kinmu = allInTerm.kinmus.find(
                ({ id }) => id === constraint7.kinmu_id
              )!;
              return `${constraint7Kinmu.name}の間隔日数を${constraint7.min_number_of_days}日以上にする`;
            }
            case "Constraint8": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint8 = allInTerm.constraints8.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint8Kinmu = allInTerm.kinmus.find(
                ({ id }) => id === constraint8.kinmu_id
              )!;
              return `${constraint8Kinmu.name}の間隔日数を${constraint8.max_number_of_days}日以下にする`;
            }
            case "Constraint9": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint9 = allInTerm.constraints9.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint9Member = allInTerm.members.find(
                ({ id }) => id === constraint9.member_id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint9Kinmu = allInTerm.kinmus.find(
                ({ id }) => id === constraint9.kinmu_id
              )!;
              return `${constraint9Member.name}の${constraint9.start_date_name}から${constraint9.stop_date_name}までに${constraint9Kinmu.name}を割り当てる`;
            }
            case "Constraint10": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint10 = allInTerm.constraints10.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint10Member = allInTerm.members.find(
                ({ id }) => id === constraint10.member_id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint10Kinmu = allInTerm.kinmus.find(
                ({ id }) => id === constraint10.kinmu_id
              )!;
              return `${constraint10Member.name}の${constraint10.start_date_name}から${constraint10.stop_date_name}までに${constraint10Kinmu.name}を割り当てない`;
            }
          }
          return "";
        })();
        return (
          <Dialog
            onClose={handleCloseCreationDialog}
            open={state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>勤務表の追加</DialogTitle>
            <DialogContent>
              <DialogContentText>
                以下の条件により勤務表を作成できませんでした
              </DialogContentText>
              <Typography>{constraintText}</Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleCloseCreationDialog}>
                閉じる
              </Button>
            </DialogActions>
          </Dialog>
        );
      }
      case UNPURSUED:
        return (
          <Dialog
            onClose={handleCloseCreationDialog}
            open={state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>勤務表の追加</DialogTitle>
            <DialogContent>
              <DialogContentText>
                勤務表を作成できない原因となる条件を特定できませんでした
              </DialogContentText>
              <Typography>
                pulp-schedulingの不具合や条件の誤りなどにより特定できない可能性があります（
                {state.dialogState.errorMessage}）
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={handleCloseCreationDialog}>
                閉じる
              </Button>
            </DialogActions>
          </Dialog>
        );
    }
  };
  return (
    <Root>
      <div className={classes.gridFrame}>
        <Grid container={true} spacing={1}>
          <Grid item={true} xs={12}>
            <Toolbar>
              <Typography variant="subtitle1" className={classes.toolbarTitle}>
                勤務表
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {allInTerm.schedules.map((schedule) => (
            <Grid key={schedule.id} item={true} xs={12}>
              <Schedule schedule={schedule} />
            </Grid>
          ))}
        </Grid>
      </div>
      {dialog()}
    </Root>
  );
}

export default Schedules;
