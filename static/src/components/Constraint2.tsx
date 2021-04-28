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
import * as constraints2 from "../modules/constraints2";
import * as groups from "../modules/groups";
import * as kinmus from "../modules/kinmus";
import * as terms from "../modules/terms";
import * as utils from "../utils";

type Props = {
  dispatch: Dispatch;
  constraint2: constraints2.Constraint2;
  constraints2: constraints2.Constraint2[];
  terms: terms.Term[];
  kinmus: kinmus.Kinmu[];
  groups: groups.Group[];
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint2StartDateName: string[];
  constraint2StopDateName: string[];
  constraint2MaxNumberOfAssignments: string[];
};

class Constraint2 extends React.Component<Props, State> {
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
  public handleChangeConstraint2IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.props.dispatch(
      constraints2.updateConstraint2IsEnabled(
        this.props.constraint2.id,
        checked
      )
    );
  };
  public validate(
    constraint2StartDateName: string,
    constraint2StopDateName: string,
    constraint2MaxNumberOfAssignments: number
  ): ErrorMessages {
    const errorMessages: ErrorMessages = {
      constraint2MaxNumberOfAssignments: [],
      constraint2StartDateName: [],
      constraint2StopDateName: [],
    };
    if (!utils.stringToDate(constraint2StartDateName)) {
      errorMessages.constraint2StartDateName.push(
        "開始日の形式が正しくありません"
      );
    }
    if (!utils.stringToDate(constraint2StopDateName)) {
      errorMessages.constraint2StopDateName.push(
        "終了日の形式が正しくありません"
      );
    }
    if (isNaN(constraint2MaxNumberOfAssignments)) {
      errorMessages.constraint2MaxNumberOfAssignments.push(
        "割り当て職員数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  }
  public handleChangeConstraint2StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.props.dispatch(
      constraints2.updateConstraint2StartDateName(
        this.props.constraint2.id,
        event.target.value
      )
    );
  };
  public handleChangeConstraint2StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.props.dispatch(
      constraints2.updateConstraint2StopDateName(
        this.props.constraint2.id,
        event.target.value
      )
    );
  };
  public handleChangeConstraint2KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.props.dispatch(
      constraints2.updateConstraint2KinmuId(
        this.props.constraint2.id,
        parseInt(event.target.value, 10)
      )
    );
  };
  public handleChangeConstraint2GroupId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.props.dispatch(
      constraints2.updateConstraint2GroupId(
        this.props.constraint2.id,
        parseInt(event.target.value, 10)
      )
    );
  };
  public handleChangeConstraint2MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.props.dispatch(
      constraints2.updateConstraint2MaxNumberOfAssignments(
        this.props.constraint2.id,
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
  public handleClickDeleteConstraint2 = () => {
    this.setState({ deletionDialogIsOpen: false });
    this.props.dispatch(
      constraints2.deleteConstraint2(this.props.constraint2.id)
    );
  };
  public render() {
    const constraint2StartDate = utils.stringToDate(
      this.props.constraint2.start_date_name
    );
    const constraint2StartDateIsEnabled = constraint2StartDate
      ? this.props.terms.every(({ start_date_name }) => {
          const startDate = utils.stringToDate(start_date_name);
          if (!startDate) {
            return false;
          }
          return startDate <= constraint2StartDate;
        })
      : false;
    const constraint2StopDate = utils.stringToDate(
      this.props.constraint2.stop_date_name
    );
    const constraint2StopDateIsEnabled = constraint2StopDate
      ? this.props.terms.every(({ stop_date_name }) => {
          const stopDate = utils.stringToDate(stop_date_name);
          if (!stopDate) {
            return false;
          }
          return stopDate >= constraint2StopDate;
        })
      : false;
    const constraint2Kinmu = this.props.kinmus.find(
      ({ id }) => id === this.props.constraint2.kinmu_id
    )!;
    const constraint2Group = this.props.groups.find(
      ({ id }) => id === this.props.constraint2.group_id
    )!;
    const relativesAreEnabled =
      constraint2StartDateIsEnabled &&
      constraint2StopDateIsEnabled &&
      constraint2Kinmu.is_enabled &&
      constraint2Group.is_enabled;
    const title = (
      <>
        <span
          className={classnames({
            [this.props.classes.lineThrough]: !constraint2StartDateIsEnabled,
          })}
        >
          {this.props.constraint2.start_date_name}
        </span>
        から
        <span
          className={classnames({
            [this.props.classes.lineThrough]: !constraint2StopDateIsEnabled,
          })}
        >
          {this.props.constraint2.stop_date_name}
        </span>
        までの
        <span
          className={classnames({
            [this.props.classes.lineThrough]: !constraint2Kinmu.is_enabled,
          })}
        >
          {constraint2Kinmu.name}
        </span>
        に
        <span
          className={classnames({
            [this.props.classes.lineThrough]: !constraint2Group.is_enabled,
          })}
        >
          {constraint2Group.name}
        </span>
        から{this.props.constraint2.max_number_of_assignments}
        人以下の職員を割り当てる
      </>
    );
    const errorMessages = this.validate(
      this.props.constraint2.start_date_name,
      this.props.constraint2.stop_date_name,
      this.props.constraint2.max_number_of_assignments
    );
    return (
      <>
        <Card>
          <CardHeader
            avatar={
              <Switch
                checked={
                  this.props.constraint2.is_enabled && relativesAreEnabled
                }
                disabled={!relativesAreEnabled}
                onChange={this.handleChangeConstraint2IsEnabled}
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
              <Grid container={true} spacing={8}>
                <Grid item={true} xs={12}>
                  <TextField
                    label="開始日"
                    type="date"
                    defaultValue={this.props.constraint2.start_date_name}
                    onChange={this.handleChangeConstraint2StartDateName}
                    fullWidth={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      className: classnames({
                        [this.props.classes
                          .lineThrough]: !constraint2StartDateIsEnabled,
                      }),
                    }}
                    error={errorMessages.constraint2StartDateName.length > 0}
                    FormHelperTextProps={{
                      // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                      component: "div",
                    }}
                    helperText={errorMessages.constraint2StartDateName.map(
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
                    defaultValue={this.props.constraint2.stop_date_name}
                    onChange={this.handleChangeConstraint2StopDateName}
                    fullWidth={true}
                    InputLabelProps={{
                      shrink: true,
                    }}
                    inputProps={{
                      className: classnames({
                        [this.props.classes
                          .lineThrough]: !constraint2StopDateIsEnabled,
                      }),
                    }}
                    error={errorMessages.constraint2StopDateName.length > 0}
                    FormHelperTextProps={{
                      // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                      component: "div",
                    }}
                    helperText={errorMessages.constraint2StopDateName.map(
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
                    value={this.props.constraint2.kinmu_id}
                    onChange={this.handleChangeConstraint2KinmuId}
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
                    select={true}
                    label="グループ"
                    value={this.props.constraint2.group_id}
                    onChange={this.handleChangeConstraint2GroupId}
                    fullWidth={true}
                  >
                    {this.props.groups.map((group) => (
                      <MenuItem key={group.id} value={group.id}>
                        {
                          <span
                            className={classnames({
                              [this.props.classes
                                .lineThrough]: !group.is_enabled,
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
                      this.props.constraint2.max_number_of_assignments
                    }
                    onChange={
                      this.handleChangeConstraint2MaxNumberOfAssignments
                    }
                    fullWidth={true}
                    inputProps={{
                      min: constraints2.minOfConstraint2MaxNumberOfAssignments,
                    }}
                    error={
                      errorMessages.constraint2MaxNumberOfAssignments.length > 0
                    }
                    FormHelperTextProps={{
                      // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                      component: "div",
                    }}
                    helperText={errorMessages.constraint2MaxNumberOfAssignments.map(
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
          <DialogTitle>
            期間の勤務にグループから割り当てる職員数の上限の削除
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              この期間の勤務にグループから割り当てる職員数の上限を削除します
            </DialogContentText>
            <Typography>{title}</Typography>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteConstraint2}>
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
    constraints2: state.present.constraints2,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
    terms: state.present.terms,
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

export default withStyles(styles)(connect(mapStateToProps)(Constraint2));
