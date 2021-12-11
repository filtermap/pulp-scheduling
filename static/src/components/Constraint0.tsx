import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import { Theme, WithStyles } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classnames from "classnames";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StateWithHistory } from "redux-undo";
import * as all from "../modules/all";
import * as constraint0_kinmus from "../modules/constraint0_kinmus";
import * as constraints0 from "../modules/constraints0";
import * as kinmus from "../modules/kinmus";
import * as utils from "../utils";

type Props = {
  dispatch: Dispatch;
  constraint0: constraints0.Constraint0;
  constraints0: constraints0.Constraint0[];
  constraint0_kinmus: constraint0_kinmus.Constraint0Kinmu[];
  kinmus: kinmus.Kinmu[];
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

class Constraint0 extends React.Component<Props, State> {
  public state: State = {
    deletionDialogIsOpen: false,
    expanded: false,
  };
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };
  public handleChangeConstraint0IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.props.dispatch(
      constraints0.updateConstraint0IsEnabled(
        this.props.constraint0.id,
        checked
      )
    );
  };
  public handleClickCreateConstraint0Kinmu(sequence_number: number) {
    return () => {
      const kinmu_id = this.props.kinmus[0].id;
      this.props.dispatch(
        constraint0_kinmus.createConstraint0Kinmu(
          this.props.constraint0.id,
          sequence_number,
          kinmu_id
        )
      );
    };
  }
  public handleChangeConstraint0KinmuKinmuId(constraint0_kinmu_id: number) {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      this.props.dispatch(
        constraint0_kinmus.updateConstraint0KinmuKinmuId(
          constraint0_kinmu_id,
          parseInt(event.target.value, 10)
        )
      );
    };
  }
  public handleClickDeleteConstraint0Kinmu(constraint0_kinmu_id: number) {
    return () => {
      this.props.dispatch(all.deleteConstraint0Kinmu(constraint0_kinmu_id));
    };
  }
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true });
  };
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false });
  };
  public handleClickDeleteConstraint0 = () => {
    this.setState({ deletionDialogIsOpen: false });
    this.props.dispatch(all.deleteConstraint0(this.props.constraint0.id));
  };
  public render() {
    const constraint0Constraint0Kinmus = this.props.constraint0_kinmus
      .filter(
        ({ constraint0_id }) => constraint0_id === this.props.constraint0.id
      )
      .sort((a, b) => a.sequence_number - b.sequence_number);
    const constraint0Constraint0KinmuKinmus = constraint0Constraint0Kinmus.map(
      ({ kinmu_id }) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        this.props.kinmus.find((kinmu) => kinmu.id === kinmu_id)!
    );
    const relativesAreEnabled = constraint0Constraint0KinmuKinmus.every(
      ({ is_enabled }) => is_enabled
    );
    const title = utils.intersperse(
      constraint0Constraint0KinmuKinmus.map((kinmu) => (
        <span
          key={kinmu.id}
          className={classnames({
            [this.props.classes.lineThrough]: !kinmu.is_enabled,
          })}
        >
          {kinmu.name}
        </span>
      )),
      ", "
    );
    return (
      <>
        <Card>
          <CardHeader
            avatar={
              <Switch
                checked={
                  this.props.constraint0.is_enabled && relativesAreEnabled
                }
                disabled={!relativesAreEnabled}
                onChange={this.handleChangeConstraint0IsEnabled}
                color="primary"
              />
            }
            action={
              <IconButton
                className={classnames(this.props.classes.expand, {
                  [this.props.classes.expandOpen]: this.state.expanded,
                })}
                onClick={this.handleClickExpand}
                aria-expanded={this.state.expanded}
              >
                <ExpandMoreIcon />
              </IconButton>
            }
            title={title}
            titleTypographyProps={{
              variant: "h5",
            }}
          />
          <Collapse
            in={this.state.expanded}
            timeout="auto"
            unmountOnExit={true}
          >
            <CardContent>
              <Grid container={true} spacing={1}>
                <Grid item={true} xs={12}>
                  <Button
                    size="small"
                    onClick={this.handleClickCreateConstraint0Kinmu(0)}
                  >
                    追加
                  </Button>
                </Grid>
                {constraint0Constraint0Kinmus.map(
                  (constraint0_kinmu, index) => (
                    <React.Fragment key={constraint0_kinmu.id}>
                      <Grid item={true} xs={12}>
                        <TextField
                          select={true}
                          label={`勤務${index + 1}`}
                          value={constraint0_kinmu.kinmu_id}
                          onChange={this.handleChangeConstraint0KinmuKinmuId(
                            constraint0_kinmu.id
                          )}
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
                        {constraint0Constraint0Kinmus.length > 2 && (
                          <Button
                            size="small"
                            onClick={this.handleClickDeleteConstraint0Kinmu(
                              constraint0_kinmu.id
                            )}
                          >
                            削除
                          </Button>
                        )}
                      </Grid>
                      <Grid item={true} xs={12}>
                        <Button
                          size="small"
                          onClick={this.handleClickCreateConstraint0Kinmu(
                            constraint0_kinmu.sequence_number + 1
                          )}
                        >
                          追加
                        </Button>
                      </Grid>
                    </React.Fragment>
                  )
                )}
              </Grid>
            </CardContent>
            <CardActions disableSpacing={true}>
              <Button size="small" onClick={this.handleClickOpenDeletionDialog}>
                削除
              </Button>
            </CardActions>
          </Collapse>
        </Card>
        <Dialog
          onClose={this.handleCloseDeletionDialog}
          open={this.state.deletionDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>連続禁止勤務並びの削除</DialogTitle>
          <DialogContent>
            <DialogContentText>
              この連続禁止勤務並びを削除します
            </DialogContentText>
            <Typography>{title}</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteConstraint0}>
              削除
            </Button>
            <Button color="primary" onClick={this.handleCloseDeletionDialog}>
              閉じる
            </Button>
          </DialogActions>
        </Dialog>
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

const styles = (theme: Theme) =>
  createStyles({
    expand: {
      transform: "rotate(0deg)",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    lineThrough: {
      "&::-webkit-datetime-edit-fields-wrapper": {
        textDecoration: "line-through",
      },
      textDecoration: "line-through",
    },
  });

export default withStyles(styles)(connect(mapStateToProps)(Constraint0));
