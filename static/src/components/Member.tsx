import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Checkbox from "@material-ui/core/Checkbox";
import Collapse from "@material-ui/core/Collapse";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
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
import * as assignments from "../modules/assignments";
import * as constraints10 from "../modules/constraints10";
import * as constraints3 from "../modules/constraints3";
import * as constraints4 from "../modules/constraints4";
import * as constraints9 from "../modules/constraints9";
import * as group_members from "../modules/group_members";
import * as groups from "../modules/groups";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";

type Props = {
  dispatch: Dispatch;
  member: members.Member;
  group_members: group_members.GroupMember[];
  groups: groups.Group[];
  assignments: assignments.Assignment[];
  constraints3: constraints3.Constraint3[];
  constraints4: constraints4.Constraint4[];
  constraints9: constraints9.Constraint9[];
  constraints10: constraints10.Constraint10[];
  kinmus: kinmus.Kinmu[];
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  memberName: string[];
};

class Member extends React.Component<Props, State> {
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
  public handleChangeMemberIsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.props.dispatch(
      members.updateMemberIsEnabled(this.props.member.id, checked)
    );
  };
  public validate(memberName: string): ErrorMessages {
    const errorMessages: ErrorMessages = {
      memberName: [],
    };
    if (memberName === "") {
      errorMessages.memberName.push("職員名を入力してください");
    }
    return errorMessages;
  }
  public handleChangeMemberName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.props.dispatch(
      members.updateMemberName(this.props.member.id, event.target.value)
    );
  };
  public handleChangeGroupMember(groupId: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        this.props.dispatch(
          group_members.createGroupMember(groupId, this.props.member.id)
        );
        return;
      }
      this.props.dispatch(
        group_members.deleteGroupMember(groupId, this.props.member.id)
      );
    };
  }
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true });
  };
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false });
  };
  public handleClickDeleteMember = () => {
    this.setState({ deletionDialogIsOpen: false });
    this.props.dispatch(all.deleteMember(this.props.member.id));
  };
  public render() {
    const memberScheduleIds = Array.from(
      new Set(
        this.props.assignments
          .filter(({ member_id }) => member_id === this.props.member.id)
          .map(({ schedule_id }) => schedule_id)
      )
    );
    const memberConstraints3 = this.props.constraints3.filter(
      (c) => c.member_id === this.props.member.id
    );
    const memberConstraints4 = this.props.constraints4.filter(
      (c) => c.member_id === this.props.member.id
    );
    const memberConstraints9 = this.props.constraints9.filter(
      (c) => c.member_id === this.props.member.id
    );
    const memberConstraints10 = this.props.constraints10.filter(
      (c) => c.member_id === this.props.member.id
    );
    const errorMessages = this.validate(this.props.member.name);
    return (
      <>
        <Card>
          <CardHeader
            avatar={
              <Switch
                checked={this.props.member.is_enabled}
                onChange={this.handleChangeMemberIsEnabled}
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
            title={this.props.member.name}
            titleTypographyProps={{
              variant: "h5",
            }}
            subheader={this.props.group_members
              .filter(
                (group_member) =>
                  group_member.member_id === this.props.member.id
              )
              .map(
                (group_member) =>
                  this.props.groups.find(
                    (group) => group.id === group_member.group_id
                  )!.name
              )
              .join(", ")}
            subheaderTypographyProps={{
              variant: "body2",
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
                    label="職員名"
                    defaultValue={this.props.member.name}
                    onChange={this.handleChangeMemberName}
                    fullWidth={true}
                    error={errorMessages.memberName.length > 0}
                    FormHelperTextProps={{
                      // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                      component: "div",
                    }}
                    helperText={errorMessages.memberName.map((message) => (
                      <div key={message}>{message}</div>
                    ))}
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <FormControl fullWidth={true}>
                    <FormLabel>職員が所属するグループ</FormLabel>
                    <FormGroup>
                      {this.props.groups.map((group) => (
                        <FormControlLabel
                          key={group.id}
                          label={group.name}
                          control={
                            <Checkbox
                              checked={this.props.group_members.some(
                                (group_member) =>
                                  group_member.group_id === group.id &&
                                  group_member.member_id ===
                                    this.props.member.id
                              )}
                              onChange={this.handleChangeGroupMember(group.id)}
                              color="primary"
                            />
                          }
                        />
                      ))}
                    </FormGroup>
                  </FormControl>
                </Grid>
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
          <DialogTitle>職員の削除</DialogTitle>
          <DialogContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <DialogContentText>この職員を削除します</DialogContentText>
                <Typography>{this.props.member.name}</Typography>
                <Typography variant="caption">
                  {this.props.group_members
                    .filter(
                      (group_member) =>
                        group_member.member_id === this.props.member.id
                    )
                    .map(
                      (group_member) =>
                        this.props.groups.find(
                          (group) => group.id === group_member.group_id
                        )!.name
                    )
                    .join(", ")}
                </Typography>
              </Grid>
              <Grid item={true} xs={12}>
                {memberScheduleIds.length > 0 && (
                  <DialogContentText>
                    以下の勤務表の割り当ても削除されます
                  </DialogContentText>
                )}
                {memberScheduleIds.map((schedule_id) => (
                  <Typography
                    key={schedule_id}
                  >{`勤務表${schedule_id}`}</Typography>
                ))}
              </Grid>
              <Grid item={true} xs={12}>
                {(memberConstraints3.length > 0 ||
                  memberConstraints4.length > 0 ||
                  memberConstraints9.length > 0 ||
                  memberConstraints10.length > 0) && (
                  <DialogContentText>
                    以下の条件も削除されます
                  </DialogContentText>
                )}
                {memberConstraints3.map((c) => (
                  <Typography key={c.id}>{`${this.props.member.name}に${
                    this.props.kinmus.find((kinmu) => kinmu.id === c.kinmu_id)!
                      .name
                  }を${
                    c.min_number_of_assignments
                  }回以上割り当てる`}</Typography>
                ))}
                {memberConstraints4.map((c) => (
                  <Typography key={c.id}>{`${this.props.member.name}に${
                    this.props.kinmus.find((kinmu) => kinmu.id === c.kinmu_id)!
                      .name
                  }を${
                    c.max_number_of_assignments
                  }回以下割り当てる`}</Typography>
                ))}
                {memberConstraints9.map((c) => (
                  <Typography key={c.id}>{`${this.props.member.name}の${
                    c.start_date_name
                  }から${c.stop_date_name}までに${
                    this.props.kinmus.find((kinmu) => kinmu.id === c.kinmu_id)!
                      .name
                  }を割り当てる`}</Typography>
                ))}
                {memberConstraints10.map((c) => (
                  <Typography key={c.id}>{`${this.props.member.name}の${
                    c.start_date_name
                  }から${c.stop_date_name}までに${
                    this.props.kinmus.find((kinmu) => kinmu.id === c.kinmu_id)!
                      .name
                  }を割り当てない`}</Typography>
                ))}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteMember}>
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
    assignments: state.present.assignments,
    constraints10: state.present.constraints10,
    constraints3: state.present.constraints3,
    constraints4: state.present.constraints4,
    constraints9: state.present.constraints9,
    group_members: state.present.group_members,
    groups: state.present.groups,
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
  });

export default withStyles(styles)(connect(mapStateToProps)(Member));
