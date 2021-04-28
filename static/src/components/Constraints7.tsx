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
import * as constraints7 from "../modules/constraints7";
import * as kinmus from "../modules/kinmus";
import Constraint7 from "./Constraint7";

type Props = {
  dispatch: Dispatch;
  constraints7: constraints7.Constraint7[];
  kinmus: kinmus.Kinmu[];
} & WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint7IsEnabled: boolean;
  newConstraint7KinmuId: number;
  newConstraint7MinNumberOfDays: number;
};

type ErrorMessages = {
  newConstraint7MinNumberOfDays: string[];
};

class Constraints7 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    newConstraint7IsEnabled: true,
    newConstraint7KinmuId:
      this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newConstraint7MinNumberOfDays: constraints7.minOfConstraint7MinNumberOfDays,
  };
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true });
  };
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false });
  };
  public handleChangeNewConstraint7IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.setState({ newConstraint7IsEnabled: checked });
  };
  public handleChangeNewConstraint7KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint7KinmuId: parseInt(event.target.value, 10) });
  };
  public validate(newConstraint7MinNumberOfDays: number): ErrorMessages {
    const errorMessages: ErrorMessages = {
      newConstraint7MinNumberOfDays: [],
    };
    if (isNaN(newConstraint7MinNumberOfDays)) {
      errorMessages.newConstraint7MinNumberOfDays.push(
        "間隔日数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  }
  public handleChangeNewConstraint7MinNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      newConstraint7MinNumberOfDays: parseInt(event.target.value, 10),
    });
  };
  public handleClickCreateConstraint7 = () => {
    this.setState({ creationDialogIsOpen: false });
    this.props.dispatch(
      constraints7.createConstraint7(
        this.state.newConstraint7IsEnabled,
        this.state.newConstraint7KinmuId,
        this.state.newConstraint7MinNumberOfDays
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
                  勤務の間隔日数の下限
                </Typography>
                <Button
                  size="small"
                  onClick={this.handleClickOpenCreationDialog}
                >
                  追加
                </Button>
              </Toolbar>
            </Grid>
            {this.props.constraints7.map((c) => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint7 constraint7={c} />
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
            <DialogTitle>勤務の間隔日数の下限を追加できません</DialogTitle>
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
            const newConstraint7Kinmu = this.props.kinmus.find(
              ({ id }) => id === this.state.newConstraint7KinmuId
            )!;
            const relativesAreEnabled = newConstraint7Kinmu.is_enabled;
            const errorMessages = this.validate(
              this.state.newConstraint7MinNumberOfDays
            );
            return (
              <Dialog
                onClose={this.handleCloseCreationDialog}
                open={this.state.creationDialogIsOpen}
                fullWidth={true}
                maxWidth="md"
              >
                <DialogTitle>勤務の間隔日数の下限の追加</DialogTitle>
                <DialogContent>
                  <Grid container={true} spacing={8}>
                    <Grid item={true} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              this.state.newConstraint7IsEnabled &&
                              relativesAreEnabled
                            }
                            disabled={!relativesAreEnabled}
                            onChange={this.handleChangeNewConstraint7IsEnabled}
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
                        value={this.state.newConstraint7KinmuId}
                        onChange={this.handleChangeNewConstraint7KinmuId}
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
                        label="間隔日数下限"
                        type="number"
                        defaultValue={this.state.newConstraint7MinNumberOfDays}
                        onChange={
                          this.handleChangeNewConstraint7MinNumberOfDays
                        }
                        fullWidth={true}
                        inputProps={{
                          min: constraints7.minOfConstraint7MinNumberOfDays,
                        }}
                        error={
                          errorMessages.newConstraint7MinNumberOfDays.length > 0
                        }
                        FormHelperTextProps={{
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint7MinNumberOfDays.map(
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
                    onClick={this.handleClickCreateConstraint7}
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
    constraints7: state.present.constraints7,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraints7));
