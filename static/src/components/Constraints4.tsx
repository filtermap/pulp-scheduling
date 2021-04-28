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
import * as constraints4 from "../modules/constraints4";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import Constraint4 from "./Constraint4";

type Props = {
  dispatch: Dispatch;
  constraints4: constraints4.Constraint4[];
  members: members.Member[];
  kinmus: kinmus.Kinmu[];
} & WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint4IsEnabled: boolean;
  newConstraint4MemberId: number;
  newConstraint4KinmuId: number;
  newConstraint4MaxNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint4MaxNumberOfAssignments: string[];
};

class Constraints4 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    newConstraint4IsEnabled: true,
    newConstraint4KinmuId:
      this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newConstraint4MaxNumberOfAssignments:
      constraints4.minOfConstraint4MaxNumberOfAssignments,
    newConstraint4MemberId:
      this.props.members.length > 0 ? this.props.members[0].id : 0,
  };
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true });
  };
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false });
  };
  public handleChangeNewConstraint4IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.setState({ newConstraint4IsEnabled: checked });
  };
  public handleChangeNewConstraint4MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint4MemberId: parseInt(event.target.value, 10) });
  };
  public handleChangeNewConstraint4KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint4KinmuId: parseInt(event.target.value, 10) });
  };
  public validate(newConstraint4MaxNumberOfAssignments: number): ErrorMessages {
    const errorMessages: ErrorMessages = {
      newConstraint4MaxNumberOfAssignments: [],
    };
    if (isNaN(newConstraint4MaxNumberOfAssignments)) {
      errorMessages.newConstraint4MaxNumberOfAssignments.push(
        "割り当て数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  }
  public handleChangeNewConstraint4MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      newConstraint4MaxNumberOfAssignments: parseInt(event.target.value, 10),
    });
  };
  public handleClickCreateConstraint4 = () => {
    this.setState({ creationDialogIsOpen: false });
    this.props.dispatch(
      constraints4.createConstraint4(
        this.state.newConstraint4IsEnabled,
        this.state.newConstraint4MemberId,
        this.state.newConstraint4KinmuId,
        this.state.newConstraint4MaxNumberOfAssignments
      )
    );
  };
  public render() {
    return (
      <>
        <div className={this.props.classes.gridFrame}>
          <Grid container={true} spacing={8}>
            <Grid item={true} xs={12}>
              <Toolbar>
                <Typography
                  variant="subtitle1"
                  className={this.props.classes.toolbarTitle}
                >
                  職員の勤務の割り当て数の上限
                </Typography>
                <Button
                  size="small"
                  onClick={this.handleClickOpenCreationDialog}
                >
                  追加
                </Button>
              </Toolbar>
            </Grid>
            {this.props.constraints4.map((c) => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint4 constraint4={c} />
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
              職員の勤務の割り当て数の上限を追加できません
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
            const newConstraint4Member = this.props.members.find(
              ({ id }) => id === this.state.newConstraint4MemberId
            )!;
            const newConstraint4Kinmu = this.props.kinmus.find(
              ({ id }) => id === this.state.newConstraint4KinmuId
            )!;
            const relativesAreEnabled =
              newConstraint4Member.is_enabled && newConstraint4Kinmu.is_enabled;
            const errorMessages = this.validate(
              this.state.newConstraint4MaxNumberOfAssignments
            );
            return (
              <Dialog
                onClose={this.handleCloseCreationDialog}
                open={this.state.creationDialogIsOpen}
                fullWidth={true}
                maxWidth="md"
              >
                <DialogTitle>職員の勤務の割り当て数の上限の追加</DialogTitle>
                <DialogContent>
                  <Grid container={true} spacing={8}>
                    <Grid item={true} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              this.state.newConstraint4IsEnabled &&
                              relativesAreEnabled
                            }
                            disabled={!relativesAreEnabled}
                            onChange={this.handleChangeNewConstraint4IsEnabled}
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
                        value={this.state.newConstraint4MemberId}
                        onChange={this.handleChangeNewConstraint4MemberId}
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
                        select={true}
                        label="勤務"
                        value={this.state.newConstraint4KinmuId}
                        onChange={this.handleChangeNewConstraint4KinmuId}
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
                    <Grid item={true} xs={12}>
                      <TextField
                        label="割り当て数上限"
                        type="number"
                        defaultValue={
                          this.state.newConstraint4MaxNumberOfAssignments
                        }
                        onChange={
                          this.handleChangeNewConstraint4MaxNumberOfAssignments
                        }
                        fullWidth={true}
                        inputProps={{
                          min:
                            constraints4.minOfConstraint4MaxNumberOfAssignments,
                        }}
                        error={
                          errorMessages.newConstraint4MaxNumberOfAssignments
                            .length > 0
                        }
                        FormHelperTextProps={{
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint4MaxNumberOfAssignments.map(
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
                    onClick={this.handleClickCreateConstraint4}
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
    constraints4: state.present.constraints4,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraints4));
