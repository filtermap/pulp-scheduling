import Button from "@mui/material/Button";
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
import { useImmer } from "use-immer";

import * as all from "../modules/all";
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
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import * as schedules from "../modules/schedules";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import Schedule from "./Schedule";
import Constraint0Name from "./names/Constraint0Name";
import Constraint10Name from "./names/Constraint10Name";
import Constraint1Name from "./names/Constraint1Name";
import Constraint2Name from "./names/Constraint2Name";
import Constraint3Name from "./names/Constraint3Name";
import Constraint4Name from "./names/Constraint4Name";
import Constraint5Name from "./names/Constraint5Name";
import Constraint6Name from "./names/Constraint6Name";
import Constraint7Name from "./names/Constraint7Name";
import Constraint8Name from "./names/Constraint8Name";
import Constraint9Name from "./names/Constraint9Name";
import KinmuName from "./names/KinmuName";
import MemberName from "./names/MemberName";
import GridFrame from "./parts/GridFrame";
import StickyLeftTableCell from "./parts/StickyLeftTableCell";
import StickyLeftTopTableCell from "./parts/StickyLeftTopTableCell";
import StickyTopTableCell from "./parts/StickyTopTableCell";

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
  newScheduleAssignments: all.NewAssignment[];
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
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const selectedConstraint0ById = useSelector(
    constraints0.selectors.selectEntities
  );
  const selectedConstraint1ById = useSelector(
    constraints1.selectors.selectEntities
  );
  const selectedConstraint2ById = useSelector(
    constraints2.selectors.selectEntities
  );
  const selectedConstraint3ById = useSelector(
    constraints3.selectors.selectEntities
  );
  const selectedConstraint4ById = useSelector(
    constraints4.selectors.selectEntities
  );
  const selectedConstraint5ById = useSelector(
    constraints5.selectors.selectEntities
  );
  const selectedConstraint6ById = useSelector(
    constraints6.selectors.selectEntities
  );
  const selectedConstraint7ById = useSelector(
    constraints7.selectors.selectEntities
  );
  const selectedConstraint8ById = useSelector(
    constraints8.selectors.selectEntities
  );
  const selectedConstraint9ById = useSelector(
    constraints9.selectors.selectEntities
  );
  const selectedConstraint10ById = useSelector(
    constraints10.selectors.selectEntities
  );
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const initialState: State = {
    creationDialogIsOpen: false,
    dialogState: {
      type: FIRST,
    },
  };
  const [state, updateState] = useImmer<State>(initialState);
  React.useEffect(
    () =>
      updateState((state) => {
        state.dialogState = {
          type: FIRST,
        };
      }),
    [termId, updateState]
  );
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
    updateState((state) => {
      state.creationDialogIsOpen = true;
    });
  };
  const handleCloseCreationDialog = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
  };
  const handleClickSolve = async () => {
    updateState((state) => {
      state.dialogState = {
        type: SOLVE_IN_PROGRESS,
      };
    });
    const response = await utils.sendJSONRPCRequest("solve", [allInTerm]);
    if ("error" in response) {
      updateState((state) => {
        state.dialogState = {
          errorMessage: response.error.message,
          type: UNSOLVED,
        };
      });
      return;
    }
    const { result } = response;
    updateState((state) => {
      state.dialogState = {
        newScheduleAssignments: result as all.NewAssignment[],
        type: SOLVED,
      };
    });
  };
  const handleClickPursue = async () => {
    updateState((state) => {
      state.dialogState = {
        type: PURSUE_IN_PROGRESS,
      };
    });
    const response = await utils.sendJSONRPCRequest("pursue", [allInTerm]);
    if ("error" in response) {
      updateState((state) => {
        state.dialogState = {
          errorMessage: response.error.message,
          type: UNPURSUED,
        };
      });
      return;
    }
    const { result } = response;
    const { constraint } = result as {
      constraint: { id: number; type: string };
    };
    updateState((state) => {
      state.dialogState = {
        constraint,
        type: PURSUED,
      };
    });
  };
  const handleClickCreateSchedule = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    if (state.dialogState.type === SOLVED) {
      dispatch(
        all.addSchedule({
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
            <DialogContent sx={{ overflow: "auto", padding: 0 }}>
              <Table>
                <TableHead>
                  <TableRow>
                    <StickyLeftTopTableCell size="small">
                      \
                    </StickyLeftTopTableCell>
                    {newScheduleDateNames.map((date_name) => (
                      <StickyTopTableCell key={date_name} size="small">
                        {date_name}
                      </StickyTopTableCell>
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
                        <StickyLeftTableCell size="small">
                          <MemberName member={member} />
                        </StickyLeftTableCell>
                        {newScheduleDateNames.map((date_name) => (
                          <TableCell size="small" key={date_name}>
                            <KinmuName
                              kinmu={
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                selectedKinmuById[
                                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                  newScheduleMemberAssignments.find(
                                    (assignment) =>
                                      assignment.date_name === date_name
                                  )!.kinmu_id
                                ]!
                              }
                            />
                          </TableCell>
                        ))}
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
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
              const constraint0 = selectedConstraint0ById[constraint.id]!;
              return <Constraint0Name constraint0={constraint0} />;
            }
            case "Constraint1": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint1 = selectedConstraint1ById[constraint.id]!;
              return <Constraint1Name constraint1={constraint1} />;
            }
            case "Constraint2": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint2 = selectedConstraint2ById[constraint.id]!;
              return <Constraint2Name constraint2={constraint2} />;
            }
            case "Constraint3": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint3 = selectedConstraint3ById[constraint.id]!;
              return <Constraint3Name constraint3={constraint3} />;
            }
            case "Constraint4": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint4 = selectedConstraint4ById[constraint.id]!;
              return <Constraint4Name constraint4={constraint4} />;
            }
            case "Constraint5": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint5 = selectedConstraint5ById[constraint.id]!;
              return <Constraint5Name constraint5={constraint5} />;
            }
            case "Constraint6": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint6 = selectedConstraint6ById[constraint.id]!;
              return <Constraint6Name constraint6={constraint6} />;
            }
            case "Constraint7": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint7 = selectedConstraint7ById[constraint.id]!;
              return <Constraint7Name constraint7={constraint7} />;
            }
            case "Constraint8": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint8 = selectedConstraint8ById[constraint.id]!;
              return <Constraint8Name constraint8={constraint8} />;
            }
            case "Constraint9": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint9 = selectedConstraint9ById[constraint.id]!;
              return <Constraint9Name constraint9={constraint9} />;
            }
            case "Constraint10": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint10 = selectedConstraint10ById[constraint.id]!;
              return <Constraint10Name constraint10={constraint10} />;
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
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          勤務表
        </Typography>
        <Button size="small" onClick={handleClickOpenCreationDialog}>
          追加
        </Button>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {allInTerm.schedules.map((schedule) => (
            <Grid key={schedule.id} item={true} xs={12}>
              <Schedule schedule={schedule} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      {dialog()}
    </>
  );
}

export default Schedules;
