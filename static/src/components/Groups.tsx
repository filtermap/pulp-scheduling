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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useImmer } from "use-immer";

import * as all from "../modules/all";
import * as groups from "../modules/groups";
import * as members from "../modules/members";

import Group from "./Group";
import MemberName from "./names/MemberName";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  newGroupIsEnabled: boolean;
  newGroupName: string;
  newGroupMemberIds: number[];
};

type ErrorMessages = {
  newGroupName: string[];
};

const Groups = (): JSX.Element => {
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
    newGroupIsEnabled: true,
    newGroupMemberIds: [],
    newGroupName: "",
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.newGroupMemberIds = [];
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
      state.newGroupIsEnabled = event.target.checked;
    });
  };
  const validate = (newGroupName: string): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newGroupName: [],
    };
    if (newGroupName === "") {
      errorMessages.newGroupName.push("グループ名を入力してください");
    }
    return errorMessages;
  };
  const handleChangeNewGroupName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newGroupName = event.target.value;
    });
  };
  const handleChangeNewGroupMember =
    (memberId: number) => (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        updateState((state) => {
          state.newGroupMemberIds.push(memberId);
        });
        return;
      }
      updateState((state) => {
        state.newGroupMemberIds = state.newGroupMemberIds.filter(
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
          is_enabled: state.newGroupIsEnabled,
          name: state.newGroupName,
          term_id: termId,
        },
        member_ids: state.newGroupMemberIds,
      })
    );
  };
  const errorMessages = validate(state.newGroupName);
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          グループ
        </Typography>
        <Button size="small" onClick={handleClickOpenCreationDialog}>
          追加
        </Button>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {groupsInTerm.map((group) => (
            <Grid key={group.id} item={true} xs={12}>
              <Group group={group} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      <Dialog
        onClose={handleCloseCreationDialog}
        open={state.creationDialogIsOpen}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>グループの追加</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.newGroupIsEnabled}
                    onChange={handleChangeNewGroupIsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label="グループ名"
                value={state.newGroupName}
                onChange={handleChangeNewGroupName}
                fullWidth={true}
                error={errorMessages.newGroupName.length > 0}
                FormHelperTextProps={{
                  // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                  component: "div",
                }}
                helperText={errorMessages.newGroupName.map((message) => (
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
                      label={<MemberName member={member} />}
                      control={
                        <Checkbox
                          checked={state.newGroupMemberIds.some(
                            (member_id) => member_id === member.id
                          )}
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
            追加
          </Button>
          <Button color="primary" onClick={handleCloseCreationDialog}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Groups;
