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
import * as constraints6 from "../modules/constraints6";
import * as kinmus from "../modules/kinmus";
import Constraint6 from "./Constraint6";

type Props = {
  dispatch: Dispatch;
  constraints6: constraints6.Constraint6[];
  kinmus: kinmus.Kinmu[];
} & WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint6IsEnabled: boolean;
  newConstraint6KinmuId: number;
  newConstraint6MaxNumberOfDays: number;
};

type ErrorMessages = {
  newConstraint6MaxNumberOfDays: string[];
};

class Constraints6 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    newConstraint6IsEnabled: true,
    newConstraint6KinmuId:
      this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newConstraint6MaxNumberOfDays: constraints6.minOfConstraint6MaxNumberOfDays,
  };
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true });
  };
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false });
  };
  public handleChangeNewConstraint6IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.setState({ newConstraint6IsEnabled: checked });
  };
  public handleChangeNewConstraint6KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint6KinmuId: parseInt(event.target.value, 10) });
  };
  public validate(newConstraint6MaxNumberOfDays: number): ErrorMessages {
    const errorMessages: ErrorMessages = {
      newConstraint6MaxNumberOfDays: [],
    };
    if (isNaN(newConstraint6MaxNumberOfDays)) {
      errorMessages.newConstraint6MaxNumberOfDays.push(
        "連続日数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  }
  public handleChangeNewConstraint6MaxNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      newConstraint6MaxNumberOfDays: parseInt(event.target.value, 10),
    });
  };
  public handleClickCreateConstraint6 = () => {
    this.setState({ creationDialogIsOpen: false });
    this.props.dispatch(
      constraints6.createConstraint6(
        this.state.newConstraint6IsEnabled,
        this.state.newConstraint6KinmuId,
        this.state.newConstraint6MaxNumberOfDays
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
                  variant="subheading"
                  className={this.props.classes.toolbarTitle}
                >
                  勤務の連続日数の上限
                </Typography>
                <Button
                  size="small"
                  onClick={this.handleClickOpenCreationDialog}
                >
                  追加
                </Button>
              </Toolbar>
            </Grid>
            {this.props.constraints6.map((c) => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint6 constraint6={c} />
              </Grid>
            ))}
          </Grid>
        </div>
        {this.props.kinmus.length === 0 ? (
          <Dialog
            onClose={this.handleCloseCreationDialog}
            open={this.state.creationDialogIsOpen}
            fullWidth={true}
            maxWidth="md"
          >
            <DialogTitle>勤務の連続日数の上限を追加できません</DialogTitle>
            <DialogContent>
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
            const newConstraint6Kinmu = this.props.kinmus.find(
              ({ id }) => id === this.state.newConstraint6KinmuId
            )!;
            const relativesAreEnabled = newConstraint6Kinmu.is_enabled;
            const errorMessages = this.validate(
              this.state.newConstraint6MaxNumberOfDays
            );
            return (
              <Dialog
                onClose={this.handleCloseCreationDialog}
                open={this.state.creationDialogIsOpen}
                fullWidth={true}
                maxWidth="md"
              >
                <DialogTitle>勤務の連続日数の上限の追加</DialogTitle>
                <DialogContent>
                  <Grid container={true} spacing={8}>
                    <Grid item={true} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              this.state.newConstraint6IsEnabled &&
                              relativesAreEnabled
                            }
                            disabled={!relativesAreEnabled}
                            onChange={this.handleChangeNewConstraint6IsEnabled}
                            color="primary"
                          />
                        }
                        label="有効"
                      />
                    </Grid>
                    <Grid item={true} xs={12}>
                      <TextField
                        select={true}
                        label="勤務"
                        value={this.state.newConstraint6KinmuId}
                        onChange={this.handleChangeNewConstraint6KinmuId}
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
                        label="連続日数上限"
                        type="number"
                        defaultValue={this.state.newConstraint6MaxNumberOfDays}
                        onChange={
                          this.handleChangeNewConstraint6MaxNumberOfDays
                        }
                        fullWidth={true}
                        inputProps={{
                          min: constraints6.minOfConstraint6MaxNumberOfDays,
                        }}
                        error={
                          errorMessages.newConstraint6MaxNumberOfDays.length > 0
                        }
                        FormHelperTextProps={{
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint6MaxNumberOfDays.map(
                          (messages) => (
                            <div key={messages}>{messages}</div>
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
                    onClick={this.handleClickCreateConstraint6}
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
    constraints6: state.present.constraints6,
    kinmus: state.present.kinmus,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraints6));
