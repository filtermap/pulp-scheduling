import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import classnames from "classnames";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as constraints4 from "../modules/constraints4";
import { RootState } from "../modules/store";
import Constraint4 from "./Constraint4";

type Props = WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint4IsEnabled: boolean;
  newConstraint4MemberId: number;
  newConstraint4KinmuId: number;
  newConstraint4MaxNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint4MaxNumberOfAssignments: string[];
};

function select(state: RootState) {
  return {
    constraints4: state.present.constraints4,
    kinmus: state.present.kinmus,
    members: state.present.members,
  };
}

function Constraints4(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const constraints4InTerm = selected.constraints4.filter(
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
    newConstraint4IsEnabled: true,
    newConstraint4KinmuId: kinmusInTerm.length > 0 ? kinmusInTerm[0].id : 0,
    newConstraint4MaxNumberOfAssignments:
      constraints4.minOfConstraint4MaxNumberOfAssignments,
    newConstraint4MemberId: membersInTerm.length > 0 ? membersInTerm[0].id : 0,
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
  const handleChangeNewConstraint4IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint4IsEnabled: event.target.checked,
    }));
  };
  const handleChangeNewConstraint4MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint4MemberId: parseInt(event.target.value, 10),
    }));
  };
  const handleChangeNewConstraint4KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint4KinmuId: parseInt(event.target.value, 10),
    }));
  };
  const validate = (
    newConstraint4MaxNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint4MaxNumberOfAssignments: [],
    };
    if (isNaN(newConstraint4MaxNumberOfAssignments)) {
      errorMessages.newConstraint4MaxNumberOfAssignments.push(
        "割り当て数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeNewConstraint4MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint4MaxNumberOfAssignments: parseInt(event.target.value, 10),
    }));
  };
  const handleClickCreateConstraint4 = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      constraints4.createConstraint4({
        term_id: termId,
        is_enabled: state.newConstraint4IsEnabled,
        member_id: state.newConstraint4MemberId,
        kinmu_id: state.newConstraint4KinmuId,
        max_number_of_assignments: state.newConstraint4MaxNumberOfAssignments,
      })
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
                職員の勤務の割り当て数の上限
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {constraints4InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint4 constraint4={c} />
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
            職員の勤務の割り当て数の上限を追加できません
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
          const newConstraint4Member = membersInTerm.find(
            ({ id }) => id === state.newConstraint4MemberId
          )!;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newConstraint4Kinmu = kinmusInTerm.find(
            ({ id }) => id === state.newConstraint4KinmuId
          )!;
          const relativesAreEnabled =
            newConstraint4Member.is_enabled && newConstraint4Kinmu.is_enabled;
          const errorMessages = validate(
            state.newConstraint4MaxNumberOfAssignments
          );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>職員の勤務の割り当て数の上限の追加</DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint4IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint4IsEnabled}
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
                      value={state.newConstraint4MemberId}
                      onChange={handleChangeNewConstraint4MemberId}
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
                      value={state.newConstraint4KinmuId}
                      onChange={handleChangeNewConstraint4KinmuId}
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
                      label="割り当て数上限"
                      type="number"
                      defaultValue={state.newConstraint4MaxNumberOfAssignments}
                      onChange={
                        handleChangeNewConstraint4MaxNumberOfAssignments
                      }
                      fullWidth={true}
                      inputProps={{
                        min: constraints4.minOfConstraint4MaxNumberOfAssignments,
                      }}
                      error={
                        errorMessages.newConstraint4MaxNumberOfAssignments
                          .length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint4MaxNumberOfAssignments.map(
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
                  onClick={handleClickCreateConstraint4}
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

export default withStyles(styles)(Constraints4);
