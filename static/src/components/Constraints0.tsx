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
import * as constraint0_kinmus from "../modules/constraint0_kinmus";
import * as constraints0 from "../modules/constraints0";
import * as kinmus from "../modules/kinmus";
import Constraint0 from "./Constraint0";

type Props = {
  dispatch: Dispatch;
  constraints0: constraints0.Constraint0[];
  constraint0_kinmus: constraint0_kinmus.Constraint0Kinmu[];
  kinmus: kinmus.Kinmu[];
} & WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint0IsEnabled: boolean;
  newConstraint0Constraint0KinmuKinmuIds: number[];
};

class Constraints0 extends React.Component<Props, State> {
  public state: State = {
    creationDialogIsOpen: false,
    newConstraint0Constraint0KinmuKinmuIds:
      this.props.kinmus.length > 0
        ? [this.props.kinmus[0].id, this.props.kinmus[0].id]
        : [],
    newConstraint0IsEnabled: true,
  };
  public handleClickOpenCreationDialog = () => {
    this.setState({ creationDialogIsOpen: true });
  };
  public handleCloseCreationDialog = () => {
    this.setState({ creationDialogIsOpen: false });
  };
  public handleChangeNewConstraint0IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.setState({ newConstraint0IsEnabled: checked });
  };
  public handleClickCreateNewConstraint0Constraint0Kinmu(id: number) {
    return () => {
      const newConstraint0Constraint0KinmuKinmuIds = [
        ...this.state.newConstraint0Constraint0KinmuKinmuIds,
      ];
      newConstraint0Constraint0KinmuKinmuIds.splice(
        id,
        0,
        this.props.kinmus[0].id
      );
      this.setState({ newConstraint0Constraint0KinmuKinmuIds });
    };
  }
  public handleChangeNewConstraint0Constraint0KinmuKinmuId(
    newConstraint0Constraint0KinmuKinmuIdsIndex: number
  ) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.setState({
        newConstraint0Constraint0KinmuKinmuIds: this.state.newConstraint0Constraint0KinmuKinmuIds.map(
          (kinmuId, index) => {
            if (index !== newConstraint0Constraint0KinmuKinmuIdsIndex) {
              return kinmuId;
            }
            return parseInt(event.target.value, 10);
          }
        ),
      });
    };
  }
  public handleClickDeleteNewConstraint0Constraint0Kinmu(
    newConstraint0Constraint0KinmuKinmuIdsId: number
  ) {
    return () => {
      this.setState({
        newConstraint0Constraint0KinmuKinmuIds: this.state.newConstraint0Constraint0KinmuKinmuIds.filter(
          (_, id) => id !== newConstraint0Constraint0KinmuKinmuIdsId
        ),
      });
    };
  }
  public handleClickCreateConstraint0 = (
    _: React.MouseEvent<HTMLButtonElement>
  ) => {
    this.setState({ creationDialogIsOpen: false });
    this.props.dispatch(
      all.createConstraint0(
        this.state.newConstraint0IsEnabled,
        this.state.newConstraint0Constraint0KinmuKinmuIds
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
                  連続禁止勤務並び
                </Typography>
                <Button
                  size="small"
                  onClick={this.handleClickOpenCreationDialog}
                >
                  追加
                </Button>
              </Toolbar>
            </Grid>
            {this.props.constraints0.map((c) => (
              <Grid key={c.id} item={true} xs={12}>
                <Constraint0 constraint0={c} />
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
            <DialogTitle>連続禁止勤務並びを追加できません</DialogTitle>
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
            const newConstraint0Constraint0KinmuKinmus = this.state.newConstraint0Constraint0KinmuKinmuIds.map(
              (kinmu_id) => this.props.kinmus.find(({ id }) => id === kinmu_id)!
            );
            const relativesAreEnabled = newConstraint0Constraint0KinmuKinmus.every(
              ({ is_enabled }) => is_enabled
            );
            return (
              <Dialog
                onClose={this.handleCloseCreationDialog}
                open={this.state.creationDialogIsOpen}
                fullWidth={true}
                maxWidth="md"
              >
                <DialogTitle>連続禁止勤務並びの追加</DialogTitle>
                <DialogContent>
                  <Grid container={true} spacing={8}>
                    <Grid item={true} xs={12}>
                      <FormControlLabel
                        control={
                          <Switch
                            checked={
                              this.state.newConstraint0IsEnabled &&
                              relativesAreEnabled
                            }
                            disabled={!relativesAreEnabled}
                            onChange={this.handleChangeNewConstraint0IsEnabled}
                            color="primary"
                          />
                        }
                        label="有効"
                      />
                    </Grid>
                    <Grid item={true} xs={12}>
                      <Button
                        size="small"
                        onClick={this.handleClickCreateNewConstraint0Constraint0Kinmu(
                          0
                        )}
                      >
                        追加
                      </Button>
                    </Grid>
                    {this.state.newConstraint0Constraint0KinmuKinmuIds.map(
                      (kinmuId, id) => (
                        <React.Fragment key={`${id}-${kinmuId}`}>
                          <Grid item={true} xs={12}>
                            <TextField
                              select={true}
                              label={`勤務${id + 1}`}
                              value={kinmuId}
                              onChange={this.handleChangeNewConstraint0Constraint0KinmuKinmuId(
                                id
                              )}
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
                            {this.state.newConstraint0Constraint0KinmuKinmuIds
                              .length > 2 && (
                              <Button
                                size="small"
                                onClick={this.handleClickDeleteNewConstraint0Constraint0Kinmu(
                                  id
                                )}
                              >
                                削除
                              </Button>
                            )}
                          </Grid>
                          <Grid item={true} xs={12}>
                            <Button
                              size="small"
                              onClick={this.handleClickCreateNewConstraint0Constraint0Kinmu(
                                id + 1
                              )}
                            >
                              追加
                            </Button>
                          </Grid>
                        </React.Fragment>
                      )
                    )}
                  </Grid>
                </DialogContent>
                <DialogActions>
                  <Button
                    color="primary"
                    onClick={this.handleClickCreateConstraint0}
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
    constraint0_kinmus: state.present.constraint0_kinmus,
    constraints0: state.present.constraints0,
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

export default connect(mapStateToProps)(withStyles(styles)(Constraints0));
