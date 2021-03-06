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
import * as constraints5 from "../modules/constraints5";
import * as kinmus from "../modules/kinmus";

type Props = {
  dispatch: Dispatch;
  constraint5: constraints5.Constraint5;
  constraints5: constraints5.Constraint5[];
  kinmus: kinmus.Kinmu[];
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint5MinNumberOfDays: string[];
};

class Constraint5 extends React.Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = {
      deletionDialogIsOpen: false,
      expanded: false,
    };
  }
  public handleClickExpand = () => {
    this.setState({ expanded: !this.state.expanded });
  };
  public handleChangeConstraint5IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.props.dispatch(
      constraints5.updateConstraint5IsEnabled(
        this.props.constraint5.id,
        checked
      )
    );
  };
  public handleChangeConstraint5KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.props.dispatch(
      constraints5.updateConstraint5KinmuId(
        this.props.constraint5.id,
        parseInt(event.target.value, 10)
      )
    );
  };
  public validate(constraint5MinNumberOfDays: number): ErrorMessages {
    const errorMessages: ErrorMessages = {
      constraint5MinNumberOfDays: [],
    };
    if (isNaN(constraint5MinNumberOfDays)) {
      errorMessages.constraint5MinNumberOfDays.push(
        "連続日数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  }
  public handleChangeConstraint5MinNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.props.dispatch(
      constraints5.updateConstraint5MinNumberOfDays(
        this.props.constraint5.id,
        parseInt(event.target.value, 10)
      )
    );
  };
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true });
  };
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false });
  };
  public handleClickDeleteConstraint5 = () => {
    this.setState({ deletionDialogIsOpen: false });
    this.props.dispatch(
      constraints5.deleteConstraint5(this.props.constraint5.id)
    );
  };
  public render() {
    const constraint5Kinmu = this.props.kinmus.find(
      ({ id }) => id === this.props.constraint5.kinmu_id
    )!;
    const relativesAreEnabled = constraint5Kinmu.is_enabled;
    const title = (
      <>
        <span
          className={classnames({
            [this.props.classes.lineThrough]: !constraint5Kinmu.is_enabled,
          })}
        >
          {constraint5Kinmu.name}
        </span>
        の連続日数を{this.props.constraint5.min_number_of_days}日以上にする
      </>
    );
    const errorMessages = this.validate(
      this.props.constraint5.min_number_of_days
    );
    return (
      <>
        <Card>
          <CardHeader
            avatar={
              <Switch
                checked={
                  this.props.constraint5.is_enabled && relativesAreEnabled
                }
                disabled={!relativesAreEnabled}
                onChange={this.handleChangeConstraint5IsEnabled}
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
                  <TextField
                    select={true}
                    label="勤務"
                    value={this.props.constraint5.kinmu_id}
                    onChange={this.handleChangeConstraint5KinmuId}
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
                    label="連続日数下限"
                    type="number"
                    defaultValue={this.props.constraint5.min_number_of_days}
                    onChange={this.handleChangeConstraint5MinNumberOfDays}
                    fullWidth={true}
                    inputProps={{
                      min: constraints5.minOfConstraint5MinNumberOfDays,
                    }}
                    error={errorMessages.constraint5MinNumberOfDays.length > 0}
                    FormHelperTextProps={{
                      // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                      component: "div",
                    }}
                    helperText={errorMessages.constraint5MinNumberOfDays.map(
                      (message) => (
                        <div key={message}>{message}</div>
                      )
                    )}
                  />
                </Grid>
              </Grid>
            </CardContent>
            <CardActions>
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
          <DialogTitle>勤務の連続日数の下限の削除</DialogTitle>
          <DialogContent>
            <DialogContentText>
              この勤務の連続日数の下限を削除します
            </DialogContentText>
            <Typography>{title}</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteConstraint5}>
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
    constraints5: state.present.constraints5,
    kinmus: state.present.kinmus,
    members: state.present.members,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraint5));
