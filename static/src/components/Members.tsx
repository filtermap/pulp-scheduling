import Button from "@mui/material/Button";
import Checkbox from "@mui/material/Checkbox";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useImmer } from "use-immer";

import { useHashFragment } from "../hooks/useHashFragment";
import { usePosition } from "../hooks/usePosition";
import * as all from "../modules/all";
import * as groups from "../modules/groups";
import * as members from "../modules/members";
import * as utils from "../utils";

import Member from "./Member";
import GroupName from "./names/GroupName";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  member: {
    is_enabled: boolean;
    name: string;
  };
  group_ids: number[];
};

// eslint-disable-next-line react/display-name
const Members = React.memo((): JSX.Element => {
  const { t } = useTranslation();
  const [position, ref] = usePosition();
  useHashFragment(position?.top);
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === termId
  );
  const groupsInTerm = React.useMemo(
    () => selectedGroups.filter(({ term_id }) => term_id === termId),
    [selectedGroups, termId]
  );
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    group_ids: [],
    member: { is_enabled: true, name: "" },
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.group_ids = [];
      }),
    [groupsInTerm, updateState]
  );
  const handleClickOpenCreationDialog = () => {
    updateState((state) => {
      state.creationDialogIsOpen = true;
    });
  };
  const handleCloseCreationDialog = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
  };
  const handleChangeNewMemberIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.member.is_enabled = event.target.checked;
    });
  };
  const handleChangeNewMemberName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.member.name = event.target.value;
    });
  };
  const handleChangeNewGroupMember =
    (groupId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        updateState((state) => {
          state.group_ids.push(groupId);
        });
        return;
      }
      updateState((state) => {
        state.group_ids = state.group_ids.filter(
          (group_id) => group_id !== groupId
        );
      });
    };
  const handleClickCreateMember = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      all.addMember({
        group_ids: state.group_ids,
        member: {
          ...state.member,
          term_id: termId,
        },
      })
    );
  };
  const errorMessages = members.getErrorMessages(t, { member: state.member });
  const relativesAreEnabled = utils.noErrors(errorMessages);
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {t("職員")}
        </Typography>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1} ref={ref}>
          {membersInTerm.map((member) => (
            <Grid
              key={member.id}
              item={true}
              xs={12}
              id={`member-${member.id}`}
            >
              <Member member={member} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      <FloatingAddButton onClick={handleClickOpenCreationDialog} />
      <Dialog
        onClose={handleCloseCreationDialog}
        open={state.creationDialogIsOpen}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>{t("{{arg0}}の追加", { arg0: t("職員") })}</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.member.is_enabled && relativesAreEnabled}
                    disabled={!relativesAreEnabled}
                    onChange={handleChangeNewMemberIsEnabled}
                    color="primary"
                  />
                }
                label={t("有効")}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label={t("職員名")}
                value={state.member.name}
                onChange={handleChangeNewMemberName}
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
                          checked={state.group_ids.includes(group.id)}
                          onChange={handleChangeNewGroupMember(group.id)}
                          color="primary"
                        />
                      }
                    />
                  ))}
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button
            color="primary"
            disabled={Object.values(errorMessages).some(
              (messages) => messages.length > 0
            )}
            onClick={handleClickCreateMember}
          >
            {t("追加")}
          </Button>
          <Button color="primary" onClick={handleCloseCreationDialog}>
            {t("閉じる")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Members;
