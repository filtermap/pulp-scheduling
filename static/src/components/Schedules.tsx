import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import LinearProgress from "@material-ui/core/LinearProgress";
import { WithStyles } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StateWithHistory } from "redux-undo";
import * as all from "../modules/all";
import * as assignments from "../modules/assignments";
import * as utils from "../utils";
import Schedule from "./Schedule";

type Props = {
  dispatch: Dispatch;
  all: all.All;
} & WithStyles<typeof styles>;

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

class Schedules extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    dialogState: {
      type: FIRST,
    },
  };
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true });
  };
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false });
  };
  public handleClickSolve = async () => {
    this.setState({
      dialogState: {
        type: SOLVE_IN_PROGRESS,
      },
    });
    const response = await utils.sendJSONRPCRequest("solve", [this.props.all]);
    if (Object.prototype.hasOwnProperty.call(response, "error")) {
      this.setState({
        dialogState: {
          errorMessage: response.error.message,
          type: UNSOLVED,
        },
      });
      return;
    }
    this.setState({
      dialogState: {
        newScheduleAssignments: response.result,
        type: SOLVED,
      },
    });
  };
  public handleClickPursue = async () => {
    this.setState({
      dialogState: {
        type: PURSUE_IN_PROGRESS,
      },
    });
    const response = await utils.sendJSONRPCRequest("pursue", [this.props.all]);
    if (Object.prototype.hasOwnProperty.call(response, "error")) {
      this.setState({
        dialogState: {
          errorMessage: response.error.message,
          type: UNPURSUED,
        },
      });
      return;
    }
    this.setState({
      dialogState: {
        constraint: {
          id: response.result.constraint.id,
          type: response.result.constraint.type,
        },
        type: PURSUED,
      },
    });
  };
  public handleClickCreateSchedule = () => {
    this.setState({ creationDialogIsOpen: false });
    if (this.state.dialogState.type === SOLVED) {
      this.props.dispatch(
        all.createSchedule(this.state.dialogState.newScheduleAssignments)
      );
    }
  };
  public dialog = () => {
    switch (this.state.dialogState.type) {
      case FIRST:
        return (
          <Dialog
            onClose={this.handleCloseCreationDialog}
            open={this.state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>勤務表の追加</DialogTitle>
            <DialogContent>
              <Button size="small" onClick={this.handleClickSolve}>
                自動作成
              </Button>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>
                閉じる
              </Button>
            </DialogActions>
          </Dialog>
        );
      case SOLVE_IN_PROGRESS:
        return (
          <Dialog
            open={this.state.creationDialogIsOpen}
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
        const { newScheduleAssignments } = this.state.dialogState;
        const newScheduleDateNames = sortDateNames(
          Array.from(
            new Set(newScheduleAssignments.map(({ date_name }) => date_name))
          )
        );
        const newScheduleMemberIds = Array.from(
          new Set(newScheduleAssignments.map(({ member_id }) => member_id))
        );
        const newScheduleMembers = this.props.all.members.filter(({ id }) =>
          newScheduleMemberIds.includes(id)
        );
        return (
          <Dialog
            onClose={this.handleCloseCreationDialog}
            open={this.state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>勤務表の追加</DialogTitle>
            <DialogContent className={this.props.classes.dialogTableContent}>
              <div className={this.props.classes.dialogTableWrapper}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell
                        size="small"
                        className={this.props.classes.leftTopHeaderCell}
                      >
                        \
                      </TableCell>
                      {newScheduleDateNames.map((date_name) => (
                        <TableCell
                          key={date_name}
                          size="small"
                          className={this.props.classes.topHeaderCell}
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
                            className={this.props.classes.leftHeaderCell}
                          >
                            {member.name}
                          </TableCell>
                          {newScheduleDateNames.map((date_name) => (
                            <TableCell size="small" key={date_name}>
                              {
                                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                this.props.all.kinmus.find(
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
              <Button color="primary" onClick={this.handleClickCreateSchedule}>
                追加
              </Button>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>
                閉じる
              </Button>
            </DialogActions>
          </Dialog>
        );
      }
      case UNSOLVED:
        return (
          <Dialog
            onClose={this.handleCloseCreationDialog}
            open={this.state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>勤務表の追加</DialogTitle>
            <DialogContent>
              <DialogContentText>
                勤務表を作成できませんでした
              </DialogContentText>
              {this.state.dialogState.errorMessage === "Infeasible" ? (
                <>
                  <Typography>条件を満たす勤務表が存在しません</Typography>
                  <Button size="small" onClick={this.handleClickPursue}>
                    勤務表を作成できない原因となる条件を特定
                  </Button>
                </>
              ) : (
                <Typography>
                  pulp-schedulingの不具合や条件の誤りなどにより作成できない可能性があります（
                  {this.state.dialogState.errorMessage}）
                </Typography>
              )}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>
                閉じる
              </Button>
            </DialogActions>
          </Dialog>
        );
      case PURSUE_IN_PROGRESS:
        return (
          <Dialog
            open={this.state.creationDialogIsOpen}
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
        const constraint = this.state.dialogState.constraint;
        const constraintText = (() => {
          switch (constraint.type) {
            case "Constraint0": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint0 = this.props.all.constraints0.find(
                ({ id }) => id === constraint.id
              )!;
              const constraint0Constraint0Kinmus =
                this.props.all.constraint0_kinmus
                  .filter(
                    ({ constraint0_id }) => constraint0_id === constraint0.id
                  )
                  .sort((a, b) => a.sequence_number - b.sequence_number);
              const constraint0Constraint0KinmuKinmus =
                constraint0Constraint0Kinmus.map(
                  ({ kinmu_id }) =>
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    this.props.all.kinmus.find(
                      (kinmu) => kinmu.id === kinmu_id
                    )!
                );
              return constraint0Constraint0KinmuKinmus
                .map((kinmu) => kinmu.name)
                .join(", ");
            }
            case "Constraint1": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint1 = this.props.all.constraints1.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint1Kinmu = this.props.all.kinmus.find(
                ({ id }) => id === constraint1.kinmu_id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint1Group = this.props.all.groups.find(
                ({ id }) => id === constraint1.group_id
              )!;
              return `${constraint1.start_date_name}から${constraint1.stop_date_name}までの${constraint1Kinmu.name}に${constraint1Group.name}から${constraint1.min_number_of_assignments}人以上の職員を割り当てる`;
            }
            case "Constraint2": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint2 = this.props.all.constraints2.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint2Kinmu = this.props.all.kinmus.find(
                ({ id }) => id === constraint2.kinmu_id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint2Group = this.props.all.groups.find(
                ({ id }) => id === constraint2.group_id
              )!;
              return `${constraint2.start_date_name}から${constraint2.stop_date_name}までの${constraint2Kinmu.name}に${constraint2Group.name}から${constraint2.max_number_of_assignments}人以下の職員を割り当てる`;
            }
            case "Constraint3": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint3 = this.props.all.constraints3.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint3Member = this.props.all.members.find(
                ({ id }) => id === constraint3.member_id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint3Kinmu = this.props.all.kinmus.find(
                ({ id }) => id === constraint3.kinmu_id
              )!;
              return `${constraint3Member.name}に${constraint3Kinmu.name}を${constraint3.min_number_of_assignments}回以上割り当てる`;
            }
            case "Constraint4": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint4 = this.props.all.constraints4.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint4Member = this.props.all.members.find(
                ({ id }) => id === constraint4.member_id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint4Kinmu = this.props.all.kinmus.find(
                ({ id }) => id === constraint4.kinmu_id
              )!;
              return `${constraint4Member.name}に${constraint4Kinmu.name}を${constraint4.max_number_of_assignments}回以下割り当てる`;
            }
            case "Constraint5": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint5 = this.props.all.constraints5.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint5Kinmu = this.props.all.kinmus.find(
                ({ id }) => id === constraint5.kinmu_id
              )!;
              return `${constraint5Kinmu.name}の連続日数を${constraint5.min_number_of_days}日以上にする`;
            }
            case "Constraint6": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint6 = this.props.all.constraints6.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint6Kinmu = this.props.all.kinmus.find(
                ({ id }) => id === constraint6.kinmu_id
              )!;
              return `${constraint6Kinmu.name}の連続日数を${constraint6.max_number_of_days}日以下にする`;
            }
            case "Constraint7": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint7 = this.props.all.constraints7.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint7Kinmu = this.props.all.kinmus.find(
                ({ id }) => id === constraint7.kinmu_id
              )!;
              return `${constraint7Kinmu.name}の間隔日数を${constraint7.min_number_of_days}日以上にする`;
            }
            case "Constraint8": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint8 = this.props.all.constraints8.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint8Kinmu = this.props.all.kinmus.find(
                ({ id }) => id === constraint8.kinmu_id
              )!;
              return `${constraint8Kinmu.name}の間隔日数を${constraint8.max_number_of_days}日以下にする`;
            }
            case "Constraint9": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint9 = this.props.all.constraints9.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint9Member = this.props.all.members.find(
                ({ id }) => id === constraint9.member_id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint9Kinmu = this.props.all.kinmus.find(
                ({ id }) => id === constraint9.kinmu_id
              )!;
              return `${constraint9Member.name}の${constraint9.start_date_name}から${constraint9.stop_date_name}までに${constraint9Kinmu.name}を割り当てる`;
            }
            case "Constraint10": {
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint10 = this.props.all.constraints10.find(
                ({ id }) => id === constraint.id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint10Member = this.props.all.members.find(
                ({ id }) => id === constraint10.member_id
              )!;
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              const constraint10Kinmu = this.props.all.kinmus.find(
                ({ id }) => id === constraint10.kinmu_id
              )!;
              return `${constraint10Member.name}の${constraint10.start_date_name}から${constraint10.stop_date_name}までに${constraint10Kinmu.name}を割り当てない`;
            }
          }
          return "";
        })();
        return (
          <Dialog
            onClose={this.handleCloseCreationDialog}
            open={this.state.creationDialogIsOpen}
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
              <Button color="primary" onClick={this.handleCloseCreationDialog}>
                閉じる
              </Button>
            </DialogActions>
          </Dialog>
        );
      }
      case UNPURSUED:
        return (
          <Dialog
            onClose={this.handleCloseCreationDialog}
            open={this.state.creationDialogIsOpen}
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
                {this.state.dialogState.errorMessage}）
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>
                閉じる
              </Button>
            </DialogActions>
          </Dialog>
        );
    }
  };
  public render() {
    const dialog = this.dialog();
    return (
      <>
        <div className={this.props.classes.gridFrame}>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <Toolbar>
                <Typography
                  variant="subtitle1"
                  className={this.props.classes.toolbarTitle}
                >
                  勤務表
                </Typography>
                <Button
                  size="small"
                  onClick={this.handleClickOpenCreationDialog}
                >
                  追加
                </Button>
              </Toolbar>
            </Grid>
            {this.props.all.schedules.map((schedule) => (
              <Grid key={schedule.id} item={true} xs={12}>
                <Schedule schedule={schedule} />
              </Grid>
            ))}
          </Grid>
        </div>
        {dialog}
      </>
    );
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    all: state.present,
  };
}

const styles = createStyles({
  dialogTableContent: {
    display: "flex",
  },
  dialogTableWrapper: {
    overflow: "auto",
  },
  gridFrame: {
    padding: 8,
  },
  leftHeaderCell: {
    background: "white",
    left: 0,
    position: "sticky",
  },
  leftTopHeaderCell: {
    background: "white",
    left: 0,
    position: "sticky",
    top: 0,
    zIndex: 2,
  },
  toolbarTitle: {
    flex: 1,
  },
  topHeaderCell: {
    background: "white",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
});

export default withStyles(styles)(connect(mapStateToProps)(Schedules));
