import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
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
import Group from "./Group";

const PREFIX = "Groups";

const classes = {
  gridFrame: `${PREFIX}-gridFrame`,
  toolbarTitle: `${PREFIX}-toolbarTitle`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")({
  [`& .${classes.gridFrame}`]: {
    padding: 8,
  },
  [`& .${classes.toolbarTitle}`]: {
    flex: 1,
  },
});

type State = {
  creationDialogIsOpen: boolean;
  newGroupIsEnabled: boolean;
  newGroupName: string;
  newGroupMemberIds: number[];
};

type ErrorMessages = {
  newGroupName: string[];
};
function Groups(): JSX.Element {
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
  const initialState = {
    creationDialogIsOpen: false,
    newGroupIsEnabled: true,
    newGroupName: "",
    newGroupMemberIds: [],
  };
  const [state, setState] = React.useState<State>(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setState(initialState), [membersInTerm]);
  const handleClickOpenCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: true }));
  };
  const handleCloseCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
  };
  const handleChangeNewGroupIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newGroupIsEnabled: event.target.checked,
    }));
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
    setState((state) => ({ ...state, newGroupName: event.target.value }));
  };
  const handleChangeNewGroupMember = (memberId: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        setState((state) => ({
          ...state,
          newGroupMemberIds: state.newGroupMemberIds.concat(memberId),
        }));
        return;
      }
      setState((state) => ({
        ...state,
        newGroupMemberIds: state.newGroupMemberIds.filter(
          (member_id) => member_id !== memberId
        ),
      }));
    };
  };
  const handleClickCreateGroup = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      all.addGroup({
        group: {
          term_id: termId,
          is_enabled: state.newGroupIsEnabled,
          name: state.newGroupName,
        },
        member_ids: state.newGroupMemberIds,
      })
    );
  };
  const errorMessages = validate(state.newGroupName);
  return (
    <Root>
      <div className={classes.gridFrame}>
        <Grid container={true} spacing={1}>
          <Grid item={true} xs={12}>
            <Toolbar>
              <Typography variant="subtitle1" className={classes.toolbarTitle}>
                グループ
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {groupsInTerm.map((group) => (
            <Grid key={group.id} item={true} xs={12}>
              <Group group={group} />
            </Grid>
          ))}
        </Grid>
      </div>
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
                defaultValue={state.newGroupName}
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
                      label={member.name}
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
    </Root>
  );
}

export default Groups;
