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

import Group from "./Group";
import MemberName from "./names/MemberName";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  group: {
    is_enabled: boolean;
    name: string;
  };
  member_ids: number[];
};

// eslint-disable-next-line react/display-name
const Groups = React.memo((): JSX.Element => {
  const { t } = useTranslation();
  const [position, ref] = usePosition();
  useHashFragment(position?.top);
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const selectedMembers = useSelector(members.selectors.selectAll);
  const groupsInTerm = selectedGroups.filter(
    ({ term_id }) => term_id === termId
  );
  const membersInTerm = React.useMemo(
    () => selectedMembers.filter(({ term_id }) => term_id === termId),
    [selectedMembers, termId]
  );
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    group: {
      is_enabled: true,
      name: "",
    },
    member_ids: [],
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.member_ids = [];
      }),
    [membersInTerm, updateState]
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
  const handleChangeNewGroupIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.group.is_enabled = event.target.checked;
    });
  };
  const handleChangeNewGroupName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.group.name = event.target.value;
    });
  };
  const handleChangeNewGroupMember =
    (memberId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        updateState((state) => {
          state.member_ids.push(memberId);
        });
        return;
      }
      updateState((state) => {
        state.member_ids = state.member_ids.filter(
          (member_id) => member_id !== memberId
        );
      });
    };
  const handleClickCreateGroup = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      all.addGroup({
        group: {
          ...state.group,
          term_id: termId,
        },
        member_ids: state.member_ids,
      })
    );
  };
  const errorMessages = groups.getErrorMessages(t, { group: state.group });
  const relativesAreEnabled = utils.noErrors(errorMessages);
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {t("グループ")}
        </Typography>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1} ref={ref}>
          {groupsInTerm.map((group) => (
            <Grid key={group.id} item={true} xs={12} id={`group-${group.id}`}>
              <Group group={group} />
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
        <DialogTitle>
          {t("{{arg0}}の追加", { arg0: t("グループ") })}
        </DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.group.is_enabled && relativesAreEnabled}
                    disabled={!relativesAreEnabled}
                    onChange={handleChangeNewGroupIsEnabled}
                    color="primary"
                  />
                }
                label={t("有効")}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label={t("グループ名")}
                value={state.group.name}
                onChange={handleChangeNewGroupName}
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
                <FormLabel>{t("グループに所属する職員")}</FormLabel>
                <FormGroup>
                  {membersInTerm.map((member) => (
                    <FormControlLabel
                      key={member.id}
                      label={<MemberName member={member} />}
                      control={
                        <Checkbox
                          checked={state.member_ids.includes(member.id)}
                          onChange={handleChangeNewGroupMember(member.id)}
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
            onClick={handleClickCreateGroup}
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

export default Groups;
