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

import ExpandMoreButton from "./parts/ExpandMoreButton";

type Props = {
  member: members.Member;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  memberName: string[];
};

function Member(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selectedAssignments = useSelector(assignments.selectors.selectAll);
  const selectedConstraints10 = useSelector(constraints10.selectors.selectAll);
  const selectedConstraints3 = useSelector(constraints3.selectors.selectAll);
  const selectedConstraints4 = useSelector(constraints4.selectors.selectAll);
  const selectedConstraints9 = useSelector(constraints9.selectors.selectAll);
  const selectedGroupMembers = useSelector(group_members.selectors.selectAll);
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const selectedGroupById = useSelector(groups.selectors.selectEntities);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const groupMembersInTerm = selectedGroupMembers.filter(
    ({ member_id }) => member_id === props.member.id
  );
  const groupsInTerm = selectedGroups.filter(
    ({ term_id }) => term_id === props.member.term_id
  );
  const assignmentsInTerm = selectedAssignments.filter(
    ({ member_id }) => member_id === props.member.id
  );
  const constraints3InTerm = selectedConstraints3.filter(
    ({ term_id }) => term_id === props.member.term_id
  );
  const constraints4InTerm = selectedConstraints4.filter(
    ({ term_id }) => term_id === props.member.term_id
  );
  const constraints9InTerm = selectedConstraints9.filter(
    ({ term_id }) => term_id === props.member.term_id
  );
  const constraints10InTerm = selectedConstraints10.filter(
    ({ term_id }) => term_id === props.member.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeMemberIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      members.update({
        id: props.member.id,
        changes: {
          is_enabled: event.target.checked,
        },
      })
    );
  };
  const validate = (memberName: string): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      memberName: [],
    };
    if (memberName === "") {
      errorMessages.memberName.push("職員名を入力してください");
    }
    return errorMessages;
  };
  const handleChangeMemberName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      members.update({
        id: props.member.id,
        changes: {
          name: event.target.value,
        },
      })
    );
  };
  const handleChangeGroupMember = (groupId: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        dispatch(
          group_members.add({
            group_id: groupId,
            member_id: props.member.id,
          })
        );
        return;
      }
      dispatch(
        group_members.remove({
          group_id: groupId,
          member_id: props.member.id,
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
  const handleClickDeleteMember = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(all.removeMember(props.member.id));
  };
  const memberScheduleIds = Array.from(
    new Set(
      assignmentsInTerm
        .filter(({ member_id }) => member_id === props.member.id)
        .map(({ schedule_id }) => schedule_id)
    )
  );
  const memberConstraints3 = constraints3InTerm.filter(
    (c) => c.member_id === props.member.id
  );
  const memberConstraints4 = constraints4InTerm.filter(
    (c) => c.member_id === props.member.id
  );
  const memberConstraints9 = constraints9InTerm.filter(
    (c) => c.member_id === props.member.id
  );
  const memberConstraints10 = constraints10InTerm.filter(
    (c) => c.member_id === props.member.id
  );
  const errorMessages = validate(props.member.name);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.member.is_enabled}
              onChange={handleChangeMemberIsEnabled}
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
          title={props.member.name}
          titleTypographyProps={{
            variant: "h5",
          }}
          subheader={groupMembersInTerm
            .filter(
              (group_member) => group_member.member_id === props.member.id
            )
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            .map(({ group_id }) => selectedGroupById[group_id]!.name)
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
                  label="職員名"
                  defaultValue={props.member.name}
                  onChange={handleChangeMemberName}
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
                    {groupsInTerm.map((group) => (
                      <FormControlLabel
                        key={group.id}
                        label={group.name}
                        control={
                          <Checkbox
                            checked={groupMembersInTerm.some(
                              (group_member) =>
                                group_member.group_id === group.id &&
                                group_member.member_id === props.member.id
                            )}
                            onChange={handleChangeGroupMember(group.id)}
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
        <DialogTitle>職員の削除</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <DialogContentText>この職員を削除します</DialogContentText>
              <Typography>{props.member.name}</Typography>
              <Typography variant="caption">
                {groupMembersInTerm
                  .filter(
                    (group_member) => group_member.member_id === props.member.id
                  )
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  .map(({ group_id }) => selectedGroupById[group_id]!.name)
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
                <DialogContentText>以下の条件も削除されます</DialogContentText>
              )}
              {memberConstraints3.map((c) => (
                <Typography key={`constraint3_${c.id}`}>{`${
                  props.member.name
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                }に${selectedKinmuById[c.kinmu_id]!.name}を${
                  c.min_number_of_assignments
                }回以上割り当てる`}</Typography>
              ))}
              {memberConstraints4.map((c) => (
                <Typography key={`constraint4_${c.id}`}>{`${
                  props.member.name
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                }に${selectedKinmuById[c.kinmu_id]!.name}を${
                  c.max_number_of_assignments
                }回以下割り当てる`}</Typography>
              ))}
              {memberConstraints9.map((c) => (
                <Typography key={`constraint9_${c.id}`}>{`${
                  props.member.name
                }の${c.start_date_name}から${c.stop_date_name}までに${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  selectedKinmuById[c.kinmu_id]!.name
                }を割り当てる`}</Typography>
              ))}
              {memberConstraints10.map((c) => (
                <Typography key={`constraint10_${c.id}`}>{`${
                  props.member.name
                }の${c.start_date_name}から${c.stop_date_name}までに${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  selectedKinmuById[c.kinmu_id]!.name
                }を割り当てない`}</Typography>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteMember}>
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

export default Member;
