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
import * as constraints10 from "../modules/constraints10";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import * as terms from "../modules/terms";
import * as utils from "../utils";
import Constraint10 from "./Constraint10";

type Props = {
  dispatch: Dispatch;
  constraints10: constraints10.Constraint10[];
  members: members.Member[];
  terms: terms.Term[];
  kinmus: kinmus.Kinmu[];
} & WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint10IsEnabled: boolean;
  newConstraint10MemberId: number;
  newConstraint10StartDateName: string;
  newConstraint10StopDateName: string;
  newConstraint10KinmuId: number;
};

type ErrorMessages = {
  newConstraint10StartDateName: string[];
  newConstraint10StopDateName: string[];
};

class Constraints10 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    const todayString = utils.dateToString(new Date());
    this.state = {
      creationDialogIsOpen: false,
      newConstraint10IsEnabled: true,
      newConstraint10KinmuId:
        this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
      newConstraint10MemberId:
        this.props.members.length > 0 ? this.props.members[0].id : 0,
      newConstraint10StartDateName: todayString,
      newConstraint10StopDateName: todayString,
    };
  }
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true });
  };
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false });
  };
  public handleChangeNewConstraint10IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.setState({ newConstraint10IsEnabled: checked });
  };
  public handleChangeNewConstraint10MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      newConstraint10MemberId: parseInt(event.target.value, 10),
    });
  };
  public validate(
    newConstraint10StartDateName: string,
    newConstraint10StopDateName: string
  ): ErrorMessages {
    const errorMessages: ErrorMessages = {
      newConstraint10StartDateName: [],
      newConstraint10StopDateName: [],
    };
    if (!utils.stringToDate(newConstraint10StartDateName)) {
      errorMessages.newConstraint10StartDateName.push(
        "開始日の形式が正しくありません"
      );
    }
    if (!utils.stringToDate(newConstraint10StopDateName)) {
      errorMessages.newConstraint10StopDateName.push(
        "終了日の形式が正しくありません"
      );
    }
    return errorMessages;
  }
  public handleChangeNewConstraint10StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint10StartDateName: event.target.value });
  };
  public handleChangeNewConstraint10StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint10StopDateName: event.target.value });
  };
  public handleChangeNewConstraint10KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint10KinmuId: parseInt(event.target.value, 10) });
  };
  public handleClickCreateConstraint10 = () => {
    this.setState({ creationDialogIsOpen: false });
    this.props.dispatch(
      constraints10.createConstraint10(
        this.state.newConstraint10IsEnabled,
        this.state.newConstraint10MemberId,
        this.state.newConstraint10StartDateName,
        this.state.newConstraint10StopDateName,
        this.state.newConstraint10KinmuId
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
                  職員の期間に割り当てない勤務
                </Typography>
                <Button
                  size="small"
                  onClick={this.handleClickOpenCreationDialog}
                >
                  追加
                </Button>
              </Toolbar>
            </Grid>
            {this.props.constraints10.map((c) => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint10 constraint10={c} />
              </Grid>
            ))}
          </Grid>
        </div>
        {this.props.members.length === 0 && this.props.kinmus.length === 0 ? (
          <Dialog
            onClose={this.handleCloseCreationDialog}
            open={this.state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>
              職員の期間に割り当てない勤務を追加できません
            </DialogTitle>
            <DialogContent>
              {this.props.members.length === 0 ? (
                <DialogContentText>職員がいません</DialogContentText>
              ) : null}
              {this.props.kinmus.length === 0 ? (
                <DialogContentText>勤務がありません</DialogContentText>
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
            const newConstraint10Member = this.props.members.find(
              ({ id }) => id === this.state.newConstraint10MemberId
            )!;
            const newConstraint10StartDate = utils.stringToDate(
              this.state.newConstraint10StartDateName
            );
            const newConstraint10StartDateIsEnabled = newConstraint10StartDate
              ? this.props.terms.every(({ start_date_name }) => {
                  const startDate = utils.stringToDate(start_date_name);
                  if (!startDate) {
                    return false;
                  }
                  return startDate <= newConstraint10StartDate;
                })
              : false;
            const newConstraint10StopDate = utils.stringToDate(
              this.state.newConstraint10StopDateName
            );
            const newConstraint10StopDateIsEnabled = newConstraint10StopDate
              ? this.props.terms.every(({ stop_date_name }) => {
                  const stopDate = utils.stringToDate(stop_date_name);
                  if (!stopDate) {
                    return false;
                  }
                  return stopDate >= newConstraint10StopDate;
                })
              : false;
            const newConstraint10Kinmu = this.props.kinmus.find(
              ({ id }) => id === this.state.newConstraint10KinmuId
            )!;
            const relativesAreEnabled =
              newConstraint10Member.is_enabled &&
              newConstraint10StartDateIsEnabled &&
              newConstraint10StopDateIsEnabled &&
              newConstraint10Kinmu.is_enabled;
            const errorMessages = this.validate(
              this.state.newConstraint10StartDateName,
              this.state.newConstraint10StopDateName
            );
            return (
              <Dialog
                onClose={this.handleCloseCreationDialog}
                open={this.state.creationDialogIsOpen}
                fullWidth={true}
                maxWidth="md"
              >
                <DialogTitle>職員の期間に割り当てない勤務の追加</DialogTitle>
                <DialogContent>
                  <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              this.state.newConstraint10IsEnabled &&
                              relativesAreEnabled
                            }
                            disabled={!relativesAreEnabled}
                            onChange={this.handleChangeNewConstraint10IsEnabled}
                            color="primary"
                          />
                        }
                        label="有効"
                      />
                    </Grid>
                    <Grid item={true} xs={12}>
                      <TextField
                        select={true}
                        label="職員"
                        value={this.state.newConstraint10MemberId}
                        onChange={this.handleChangeNewConstraint10MemberId}
                        fullWidth={true}
                      >
                        {this.props.members.map((member) => (
                          <MenuItem key={member.id} value={member.id}>
                            {
                              <span
                                className={classnames({
                                  [this.props.classes
                                    .lineThrough]: !member.is_enabled,
                                })}
                              >
                                {member.name}
                              </span>
                            }
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                    <Grid item={true} xs={12}>
                      <TextField
                        label="開始日"
                        type="date"
                        defaultValue={this.state.newConstraint10StartDateName}
                        onChange={this.handleChangeNewConstraint10StartDateName}
                        fullWidth={true}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          className: classnames({
                            [this.props.classes
                              .lineThrough]: !newConstraint10StartDateIsEnabled,
                          }),
                        }}
                        error={
                          errorMessages.newConstraint10StartDateName.length > 0
                        }
                        FormHelperTextProps={{
                          // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint10StartDateName.map(
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
                        defaultValue={this.state.newConstraint10StopDateName}
                        onChange={this.handleChangeNewConstraint10StopDateName}
                        fullWidth={true}
                        InputLabelProps={{
                          shrink: true,
                        }}
                        inputProps={{
                          className: classnames({
                            [this.props.classes
                              .lineThrough]: !newConstraint10StopDateIsEnabled,
                          }),
                        }}
                        error={
                          errorMessages.newConstraint10StopDateName.length > 0
                        }
                        FormHelperTextProps={{
                          // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint10StopDateName.map(
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
                        value={this.state.newConstraint10KinmuId}
                        onChange={this.handleChangeNewConstraint10KinmuId}
                        fullWidth={true}
                      >
                        {this.props.kinmus.map((kinmu) => (
                          <MenuItem key={kinmu.id} value={kinmu.id}>
                            {
                              <span
                                className={classnames({
                                  [this.props.classes
                                    .lineThrough]: !kinmu.is_enabled,
                                })}
                              >
                                {kinmu.name}
                              </span>
                            }
                          </MenuItem>
                        ))}
                      </TextField>
                    </Grid>
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    color="primary"
                    disabled={Object.values(errorMessages).some(
                      (messages) => messages.length > 0
                    )}
                    onClick={this.handleClickCreateConstraint10}
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
    constraints10: state.present.constraints10,
    kinmus: state.present.kinmus,
    members: state.present.members,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraints10));
