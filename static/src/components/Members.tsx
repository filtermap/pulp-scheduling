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
import { StateWithHistory } from "redux-undo";
import { useParams } from "react-router";
import * as all from "../modules/all";
import Member from "./Member";

type Props = WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newMemberIsEnabled: boolean;
  newMemberName: string;
  newMemberGroupIndices: number[];
};

type ErrorMessages = {
  newMemberName: string[];
};

function selector(state: StateWithHistory<all.State>) {
  return {
    groups: state.present.groups,
    members: state.present.members,
  };
}

function Members(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(selector, shallowEqual);
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const initialState = {
    creationDialogIsOpen: false,
    newMemberGroupIndices: [],
    newMemberIsEnabled: true,
    newMemberName: "",
  };
  const [state, setState] = React.useState<State>(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setState(initialState), [termId]);
  const membersInTerm = selected.members.filter(
    ({ term_id }) => term_id === termId
  );
  const groupsInTerm = selected.groups.filter(
    ({ term_id }) => term_id === termId
  );
  const handleClickOpenCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: true }));
  };
  const handleCloseCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
  };
  const handleChangeNewMemberIsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setState((state) => ({ ...state, newMemberIsEnabled: checked }));
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
    return (_: React.ChangeEvent<HTMLInputElement>, checked: boolean) => {
      if (checked) {
        setState((state) => ({
          ...state,
          newMemberGroupIndices: state.newMemberGroupIndices.concat(groupId),
        }));
        return;
      }
      setState((state) => ({
        ...state,
        newMemberGroupIndices: state.newMemberGroupIndices.filter(
          (group_id) => group_id !== groupId
        ),
      }));
    };
  };
  const handleClickCreateMember = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      all.createMember(
        termId,
        state.newMemberIsEnabled,
        state.newMemberName,
        state.newMemberGroupIndices
      )
    );
  };
  const errorMessages = validate(state.newMemberName);
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
                職員
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {membersInTerm.map((member) => (
            <Grid key={member.id} item={true} xs={12}>
              <Member member={member} />
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
                          checked={state.newMemberGroupIndices.some(
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

const styles = createStyles({
  gridFrame: {
    padding: 8,
  },
  toolbarTitle: {
    flex: 1,
  },
});

export default withStyles(styles)(Members);
