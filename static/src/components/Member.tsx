import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
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
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useImmer } from "use-immer";

import * as all from "../modules/all";
import * as assignments from "../modules/assignments";
import * as constraints10 from "../modules/constraints10";
import * as constraints3 from "../modules/constraints3";
import * as constraints4 from "../modules/constraints4";
import * as constraints9 from "../modules/constraints9";
import * as group_members from "../modules/group_members";
import * as groups from "../modules/groups";
import * as members from "../modules/members";
import * as schedules from "../modules/schedules";
import * as utils from "../utils";

import { Constraint10NameLink } from "./names/Constraint10Name";
import { Constraint3NameLink } from "./names/Constraint3Name";
import { Constraint4NameLink } from "./names/Constraint4Name";
import { Constraint9NameLink } from "./names/Constraint9Name";
import GroupName, { GroupNameLink } from "./names/GroupName";
import MemberName from "./names/MemberName";
import { ScheduleNameLink } from "./names/ScheduleName";
import ExpandMoreButton from "./parts/ExpandMoreButton";
import FlexStartDialogActions from "./parts/FlexStartDialogActions";

type Props = {
  member: members.Member;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
  changes: {
    name: string;
  };
};

// eslint-disable-next-line react/display-name
const Member = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedAssignments = useSelector(assignments.selectors.selectAll);
  const selectedSchedules = useSelector(schedules.selectors.selectAll);
  const selectedConstraints10 = useSelector(constraints10.selectors.selectAll);
  const selectedConstraints3 = useSelector(constraints3.selectors.selectAll);
  const selectedConstraints4 = useSelector(constraints4.selectors.selectAll);
  const selectedConstraints9 = useSelector(constraints9.selectors.selectAll);
  const selectedGroupMembers = useSelector(group_members.selectors.selectAll);
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const [state, updateState] = useImmer<State>({
    changes: {
      name: props.member.name,
    },
    deletionDialogIsOpen: false,
    expanded: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.name = props.member.name;
      }),
    [props.member.name, updateState]
  );
  const groupsInTerm = selectedGroups.filter(
    ({ term_id }) => term_id === props.member.term_id
  );
  const memberGroupMemberGroupIds = new Set(
    selectedGroupMembers
      .filter(({ member_id }) => member_id === props.member.id)
      .map(({ group_id }) => group_id)
  );
  const memberGroups = groupsInTerm.filter(({ id }) =>
    memberGroupMemberGroupIds.has(id)
  );
  const memberAssignments = selectedAssignments.filter(
    ({ member_id }) => member_id === props.member.id
  );
  const memberConstraints3 = selectedConstraints3.filter(
    ({ member_id }) => member_id === props.member.id
  );
  const memberConstraints4 = selectedConstraints4.filter(
    ({ member_id }) => member_id === props.member.id
  );
  const memberConstraints9 = selectedConstraints9.filter(
    ({ member_id }) => member_id === props.member.id
  );
  const memberConstraints10 = selectedConstraints10.filter(
    ({ member_id }) => member_id === props.member.id
  );
  const memberGroupNames = utils.intersperse(
    memberGroups.map((group) => <GroupNameLink key={group.id} group={group} />),
    ", "
  );
  const memberScheduleIds = new Set(
    memberAssignments.map(({ schedule_id }) => schedule_id)
  );
  const memberSchedules = selectedSchedules.filter(({ id }) =>
    memberScheduleIds.has(id)
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeMemberIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      members.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.member.id,
      })
    );
  };
  const handleChangeMemberName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.name = event.target.value;
    });
  };
  const handleBlurMemberName = () => {
    if (state.changes.name === props.member.name) return;
    dispatch(
      members.update({
        changes: {
          name: state.changes.name,
        },
        id: props.member.id,
      })
    );
  };
  const handleChangeGroupMember =
    (groupId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
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
  const handleClickDeleteMember = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(all.removeMember(props.member.id));
  };
  const errorMessages = members.getErrorMessages(t, { member: props.member });
  const relativesAreEnabled = utils.noErrors(errorMessages);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.member.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
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
          title={<MemberName member={props.member} />}
          titleTypographyProps={{
            variant: "h5",
          }}
          subheader={memberGroupNames}
          subheaderTypographyProps={{
            variant: "body2",
          }}
        />
        <Collapse in={state.expanded} timeout="auto" unmountOnExit={true}>
          <CardContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <TextField
                  label={t("職員名")}
                  value={state.changes.name}
                  onChange={handleChangeMemberName}
                  onBlur={handleBlurMemberName}
                  fullWidth={true}
                  error={errorMessages.name.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.name.map((message) => (
                    <div key={message}>{message}</div>
                  ))}
                />
              </Grid>
              <Grid item={true} xs={12}>
                <FormControl fullWidth={true}>
                  <FormLabel>{t("職員が所属するグループ")}</FormLabel>
                  <FormGroup>
                    {groupsInTerm.map((group) => (
                      <FormControlLabel
                        key={group.id}
                        label={<GroupName group={group} />}
                        control={
                          <Checkbox
                            checked={memberGroupMemberGroupIds.has(group.id)}
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
              {t("削除")}
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
        <DialogTitle>{t("{{arg0}}の削除", { arg0: t("職員") })}</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <DialogContentText>
                {t("この{{arg0}}を削除します", { arg0: t("職員") })}
              </DialogContentText>
              <Typography>
                <MemberName member={props.member} />
              </Typography>
              <Typography variant="caption">{memberGroupNames}</Typography>
            </Grid>
            {memberSchedules.length > 0 && (
              <Grid item={true} xs={12}>
                <DialogContentText>
                  {t("以下の勤務表内の職員への割り当ても削除されます")}
                </DialogContentText>
                {memberSchedules.map((schedule) => (
                  <Typography key={schedule.id}>
                    <ScheduleNameLink schedule={schedule} />
                  </Typography>
                ))}
              </Grid>
            )}
            {(memberConstraints3.length > 0 ||
              memberConstraints4.length > 0 ||
              memberConstraints9.length > 0 ||
              memberConstraints10.length > 0) && (
              <Grid item={true} xs={12}>
                <DialogContentText>
                  {t("以下の条件も削除されます")}
                </DialogContentText>
                {memberConstraints3.map((c) => (
                  <Typography key={`constraint3_${c.id}`}>
                    <Constraint3NameLink constraint3={c} />
                  </Typography>
                ))}
                {memberConstraints4.map((c) => (
                  <Typography key={`constraint4_${c.id}`}>
                    <Constraint4NameLink constraint4={c} />
                  </Typography>
                ))}
                {memberConstraints9.map((c) => (
                  <Typography key={`constraint9_${c.id}`}>
                    <Constraint9NameLink constraint9={c} />
                  </Typography>
                ))}
                {memberConstraints10.map((c) => (
                  <Typography key={`constraint10_${c.id}`}>
                    <Constraint10NameLink constraint10={c} />
                  </Typography>
                ))}
              </Grid>
            )}
          </Grid>
        </DialogContent>
        <FlexStartDialogActions>
          <Button color="primary" onClick={handleClickDeleteMember}>
            {t("削除")}
          </Button>
          <Button color="primary" onClick={handleCloseDeletionDialog}>
            {t("閉じる")}
          </Button>
        </FlexStartDialogActions>
      </Dialog>
    </>
  );
});

export default Member;
