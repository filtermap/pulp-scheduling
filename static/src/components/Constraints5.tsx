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
import * as constraints5 from "../modules/constraints5";
import { RootState } from "../modules/store";
import Constraint5 from "./Constraint5";

type Props = WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint5IsEnabled: boolean;
  newConstraint5KinmuId: number;
  newConstraint5MinNumberOfDays: number;
};

type ErrorMessages = {
  newConstraint5MinNumberOfDays: string[];
};

function select(state: RootState) {
  return {
    constraints5: state.present.constraints5,
    kinmus: state.present.kinmus,
    members: state.present.members,
  };
}

function Constraints5(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const constraints5InTerm = selected.constraints5.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const initialState = {
    creationDialogIsOpen: false,
    newConstraint5IsEnabled: true,
    newConstraint5KinmuId: kinmusInTerm.length > 0 ? kinmusInTerm[0].id : 0,
    newConstraint5MinNumberOfDays: constraints5.minOfConstraint5MinNumberOfDays,
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
  const handleChangeNewConstraint5IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setState((state) => ({ ...state, newConstraint5IsEnabled: checked }));
  };
  const handleChangeNewConstraint5KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint5KinmuId: parseInt(event.target.value, 10),
    }));
  };
  const validate = (newConstraint5MinNumberOfDays: number): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint5MinNumberOfDays: [],
    };
    if (isNaN(newConstraint5MinNumberOfDays)) {
      errorMessages.newConstraint5MinNumberOfDays.push(
        "連続日数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeNewConstraint5MinNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint5MinNumberOfDays: parseInt(event.target.value, 10),
    }));
  };
  const handleClickCreateConstraint5 = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      constraints5.createConstraint5({
        term_id: termId,
        is_enabled: state.newConstraint5IsEnabled,
        kinmu_id: state.newConstraint5KinmuId,
        min_number_of_days: state.newConstraint5MinNumberOfDays,
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
                勤務の連続日数の下限
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {constraints5InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint5 constraint5={c} />
            </Grid>
          ))}
        </Grid>
      </div>
      {kinmusInTerm.length === 0 ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>勤務の連続日数の下限を追加できません</DialogTitle>
          <DialogContent>
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
          const newConstraint5Kinmu = kinmusInTerm.find(
            ({ id }) => id === state.newConstraint5KinmuId
          )!;
          const relativesAreEnabled = newConstraint5Kinmu.is_enabled;
          const errorMessages = validate(state.newConstraint5MinNumberOfDays);
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>勤務の連続日数の下限の追加</DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint5IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint5IsEnabled}
                          color="primary"
                        />
                      }
                      label="有効"
                    />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label="勤務"
                      value={state.newConstraint5KinmuId}
                      onChange={handleChangeNewConstraint5KinmuId}
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
                      label="連続日数下限"
                      type="number"
                      defaultValue={state.newConstraint5MinNumberOfDays}
                      onChange={handleChangeNewConstraint5MinNumberOfDays}
                      fullWidth={true}
                      inputProps={{
                        min: constraints5.minOfConstraint5MinNumberOfDays,
                      }}
                      error={
                        errorMessages.newConstraint5MinNumberOfDays.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint5MinNumberOfDays.map(
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
                  onClick={handleClickCreateConstraint5}
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

export default withStyles(styles)(Constraints5);
