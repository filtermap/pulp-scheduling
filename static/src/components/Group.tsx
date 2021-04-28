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
import * as constraints1 from "../modules/constraints1";
import * as constraints2 from "../modules/constraints2";
import * as group_members from "../modules/group_members";
import * as groups from "../modules/groups";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";

type Props = {
  dispatch: Dispatch;
  group: groups.Group;
  groups: groups.Group[];
  members: members.Member[];
  group_members: group_members.GroupMember[];
  constraints1: constraints1.Constraint1[];
  constraints2: constraints2.Constraint2[];
  kinmus: kinmus.Kinmu[];
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  groupName: string[];
};

class Group extends React.Component<Props, State> {
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
  public handleChangeGroupIsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    this.props.dispatch(
      groups.updateGroupIsEnabled(this.props.group.id, checked)
    );
  };
  public validate(groupName: string): ErrorMessages {
    const errorMessages: ErrorMessages = {
      groupName: [],
    };
    if (groupName === "") {
      errorMessages.groupName.push("グループ名を入力してください");
    }
    return errorMessages;
  }
  public handleChangeGroupName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    this.props.dispatch(
      groups.updateGroupName(this.props.group.id, event.target.value)
    );
  };
  public handleChangeGroupMember(memberId: number) {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        this.props.dispatch(
          group_members.createGroupMember(this.props.group.id, memberId)
        );
        return;
      }
      this.props.dispatch(
        group_members.deleteGroupMember(this.props.group.id, memberId)
      );
    };
  }
  public handleClickOpenDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: true });
  };
  public handleCloseDeletionDialog = () => {
    this.setState({ deletionDialogIsOpen: false });
  };
  public handleClickDeleteGroup = () => {
    this.setState({ deletionDialogIsOpen: false });
    this.props.dispatch(all.deleteGroup(this.props.group.id));
  };
  public render() {
    const groupConstraints1 = this.props.constraints1.filter(
      (c) => c.group_id === this.props.group.id
    );
    const groupConstraints2 = this.props.constraints2.filter(
      (c) => c.group_id === this.props.group.id
    );
    const errorMessages = this.validate(this.props.group.name);
    return (
      <>
        <Card>
          <CardHeader
            avatar={
              <Switch
                checked={this.props.group.is_enabled}
                onChange={this.handleChangeGroupIsEnabled}
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
            title={this.props.group.name}
            titleTypographyProps={{
              variant: "headline",
            }}
            subheader={this.props.group_members
              .filter(
                (group_member) => group_member.group_id === this.props.group.id
              )
              .map(
                (group_member) =>
                  this.props.members.find(
                    (member) => member.id === group_member.member_id
                  )!.name
              )
              .join(", ")}
            subheaderTypographyProps={{
              variant: "body1",
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
                    label="グループ名"
                    defaultValue={this.props.group.name}
                    onChange={this.handleChangeGroupName}
                    fullWidth={true}
                    error={errorMessages.groupName.length > 0}
                    FormHelperTextProps={{
                      component: "div",
                    }}
                    helperText={errorMessages.groupName.map((message) => (
                      <div key={message}>{message}</div>
                    ))}
                  />
                </Grid>
                <Grid item={true} xs={12}>
                  <FormControl fullWidth={true}>
                    <FormLabel>グループに所属する職員</FormLabel>
                    <FormGroup>
                      {this.props.members.map((member) => (
                        <FormControlLabel
                          key={member.id}
                          label={member.name}
                          control={
                            <Checkbox
                              checked={this.props.group_members.some(
                                (group_member) =>
                                  group_member.group_id ===
                                    this.props.group.id &&
                                  group_member.member_id === member.id
                              )}
                              onChange={this.handleChangeGroupMember(member.id)}
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
            <CardActions disableActionSpacing={true}>
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
          <DialogTitle>グループの削除</DialogTitle>
          <DialogContent>
            <Grid container={true} spacing={8}>
              <Grid item={true} xs={12}>
                <DialogContentText>このグループを削除します</DialogContentText>
                <Typography>{this.props.group.name}</Typography>
                <Typography variant="caption">
                  {this.props.group_members
                    .filter(
                      (group_member) =>
                        group_member.group_id === this.props.group.id
                    )
                    .map(
                      (group_member) =>
                        this.props.members.find(
                          (member) => member.id === group_member.member_id
                        )!.name
                    )
                    .join(", ")}
                </Typography>
              </Grid>
              <Grid item={true} xs={12}>
                {(groupConstraints1.length > 0 ||
                  groupConstraints2.length > 0) && (
                  <DialogContentText>
                    以下の条件も削除されます
                  </DialogContentText>
                )}
                {groupConstraints1.map((c) => (
                  <Typography key={c.id}>{`${c.start_date_name}から${
                    c.stop_date_name
                  }までの${
                    this.props.kinmus.find(({ id }) => id === c.kinmu_id)!.name
                  }に${this.props.group.name}から${
                    c.min_number_of_assignments
                  }人以上の職員を割り当てる`}</Typography>
                ))}
                {groupConstraints2.map((c) => (
                  <Typography key={c.id}>{`${c.start_date_name}から${
                    c.stop_date_name
                  }までの${
                    this.props.kinmus.find(({ id }) => id === c.kinmu_id)!.name
                  }に${this.props.group.name}から${
                    c.max_number_of_assignments
                  }人以下の職員を割り当てる`}</Typography>
                ))}
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={this.handleClickDeleteGroup}>
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
    constraints1: state.present.constraints1,
    constraints2: state.present.constraints2,
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

export default withStyles(styles)(connect(mapStateToProps)(Group));
