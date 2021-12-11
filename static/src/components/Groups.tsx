import Button from "@material-ui/core/Button";
import Checkbox from "@material-ui/core/Checkbox";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControl from "@material-ui/core/FormControl";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import FormLabel from "@material-ui/core/FormLabel";
import Grid from "@material-ui/core/Grid";
import { WithStyles } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as all from "../modules/all";
import { RootState } from "../modules/store";
import Group from "./Group";

type Props = WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newGroupIsEnabled: boolean;
  newGroupName: string;
  newGroupMemberIds: number[];
};

type ErrorMessages = {
  newGroupName: string[];
};

function select(state: RootState) {
  return {
    groups: state.present.groups,
    members: state.present.members,
  };
}

function Groups(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const initialState = {
    creationDialogIsOpen: false,
    newGroupIsEnabled: true,
    newGroupMemberIds: [],
    newGroupName: "",
  };
  const [state, setState] = React.useState<State>(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setState(initialState), [termId]);
  const groupsInTerm = selected.groups.filter(
    ({ term_id }) => term_id === termId
  );
  const membersInTerm = selected.members.filter(
    ({ term_id }) => term_id === termId
  );
  const handleClickOpenCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: true }));
  };
  const handleCloseCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
  };
  const handleChangeNewGroupIsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setState((state) => ({ ...state, newGroupIsEnabled: checked }));
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
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
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
      all.createGroup({
        term_id: termId,
        is_enabled: state.newGroupIsEnabled,
        name: state.newGroupName,
        member_ids: state.newGroupMemberIds,
      })
    );
  };
  const errorMessages = validate(state.newGroupName);
  return (
    <>
      <div className={props.classes.gridFrame}>
        <Grid container={true} spacing={1}>
          <Grid item={true} xs={12}>
            <Toolbar>
              <Typography
                variant="subtitle1"
                className={props.classes.toolbarTitle}
              >
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
    </>
  );
}

const styles = createStyles({
  gridFrame: {
    padding: 8,
  },
  toolbarTitle: {
    flex: 1,
  },
});

export default withStyles(styles)(Groups);
