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
import * as constraints8 from "../modules/constraints8";
import * as kinmus from "../modules/kinmus";
import Constraint8 from "./Constraint8";

type Props = {
  dispatch: Dispatch;
  constraints8: constraints8.Constraint8[];
  kinmus: kinmus.Kinmu[];
} & WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint8IsEnabled: boolean;
  newConstraint8KinmuId: number;
  newConstraint8MaxNumberOfDays: number;
};

type ErrorMessages = {
  newConstraint8MaxNumberOfDays: string[];
};

class Constraints8 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    newConstraint8IsEnabled: true,
    newConstraint8KinmuId:
      this.props.kinmus.length > 0 ? this.props.kinmus[0].id : 0,
    newConstraint8MaxNumberOfDays: constraints8.minOfConstraint8MaxNumberOfDays,
  };
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true });
  };
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false });
  };
  public handleChangeNewConstraint8IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.setState({ newConstraint8IsEnabled: checked });
  };
  public handleChangeNewConstraint8KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({ newConstraint8KinmuId: parseInt(event.target.value, 10) });
  };
  public validate(newConstraint8MaxNumberOfDays: number): ErrorMessages {
    const errorMessages: ErrorMessages = {
      newConstraint8MaxNumberOfDays: [],
    };
    if (isNaN(newConstraint8MaxNumberOfDays)) {
      errorMessages.newConstraint8MaxNumberOfDays.push(
        "間隔日数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  }
  public handleChangeNewConstraint8MaxNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.setState({
      newConstraint8MaxNumberOfDays: parseInt(event.target.value, 10),
    });
  };
  public handleClickCreateConstraint8 = () => {
    this.setState({ creationDialogIsOpen: false });
    this.props.dispatch(
      constraints8.createConstraint8(
        this.state.newConstraint8IsEnabled,
        this.state.newConstraint8KinmuId,
        this.state.newConstraint8MaxNumberOfDays
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
                  勤務の間隔日数の上限
                </Typography>
                <Button
                  size="small"
                  onClick={this.handleClickOpenCreationDialog}
                >
                  追加
                </Button>
              </Toolbar>
            </Grid>
            {this.props.constraints8.map((c) => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint8 constraint8={c} />
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
            <DialogTitle>勤務の間隔日数の上限を追加できません</DialogTitle>
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
            const newConstraint8Kinmu = this.props.kinmus.find(
              ({ id }) => id === this.state.newConstraint8KinmuId
            )!;
            const relativesAreEnabled = newConstraint8Kinmu.is_enabled;
            const errorMessages = this.validate(
              this.state.newConstraint8MaxNumberOfDays
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
                  <Grid container={true} spacing={1}>
                    <Grid item={true} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              this.state.newConstraint8IsEnabled &&
                              relativesAreEnabled
                            }
                            disabled={!relativesAreEnabled}
                            onChange={this.handleChangeNewConstraint8IsEnabled}
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
                        value={this.state.newConstraint8KinmuId}
                        onChange={this.handleChangeNewConstraint8KinmuId}
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
                        defaultValue={this.state.newConstraint8MaxNumberOfDays}
                        onChange={
                          this.handleChangeNewConstraint8MaxNumberOfDays
                        }
                        fullWidth={true}
                        inputProps={{
                          min: constraints8.minOfConstraint8MaxNumberOfDays,
                        }}
                        error={
                          errorMessages.newConstraint8MaxNumberOfDays.length > 0
                        }
                        FormHelperTextProps={{
                          // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                          component: "div",
                        }}
                        helperText={errorMessages.newConstraint8MaxNumberOfDays.map(
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
                    onClick={this.handleClickCreateConstraint8}
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
    constraints8: state.present.constraints8,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraints8));
