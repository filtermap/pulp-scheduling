import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import { WithStyles } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import classnames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StateWithHistory } from "redux-undo";
import * as all from "../modules/all";
import * as constraints1 from "../modules/constraints1";
import * as groups from "../modules/groups";
import * as kinmus from "../modules/kinmus";
import * as terms from "../modules/terms";
import * as utils from "../utils";
import Constraint1 from "./Constraint1";

type Props = {
  dispatch: Dispatch;
  constraints1: constraints1.Constraint1[];
  terms: terms.Term[];
  kinmus: kinmus.Kinmu[];
  groups: groups.Group[];
} & WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint1IsEnabled: boolean;
  newConstraint1StartDateName: string;
  newConstraint1StopDateName: string;
  newConstraint1KinmuId: number;
  newConstraint1GroupId: number;
  newConstraint1MinNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint1StartDateName: string[];
  newConstraint1StopDateName: string[];
  newConstraint1MinNumberOfAssignments: string[];
};

class Constraints1 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const todayString = utils.dateToString(new Date());
    this.state = {
      creationDialogIsOpen: false,
      newConstraint1GroupId:
        this.props.groups.length > 0 ? this.props.groups[0].id : 0,
      newConstraint1IsEnabled: true,
      newConstraint1KinmuId:
        this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newConstraint1MinNumberOfAssignments:
        constraints1.minOfConstraint1MinNumberOfAssignments,
      newConstraint1StartDateName: todayString,
      newConstraint1StopDateName: todayString,
    };
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true });
  };
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false });
  };
  public handleChangeNewConstraint1IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.setState({ newConstraint1IsEnabled: checked });
  };
  public validate(
    newConstraint1StartDateName: string,
    newConstraint1StopDateName: string,
    newConstraint1MinNumberOfAssignments: number
  ): ErrorMessages {
    const errorMessages: ErrorMessages = {
      newConstraint1MinNumberOfAssignments: [],
      newConstraint1StartDateName: [],
      newConstraint1StopDateName: [],
    };
    if (!utils.stringToDate(newConstraint1StartDateName)) {
      errorMessages.newConstraint1StartDateName.push(
        "開始日の形式が正しくありません"
      );
    }
    if (!utils.stringToDate(newConstraint1StopDateName)) {
      errorMessages.newConstraint1StopDateName.push(
        "終了日の形式が正しくありません"
      );
    }
    if (isNaN(newConstraint1MinNumberOfAssignments)) {
      errorMessages.newConstraint1MinNumberOfAssignments.push(
        "割り当て職員数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  }
  public handleChangeNewConstraint1StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint1StartDateName: event.target.value });
  };
  public handleChangeNewConstraint1StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint1StopDateName: event.target.value });
  };
  public handleChangeNewConstraint1KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint1KinmuId: parseInt(event.target.value, 10) });
  };
  public handleChangeNewConstraint1GroupId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint1GroupId: parseInt(event.target.value, 10) });
  };
  public handleChangeNewConstraint1MinNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      newConstraint1MinNumberOfAssignments: parseInt(event.target.value, 10),
    });
  };
  public handleClickCreateConstraint1 = () => {
    this.setState({ creationDialogIsOpen: false });
    this.props.dispatch(
      constraints1.createConstraint1(
        this.state.newConstraint1IsEnabled,
        this.state.newConstraint1StartDateName,
        this.state.newConstraint1StopDateName,
        this.state.newConstraint1KinmuId,
        this.state.newConstraint1GroupId,
        this.state.newConstraint1MinNumberOfAssignments
      )
    );
  };
  public render() {
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
                  {" "}
                  期間の勤務にグループから割り当てる職員数の下限
                </Typography>
                <Button
                  size="small"
                  onClick={this.handleClickOpenCreationDialog}
                >
                  追加
                </Button>
              </Toolbar>
            </Grid>
            {this.props.constraints1.map((c) => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint1 constraint1={c} />
              </Grid>
            ))}
          </Grid>
        </div>
        {this.props.kinmus.length === 0 || this.props.groups.length === 0 ? (
          <Dialog
            onClose={this.handleCloseCreationDialog}
            open={this.state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>
              期間の勤務にグループから割り当てる職員数の下限を追加できません
            </DialogTitle>
            <DialogContent>
              {this.props.kinmus.length === 0 ? (
                <DialogContentText>勤務がありません</DialogContentText>
              ) : null}
              {this.props.groups.length === 0 ? (
                <DialogContentText>グループがありません</DialogContentText>
              ) : null}
            </DialogContent>
            <DialogActions>
              <Button color="primary" onClick={this.handleCloseCreationDialog}>
                閉じる
              </Button>
            </DialogActions>
          </Dialog>
        ) : (
          (() => {
            const newConstraint1StartDate = utils.stringToDate(
              this.state.newConstraint1StartDateName
            );
            const newConstraint1StartDateIsEnabled = newConstraint1StartDate
              ? this.props.terms.every(({ start_date_name }) => {
                  const startDate = utils.stringToDate(start_date_name);
                  if (!startDate) {
                    return false;
                  }
                  return startDate <= newConstraint1StartDate;
                })
              : false;
            const newConstraint1StopDate = utils.stringToDate(
              this.state.newConstraint1StopDateName
            );
            const newConstraint1StopDateIsEnabled = newConstraint1StopDate
              ? this.props.terms.every(({ stop_date_name }) => {
                  const stopDate = utils.stringToDate(stop_date_name);
                  if (!stopDate) {
                    return false;
                  }
                  return stopDate >= newConstraint1StopDate;
                })
              : false;
            const newConstraint1Kinmu = this.props.kinmus.find(
              ({ id }) => id === this.state.newConstraint1KinmuId
            )!;
            const newConstraint1Group = this.props.groups.find(
              ({ id }) => id === this.state.newConstraint1GroupId
            )!;
            const relativesAreEnabled =
              newConstraint1StartDateIsEnabled &&
              newConstraint1StopDateIsEnabled &&
              newConstraint1Kinmu.is_enabled &&
              newConstraint1Group.is_enabled;
            const errorMessages = this.validate(
              this.state.newConstraint1StartDateName,
              this.state.newConstraint1StopDateName,
              this.state.newConstraint1MinNumberOfAssignments
            );
            return (
              <Dialog
                onClose={this.handleCloseCreationDialog}
                open={this.state.creationDialogIsOpen}
                fullWidth={true}
                maxWidth="md"
              >
                <DialogTitle>
                  期間の勤務にグループから割り当てる職員数の下限の追加
                </DialogTitle>
                <DialogContent>
                  <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              this.state.newConstraint1IsEnabled &&
                              relativesAreEnabled
                            }
                            disabled={!relativesAreEnabled}
                            onChange={this.handleChangeNewConstraint1IsEnabled}
                            color="primary"
                          />
                        }
                        label="有効"
                      />
                    </Grid>
                    <Grid item={true} xs={12}>
                      <TextField
                        label="開始日"
                        type="date"
                        defaultValue={this.state.newConstraint1StartDateName}
                        onChange={this.handleChangeNewConstraint1StartDateName}
                        fullWidth={true}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          className: classnames({
                            [this.props.classes.lineThrough]:
                              !newConstraint1StartDateIsEnabled,
                          }),
                        }}
                        error={
                          errorMessages.newConstraint1StartDateName.length > 0
                        }
                        FormHelperTextProps={{
                          // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint1StartDateName.map(
                          (message) => (
                            <div key={message}>{message}</div>
                          )
                        )}
                      />
                    </Grid>
                    <Grid item={true} xs={12}>
                      <TextField
                        label="終了日"
                        type="date"
                        defaultValue={this.state.newConstraint1StopDateName}
                        onChange={this.handleChangeNewConstraint1StopDateName}
                        fullWidth={true}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          className: classnames({
                            [this.props.classes.lineThrough]:
                              !newConstraint1StopDateIsEnabled,
                          }),
                        }}
                        error={
                          errorMessages.newConstraint1StopDateName.length > 0
                        }
                        FormHelperTextProps={{
                          // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint1StopDateName.map(
                          (message) => (
                            <div key={message}>{message}</div>
                          )
                        )}
                      />
                    </Grid>
                    <Grid item={true} xs={12}>
                      <TextField
                        select={true}
                        label="勤務"
                        value={this.state.newConstraint1KinmuId}
                        onChange={this.handleChangeNewConstraint1KinmuId}
                        fullWidth={true}
                      >
                        {this.props.kinmus.map((kinmu) => (
                          <MenuItem key={kinmu.id} value={kinmu.id}>
                            {
                              <span
                                className={classnames({
                                  [this.props.classes.lineThrough]:
                                    !kinmu.is_enabled,
                                })}
                              >
                                {kinmu.name}
                              </span>
                            }
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item={true} xs={12}>
                      <TextField
                        select={true}
                        label="グループ"
                        value={this.state.newConstraint1GroupId}
                        onChange={this.handleChangeNewConstraint1GroupId}
                        fullWidth={true}
                      >
                        {this.props.groups.map((group) => (
                          <MenuItem key={group.id} value={group.id}>
                            {
                              <span
                                className={classnames({
                                  [this.props.classes.lineThrough]:
                                    !group.is_enabled,
                                })}
                              >
                                {group.name}
                              </span>
                            }
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item={true} xs={12}>
                      <TextField
                        label="割り当て職員数下限"
                        type="number"
                        defaultValue={
                          this.state.newConstraint1MinNumberOfAssignments
                        }
                        onChange={
                          this.handleChangeNewConstraint1MinNumberOfAssignments
                        }
                        fullWidth={true}
                        inputProps={{
                          min: constraints1.minOfConstraint1MinNumberOfAssignments,
                        }}
                        error={
                          errorMessages.newConstraint1MinNumberOfAssignments
                            .length > 0
                        }
                        FormHelperTextProps={{
                          // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint1MinNumberOfAssignments.map(
                          (message) => (
                            <div key={message}>{message}</div>
                          )
                        )}
                      />
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    color="primary"
                    disabled={Object.values(errorMessages).some(
                      (messages) => messages.length > 0
                    )}
                    onClick={this.handleClickCreateConstraint1}
                  >
                    追加
                  </Button>
                  <Button
                    color="primary"
                    onClick={this.handleCloseCreationDialog}
                  >
                    閉じる
                  </Button>
                </DialogActions>
              </Dialog>
            );
          })()
        )}
      </>
    );
  }
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    constraints1: state.present.constraints1,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
    terms: state.present.terms,
  };
}

const styles = createStyles({
  gridFrame: {
    padding: 8,
  },
  lineThrough: {
    "&::-webkit-datetime-edit-fields-wrapper": {
      textDecoration: "line-through",
    },
    textDecoration: "line-through",
  },
  toolbarTitle: {
    flex: 1,
  },
});

export default withStyles(styles)(connect(mapStateToProps)(Constraints1));
