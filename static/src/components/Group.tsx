import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useImmer } from "use-immer";

import { m } from "../messages";
import * as all from "../modules/all";
import * as constraints1 from "../modules/constraints1";
import * as constraints2 from "../modules/constraints2";
import * as group_members from "../modules/group_members";
import * as groups from "../modules/groups";
import * as members from "../modules/members";
import * as utils from "../utils";

import { Constraint1NameLink } from "./names/Constraint1Name";
import { Constraint2NameLink } from "./names/Constraint2Name";
import GroupName from "./names/GroupName";
import MemberName, { MemberNameLink } from "./names/MemberName";
import ExpandMoreButton from "./parts/ExpandMoreButton";

type Props = {
  group: groups.Group;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
  changes: {
    name: string;
  };
};

type ErrorMessages = {
  groupName: string[];
};

// eslint-disable-next-line react/display-name
const Group = React.memo((props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedGroupMembers = useSelector(group_members.selectors.selectAll);
  const selectedConstraints1 = useSelector(constraints1.selectors.selectAll);
  const selectedConstraints2 = useSelector(constraints2.selectors.selectAll);
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === props.group.term_id
  );
  const groupGroupMemberMemberIds = new Set(
    selectedGroupMembers
      .filter(({ group_id }) => group_id === props.group.id)
      .map(({ member_id }) => member_id)
  );
  const groupMembers = membersInTerm.filter(({ id }) =>
    groupGroupMemberMemberIds.has(id)
  );
  const groupConstraints1 = selectedConstraints1.filter(
    ({ group_id }) => group_id === props.group.id
  );
  const groupConstraints2 = selectedConstraints2.filter(
    ({ group_id }) => group_id === props.group.id
  );
  const [state, updateState] = useImmer<State>({
    changes: {
      name: props.group.name,
    },
    deletionDialogIsOpen: false,
    expanded: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.name = props.group.name;
      }),
    [props.group.name, updateState]
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeGroupIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      groups.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.group.id,
      })
    );
  };
  const validate = (groupName: string): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      groupName: [],
    };
    if (groupName === "")
      errorMessages.groupName.push(
        m["arg0を入力してください"](m["グループ名"])
      );
    return errorMessages;
  };
  const handleChangeGroupName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.name = event.target.value;
    });
  };
  const handleBlurGroupName = () => {
    if (state.changes.name === props.group.name) return;
    dispatch(
      groups.update({
        changes: {
          name: state.changes.name,
        },
        id: props.group.id,
      })
    );
  };
  const handleChangeGroupMember =
    (memberId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        dispatch(
          group_members.add({
            group_id: props.group.id,
            member_id: memberId,
          })
        );
        return;
      }
      dispatch(
        group_members.remove({
          group_id: props.group.id,
          member_id: memberId,
        })
      );
    };
  const handleClickOpenDeletionDialog = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = true;
    });
  };
  const handleCloseDeletionDialog = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
  };
  const handleClickDeleteGroup = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(all.removeGroup(props.group.id));
  };
  const groupMemberNames = utils.intersperse(
    groupMembers.map((member) => (
      <MemberNameLink key={member.id} member={member} />
    )),
    ", "
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
            <ExpandMoreButton
              expanded={state.expanded}
              onClick={handleClickExpand}
              aria-expanded={state.expanded}
              size="large"
            />
          }
          title={<GroupName group={props.group} />}
          titleTypographyProps={{
            variant: "h5",
          }}
          subheader={groupMemberNames}
          subheaderTypographyProps={{
            variant: "body2",
          }}
        />
        <Collapse in={state.expanded} timeout="auto" unmountOnExit={true}>
          <CardContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <TextField
                  label={m["グループ名"]}
                  value={state.changes.name}
                  onChange={handleChangeGroupName}
                  onBlur={handleBlurGroupName}
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
                  <FormLabel>{m["グループに所属する職員"]}</FormLabel>
                  <FormGroup>
                    {membersInTerm.map((member) => (
                      <FormControlLabel
                        key={member.id}
                        label={<MemberName member={member} />}
                        control={
                          <Checkbox
                            checked={groupGroupMemberMemberIds.has(member.id)}
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
              {m["削除"]}
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
        <DialogTitle>{m["arg0の削除"](m["グループ"])}</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <DialogContentText>
                {m["このarg0を削除します"](m["グループ"])}
              </DialogContentText>
              <Typography>
                <GroupName group={props.group} />
              </Typography>
              <Typography variant="caption">{groupMemberNames}</Typography>
            </Grid>
            <Grid item={true} xs={12}>
              {(groupConstraints1.length > 0 ||
                groupConstraints2.length > 0) && (
                <DialogContentText>
                  {m["以下の条件も削除されます"]}
                </DialogContentText>
              )}
              {groupConstraints1.map((c) => (
                <Typography key={`constraint1_${c.id}`}>
                  <Constraint1NameLink constraint1={c} />
                </Typography>
              ))}
              {groupConstraints2.map((c) => (
                <Typography key={`constraint2_${c.id}`}>
                  <Constraint2NameLink constraint2={c} />
                </Typography>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteGroup}>
            {m["削除"]}
          </Button>
          <Button color="primary" onClick={handleCloseDeletionDialog}>
            {m["閉じる"]}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Group;
