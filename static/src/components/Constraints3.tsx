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
import * as constraints3 from "../modules/constraints3";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import Constraint3 from "./Constraint3";

type Props = {
  dispatch: Dispatch;
  constraints3: constraints3.Constraint3[];
  members: members.Member[];
  kinmus: kinmus.Kinmu[];
} & WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint3IsEnabled: boolean;
  newConstraint3MemberId: number;
  newConstraint3KinmuId: number;
  newConstraint3MinNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint3MinNumberOfAssignments: string[];
};

class Constraints3 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    newConstraint3IsEnabled: true,
    newConstraint3KinmuId:
      this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newConstraint3MemberId:
      this.props.members.length > 0 ? this.props.members[0].id : 0,
    newConstraint3MinNumberOfAssignments:
      constraints3.minOfConstraint3MinNumberOfAssignments,
  };
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true });
  };
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false });
  };
  public handleChangeNewConstraint3IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.setState({ newConstraint3IsEnabled: checked });
  };
  public handleChangeNewConstraint3MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint3MemberId: parseInt(event.target.value, 10) });
  };
  public handleChangeNewConstraint3KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint3KinmuId: parseInt(event.target.value, 10) });
  };
  public validate(newConstraint3MinNumberOfAssignments: number): ErrorMessages {
    const errorMessages: ErrorMessages = {
      newConstraint3MinNumberOfAssignments: [],
    };
    if (isNaN(newConstraint3MinNumberOfAssignments)) {
      errorMessages.newConstraint3MinNumberOfAssignments.push(
        "割り当て数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  }
  public handleChangeNewConstraint3MinNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      newConstraint3MinNumberOfAssignments: parseInt(event.target.value, 10),
    });
  };
  public handleClickCreateConstraint3 = () => {
    this.setState({ creationDialogIsOpen: false });
    this.props.dispatch(
      constraints3.createConstraint3(
        this.state.newConstraint3IsEnabled,
        this.state.newConstraint3MemberId,
        this.state.newConstraint3KinmuId,
        this.state.newConstraint3MinNumberOfAssignments
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
                  職員の勤務の割り当て数の下限
                </Typography>
                <Button
                  size="small"
                  onClick={this.handleClickOpenCreationDialog}
                >
                  追加
                </Button>
              </Toolbar>
            </Grid>
            {this.props.constraints3.map((c) => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint3 constraint3={c} />
              </Grid>
            ))}
          </Grid>
        </div>
        {this.props.members.length === 0 || this.props.kinmus.length === 0 ? (
          <Dialog
            onClose={this.handleCloseCreationDialog}
            open={this.state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>
              職員の勤務の割り当て数の下限を追加できません
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
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const newConstraint3Member = this.props.members.find(
              ({ id }) => id === this.state.newConstraint3MemberId
            )!;
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            const newConstraint3Kinmu = this.props.kinmus.find(
              ({ id }) => id === this.state.newConstraint3KinmuId
            )!;
            const relativesAreEnabled =
              newConstraint3Member.is_enabled && newConstraint3Kinmu.is_enabled;
            const errorMessages = this.validate(
              this.state.newConstraint3MinNumberOfAssignments
            );
            return (
              <Dialog
                onClose={this.handleCloseCreationDialog}
                open={this.state.creationDialogIsOpen}
                fullWidth={true}
                maxWidth="md"
              >
                <DialogTitle>職員の勤務の割り当て数の下限の追加</DialogTitle>
                <DialogContent>
                  <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              this.state.newConstraint3IsEnabled &&
                              relativesAreEnabled
                            }
                            disabled={!relativesAreEnabled}
                            onChange={this.handleChangeNewConstraint3IsEnabled}
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
                        value={this.state.newConstraint3MemberId}
                        onChange={this.handleChangeNewConstraint3MemberId}
                        fullWidth={true}
                      >
                        {this.props.members.map((member) => (
                          <MenuItem key={member.id} value={member.id}>
                            {
                              <span
                                className={classnames({
                                  [this.props.classes.lineThrough]:
                                    !member.is_enabled,
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
                        select={true}
                        label="勤務"
                        value={this.state.newConstraint3KinmuId}
                        onChange={this.handleChangeNewConstraint3KinmuId}
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
                        label="割り当て数下限"
                        type="number"
                        defaultValue={
                          this.state.newConstraint3MinNumberOfAssignments
                        }
                        onChange={
                          this.handleChangeNewConstraint3MinNumberOfAssignments
                        }
                        fullWidth={true}
                        inputProps={{
                          min: constraints3.minOfConstraint3MinNumberOfAssignments,
                        }}
                        error={
                          errorMessages.newConstraint3MinNumberOfAssignments
                            .length > 0
                        }
                        FormHelperTextProps={{
                          // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint3MinNumberOfAssignments.map(
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
                    onClick={this.handleClickCreateConstraint3}
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
    constraints3: state.present.constraints3,
    kinmus: state.present.kinmus,
    members: state.present.members,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraints3));
