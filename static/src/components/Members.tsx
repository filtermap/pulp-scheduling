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
import * as all from "../modules/all";
import * as groups from "../modules/groups";
import * as members from "../modules/members";
import Member from "./Member";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  newMemberIsEnabled: boolean;
  newMemberName: string;
  newMemberGroupIds: number[];
};

type ErrorMessages = {
  newMemberName: string[];
};

function Members(): JSX.Element {
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
  const initialState = React.useMemo(
    () => ({
      creationDialogIsOpen: false,
      newMemberGroupIds: [],
      newMemberIsEnabled: true,
      newMemberName: "",
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [groupsInTerm]
  );
  const [state, setState] = React.useState<State>(initialState);
  React.useEffect(() => setState(initialState), [initialState]);
  const handleClickOpenCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: true }));
  };
  const handleCloseCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
  };
  const handleChangeNewMemberIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newMemberIsEnabled: event.target.checked,
    }));
  };
  const validate = (newMemberName: string): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newMemberName: [],
    };
    if (newMemberName === "") {
      errorMessages.newMemberName.push("職員名を入力してください");
    }
    return errorMessages;
  };
  const handleChangeNewMemberName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({ ...state, newMemberName: event.target.value }));
  };
  const handleChangeNewGroupMember = (groupId: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setState((state) => ({
          ...state,
          newMemberGroupIds: state.newMemberGroupIds.concat(groupId),
        }));
        return;
      }
      setState((state) => ({
        ...state,
        newMemberGroupIds: state.newMemberGroupIds.filter(
          (group_id) => group_id !== groupId
        ),
      }));
    };
  };
  const handleClickCreateMember = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      all.createMember({
        member: {
          term_id: termId,
          is_enabled: state.newMemberIsEnabled,
          name: state.newMemberName,
        },
        group_ids: state.newMemberGroupIds,
      })
    );
  };
  const errorMessages = validate(state.newMemberName);
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          職員
        </Typography>
        <Button size="small" onClick={handleClickOpenCreationDialog}>
          追加
        </Button>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {membersInTerm.map((member) => (
            <Grid key={member.id} item={true} xs={12}>
              <Member member={member} />
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
        <DialogTitle>職員の追加</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.newMemberIsEnabled}
                    onChange={handleChangeNewMemberIsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label="職員名"
                defaultValue={state.newMemberName}
                onChange={handleChangeNewMemberName}
                fullWidth={true}
                error={errorMessages.newMemberName.length > 0}
                FormHelperTextProps={{
                  // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                  component: "div",
                }}
                helperText={errorMessages.newMemberName.map((message) => (
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
                          checked={state.newMemberGroupIds.some(
                            (group_id) => group_id === group.id
                          )}
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
            追加
          </Button>
          <Button color="primary" onClick={handleCloseCreationDialog}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Members;
