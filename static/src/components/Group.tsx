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
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as all from "../modules/all";
import * as group_members from "../modules/group_members";
import * as groups from "../modules/groups";
import { RootState } from "../modules/store";

type Props = {
  group: groups.Group;
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  groupName: string[];
};

function select(state: RootState) {
  return {
    constraints1: state.present.constraints1,
    constraints2: state.present.constraints2,
    group_members: state.present.group_members,
    kinmus: state.present.kinmus,
    members: state.present.members,
  };
}

function Group(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const membersInTerm = selected.members.filter(
    ({ term_id }) => term_id === props.group.term_id
  );
  const memberIdsInTerm = new Set(membersInTerm.map(({ id }) => id));
  const groupMembersInTerm = selected.group_members.filter(({ member_id }) =>
    memberIdsInTerm.has(member_id)
  );
  const constraints1InTerm = selected.constraints1.filter(
    ({ term_id }) => term_id === props.group.term_id
  );
  const constraints2InTerm = selected.constraints2.filter(
    ({ term_id }) => term_id === props.group.term_id
  );
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === props.group.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeGroupIsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    dispatch(
      groups.updateGroupIsEnabled({ id: props.group.id, is_enabled: checked })
    );
  };
  const validate = (groupName: string): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      groupName: [],
    };
    if (groupName === "") {
      errorMessages.groupName.push("グループ名を入力してください");
    }
    return errorMessages;
  };
  const handleChangeGroupName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      groups.updateGroupName({ id: props.group.id, name: event.target.value })
    );
  };
  const handleChangeGroupMember = (memberId: number) => {
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        dispatch(
          group_members.createGroupMember({
            group_id: props.group.id,
            member_id: memberId,
          })
        );
        return;
      }
      dispatch(
        group_members.deleteGroupMember({
          group_id: props.group.id,
          member_id: memberId,
        })
      );
    };
  };
  const handleClickOpenDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: true }));
  };
  const handleCloseDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
  };
  const handleClickDeleteGroup = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(all.deleteGroup({ id: props.group.id }));
  };
  const groupConstraints1 = constraints1InTerm.filter(
    (c) => c.group_id === props.group.id
  );
  const groupConstraints2 = constraints2InTerm.filter(
    (c) => c.group_id === props.group.id
  );
  const errorMessages = validate(props.group.name);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.group.is_enabled}
              onChange={handleChangeGroupIsEnabled}
              color="primary"
            />
          }
          action={
            <IconButton
              className={classnames(props.classes.expand, {
                [props.classes.expandOpen]: state.expanded,
              })}
              onClick={handleClickExpand}
              aria-expanded={state.expanded}
            >
              <ExpandMoreIcon />
            </IconButton>
          }
          title={props.group.name}
          titleTypographyProps={{
            variant: "h5",
          }}
          subheader={groupMembersInTerm
            .filter((group_member) => group_member.group_id === props.group.id)
            .map(
              (group_member) =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                membersInTerm.find(
                  (member) => member.id === group_member.member_id
                )!.name
            )
            .join(", ")}
          subheaderTypographyProps={{
            variant: "body2",
          }}
        />
        <Collapse in={state.expanded} timeout="auto" unmountOnExit={true}>
          <CardContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <TextField
                  label="グループ名"
                  defaultValue={props.group.name}
                  onChange={handleChangeGroupName}
                  fullWidth={true}
                  error={errorMessages.groupName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
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
                    {membersInTerm.map((member) => (
                      <FormControlLabel
                        key={member.id}
                        label={member.name}
                        control={
                          <Checkbox
                            checked={groupMembersInTerm.some(
                              (group_member) =>
                                group_member.group_id === props.group.id &&
                                group_member.member_id === member.id
                            )}
                            onChange={handleChangeGroupMember(member.id)}
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
            <Button size="small" onClick={handleClickOpenDeletionDialog}>
              削除
            </Button>
          </CardActions>
        </Collapse>
      </Card>
      <Dialog
        onClose={handleCloseDeletionDialog}
        open={state.deletionDialogIsOpen}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>グループの削除</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <DialogContentText>このグループを削除します</DialogContentText>
              <Typography>{props.group.name}</Typography>
              <Typography variant="caption">
                {groupMembersInTerm
                  .filter(
                    (group_member) => group_member.group_id === props.group.id
                  )
                  .map(
                    (group_member) =>
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      membersInTerm.find(
                        (member) => member.id === group_member.member_id
                      )!.name
                  )
                  .join(", ")}
              </Typography>
            </Grid>
            <Grid item={true} xs={12}>
              {(groupConstraints1.length > 0 ||
                groupConstraints2.length > 0) && (
                <DialogContentText>以下の条件も削除されます</DialogContentText>
              )}
              {groupConstraints1.map((c) => (
                <Typography key={`constraint1_${c.id}`}>{`${
                  c.start_date_name
                }から${c.stop_date_name}までの${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  kinmusInTerm.find(({ id }) => id === c.kinmu_id)!.name
                }に${props.group.name}から${
                  c.min_number_of_assignments
                }人以上の職員を割り当てる`}</Typography>
              ))}
              {groupConstraints2.map((c) => (
                <Typography key={`constraint2_${c.id}`}>{`${
                  c.start_date_name
                }から${c.stop_date_name}までの${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  kinmusInTerm.find(({ id }) => id === c.kinmu_id)!.name
                }に${props.group.name}から${
                  c.max_number_of_assignments
                }人以下の職員を割り当てる`}</Typography>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteGroup}>
            削除
          </Button>
          <Button color="primary" onClick={handleCloseDeletionDialog}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
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

export default withStyles(styles)(Group);
