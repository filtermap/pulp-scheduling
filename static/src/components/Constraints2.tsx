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
import * as constraints2 from "../modules/constraints2";
import * as groups from "../modules/groups";
import * as kinmus from "../modules/kinmus";
import * as terms from "../modules/terms";
import * as utils from "../utils";
import Constraint2 from "./Constraint2";

type Props = {
  dispatch: Dispatch;
  constraints2: constraints2.Constraint2[];
  terms: terms.Term[];
  kinmus: kinmus.Kinmu[];
  groups: groups.Group[];
} & WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint2IsEnabled: boolean;
  newConstraint2StartDateName: string;
  newConstraint2StopDateName: string;
  newConstraint2KinmuId: number;
  newConstraint2GroupId: number;
  newConstraint2MaxNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint2StartDateName: string[];
  newConstraint2StopDateName: string[];
  newConstraint2MaxNumberOfAssignments: string[];
};

class Constraints2 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const todayString = utils.dateToString(new Date());
    this.state = {
      creationDialogIsOpen: false,
      newConstraint2GroupId:
        this.props.groups.length > 0 ? this.props.groups[0].id : 0,
      newConstraint2IsEnabled: true,
      newConstraint2KinmuId:
        this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newConstraint2MaxNumberOfAssignments:
        constraints2.minOfConstraint2MaxNumberOfAssignments,
      newConstraint2StartDateName: todayString,
      newConstraint2StopDateName: todayString,
    };
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true });
  };
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false });
  };
  public validate(
    newConstraint2StartDateName: string,
    newConstraint2StopDateName: string,
    newConstraint2MaxNumberOfAssignments: number
  ): ErrorMessages {
    const errorMessages: ErrorMessages = {
      newConstraint2MaxNumberOfAssignments: [],
      newConstraint2StartDateName: [],
      newConstraint2StopDateName: [],
    };
    if (!utils.stringToDate(newConstraint2StartDateName)) {
      errorMessages.newConstraint2StartDateName.push(
        "開始日の形式が正しくありません"
      );
    }
    if (!utils.stringToDate(newConstraint2StopDateName)) {
      errorMessages.newConstraint2StopDateName.push(
        "終了日の形式が正しくありません"
      );
    }
    if (isNaN(newConstraint2MaxNumberOfAssignments)) {
      errorMessages.newConstraint2MaxNumberOfAssignments.push(
        "割り当て職員数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  }
  public handleChangeNewConstraint2IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.setState({ newConstraint2IsEnabled: checked });
  };
  public handleChangeNewConstraint2StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint2StartDateName: event.target.value });
  };
  public handleChangeNewConstraint2StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint2StopDateName: event.target.value });
  };
  public handleChangeNewConstraint2KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint2KinmuId: parseInt(event.target.value, 10) });
  };
  public handleChangeNewConstraint2GroupId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint2GroupId: parseInt(event.target.value, 10) });
  };
  public handleChangeNewConstraint2MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      newConstraint2MaxNumberOfAssignments: parseInt(event.target.value, 10),
    });
  };
  public handleClickCreateConstraint2 = () => {
    this.setState({ creationDialogIsOpen: false });
    this.props.dispatch(
      constraints2.createConstraint2(
        this.state.newConstraint2IsEnabled,
        this.state.newConstraint2StartDateName,
        this.state.newConstraint2StopDateName,
        this.state.newConstraint2KinmuId,
        this.state.newConstraint2GroupId,
        this.state.newConstraint2MaxNumberOfAssignments
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
                  期間の勤務にグループから割り当てる職員数の上限
                </Typography>
                <Button
                  size="small"
                  onClick={this.handleClickOpenCreationDialog}
                >
                  追加
                </Button>
              </Toolbar>
            </Grid>
            {this.props.constraints2.map((c) => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint2 constraint2={c} />
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
              期間の勤務にグループから割り当てる職員数の上限を追加できません
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
            const newConstraint2StartDate = utils.stringToDate(
              this.state.newConstraint2StartDateName
            );
            const newConstraint2StartDateIsEnabled = newConstraint2StartDate
              ? this.props.terms.every(({ start_date_name }) => {
                  const startDate = utils.stringToDate(start_date_name);
                  if (!startDate) {
                    return false;
                  }
                  return startDate <= newConstraint2StartDate;
                })
              : false;
            const newConstraint2StopDate = utils.stringToDate(
              this.state.newConstraint2StopDateName
            );
            const newConstraint2StopDateIsEnabled = newConstraint2StopDate
              ? this.props.terms.every(({ stop_date_name }) => {
                  const stopDate = utils.stringToDate(stop_date_name);
                  if (!stopDate) {
                    return false;
                  }
                  return stopDate >= newConstraint2StopDate;
                })
              : false;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const newConstraint2Kinmu = this.props.kinmus.find(
              ({ id }) => id === this.state.newConstraint2KinmuId
            )!;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const newConstraint2Group = this.props.groups.find(
              ({ id }) => id === this.state.newConstraint2GroupId
            )!;
            const relativesAreEnabled =
              newConstraint2StartDateIsEnabled &&
              newConstraint2StopDateIsEnabled &&
              newConstraint2Kinmu.is_enabled &&
              newConstraint2Group.is_enabled;
            const errorMessages = this.validate(
              this.state.newConstraint2StartDateName,
              this.state.newConstraint2StopDateName,
              this.state.newConstraint2MaxNumberOfAssignments
            );
            return (
              <Dialog
                onClose={this.handleCloseCreationDialog}
                open={this.state.creationDialogIsOpen}
                fullWidth={true}
                maxWidth="md"
              >
                <DialogTitle>
                  期間の勤務にグループから割り当てる職員数の上限の追加
                </DialogTitle>
                <DialogContent>
                  <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              this.state.newConstraint2IsEnabled &&
                              relativesAreEnabled
                            }
                            disabled={!relativesAreEnabled}
                            onChange={this.handleChangeNewConstraint2IsEnabled}
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
                        defaultValue={this.state.newConstraint2StartDateName}
                        onChange={this.handleChangeNewConstraint2StartDateName}
                        fullWidth={true}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          className: classnames({
                            [this.props.classes.lineThrough]:
                              !newConstraint2StartDateIsEnabled,
                          }),
                        }}
                        error={
                          errorMessages.newConstraint2StartDateName.length > 0
                        }
                        FormHelperTextProps={{
                          // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint2StartDateName.map(
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
                        defaultValue={this.state.newConstraint2StopDateName}
                        onChange={this.handleChangeNewConstraint2StopDateName}
                        fullWidth={true}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          className: classnames({
                            [this.props.classes.lineThrough]:
                              !newConstraint2StopDateIsEnabled,
                          }),
                        }}
                        error={
                          errorMessages.newConstraint2StopDateName.length > 0
                        }
                        FormHelperTextProps={{
                          // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint2StopDateName.map(
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
                        value={this.state.newConstraint2KinmuId}
                        onChange={this.handleChangeNewConstraint2KinmuId}
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
                        value={this.state.newConstraint2GroupId}
                        onChange={this.handleChangeNewConstraint2GroupId}
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
                        label="割り当て職員数上限"
                        type="number"
                        defaultValue={
                          this.state.newConstraint2MaxNumberOfAssignments
                        }
                        onChange={
                          this.handleChangeNewConstraint2MaxNumberOfAssignments
                        }
                        fullWidth={true}
                        inputProps={{
                          min: constraints2.minOfConstraint2MaxNumberOfAssignments,
                        }}
                        error={
                          errorMessages.newConstraint2MaxNumberOfAssignments
                            .length > 0
                        }
                        FormHelperTextProps={{
                          // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint2MaxNumberOfAssignments.map(
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
                    onClick={this.handleClickCreateConstraint2}
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
    constraints2: state.present.constraints2,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraints2));
