import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import Grid from "@material-ui/core/Grid";
import MenuItem from "@material-ui/core/MenuItem";
import { WithStyles } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import classnames from "classnames";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { StateWithHistory } from "redux-undo";
import * as all from "../modules/all";
import * as constraints3 from "../modules/constraints3";
import Constraint3 from "./Constraint3";

type Props = WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint3IsEnabled: boolean;
  newConstraint3MemberId: number;
  newConstraint3KinmuId: number;
  newConstraint3MinNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint3MinNumberOfAssignments: string[];
};

function selector(state: StateWithHistory<all.State>) {
  return {
    constraints3: state.present.constraints3,
    kinmus: state.present.kinmus,
    members: state.present.members,
  };
}

function Constraints3(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(selector, shallowEqual);
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const constraints3InTerm = selected.constraints3.filter(
    ({ term_id }) => term_id === termId
  );
  const membersInTerm = selected.members.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const initialState = {
    creationDialogIsOpen: false,
    newConstraint3IsEnabled: true,
    newConstraint3KinmuId: kinmusInTerm.length > 0 ? kinmusInTerm[0].id : 0,
    newConstraint3MemberId: membersInTerm.length > 0 ? membersInTerm[0].id : 0,
    newConstraint3MinNumberOfAssignments:
      constraints3.minOfConstraint3MinNumberOfAssignments,
  };
  const [state, setState] = React.useState<State>(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setState(initialState), [termId]);
  const handleClickOpenCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: true }));
  };
  const handleCloseCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
  };
  const handleChangeNewConstraint3IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setState((state) => ({ ...state, newConstraint3IsEnabled: checked }));
  };
  const handleChangeNewConstraint3MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint3MemberId: parseInt(event.target.value, 10),
    }));
  };
  const handleChangeNewConstraint3KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint3KinmuId: parseInt(event.target.value, 10),
    }));
  };
  const validate = (
    newConstraint3MinNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint3MinNumberOfAssignments: [],
    };
    if (isNaN(newConstraint3MinNumberOfAssignments)) {
      errorMessages.newConstraint3MinNumberOfAssignments.push(
        "割り当て数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeNewConstraint3MinNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint3MinNumberOfAssignments: parseInt(event.target.value, 10),
    }));
  };
  const handleClickCreateConstraint3 = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      constraints3.createConstraint3(
        termId,
        state.newConstraint3IsEnabled,
        state.newConstraint3MemberId,
        state.newConstraint3KinmuId,
        state.newConstraint3MinNumberOfAssignments
      )
    );
  };
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
                職員の勤務の割り当て数の下限
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {constraints3InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint3 constraint3={c} />
            </Grid>
          ))}
        </Grid>
      </div>
      {membersInTerm.length === 0 || kinmusInTerm.length === 0 ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            職員の勤務の割り当て数の下限を追加できません
          </DialogTitle>
          <DialogContent>
            {membersInTerm.length === 0 ? (
              <DialogContentText>職員がいません</DialogContentText>
            ) : null}
            {kinmusInTerm.length === 0 ? (
              <DialogContentText>勤務がありません</DialogContentText>
            ) : null}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleCloseCreationDialog}>
              閉じる
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        (() => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newConstraint3Member = membersInTerm.find(
            ({ id }) => id === state.newConstraint3MemberId
          )!;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newConstraint3Kinmu = kinmusInTerm.find(
            ({ id }) => id === state.newConstraint3KinmuId
          )!;
          const relativesAreEnabled =
            newConstraint3Member.is_enabled && newConstraint3Kinmu.is_enabled;
          const errorMessages = validate(
            state.newConstraint3MinNumberOfAssignments
          );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>職員の勤務の割り当て数の下限の追加</DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint3IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint3IsEnabled}
                          color="primary"
                        />
                      }
                      label="有効"
                    />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label="職員"
                      value={state.newConstraint3MemberId}
                      onChange={handleChangeNewConstraint3MemberId}
                      fullWidth={true}
                    >
                      {membersInTerm.map((member) => (
                        <MenuItem key={member.id} value={member.id}>
                          {
                            <span
                              className={classnames({
                                [props.classes.lineThrough]: !member.is_enabled,
                              })}
                            >
                              {member.name}
                            </span>
                          }
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label="勤務"
                      value={state.newConstraint3KinmuId}
                      onChange={handleChangeNewConstraint3KinmuId}
                      fullWidth={true}
                    >
                      {kinmusInTerm.map((kinmu) => (
                        <MenuItem key={kinmu.id} value={kinmu.id}>
                          {
                            <span
                              className={classnames({
                                [props.classes.lineThrough]: !kinmu.is_enabled,
                              })}
                            >
                              {kinmu.name}
                            </span>
                          }
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      label="割り当て数下限"
                      type="number"
                      defaultValue={state.newConstraint3MinNumberOfAssignments}
                      onChange={
                        handleChangeNewConstraint3MinNumberOfAssignments
                      }
                      fullWidth={true}
                      inputProps={{
                        min: constraints3.minOfConstraint3MinNumberOfAssignments,
                      }}
                      error={
                        errorMessages.newConstraint3MinNumberOfAssignments
                          .length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint3MinNumberOfAssignments.map(
                        (message) => (
                          <div key={message}>{message}</div>
                        )
                      )}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  disabled={Object.values(errorMessages).some(
                    (messages) => messages.length > 0
                  )}
                  onClick={handleClickCreateConstraint3}
                >
                  追加
                </Button>
                <Button color="primary" onClick={handleCloseCreationDialog}>
                  閉じる
                </Button>
              </DialogActions>
            </Dialog>
          );
        })()
      )}
    </>
  );
}

const styles = createStyles({
  gridFrame: {
    padding: 8,
  },
  lineThrough: {
    "&::-webkit-datetime-edit-fields-wrapper": {
      textDecoration: "line-through",
    },
    textDecoration: "line-through",
  },
  toolbarTitle: {
    flex: 1,
  },
});

export default withStyles(styles)(Constraints3);
