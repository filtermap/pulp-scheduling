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
import * as constraints8 from "../modules/constraints8";
import { RootState } from "../modules/store";
import Constraint8 from "./Constraint8";

type Props = WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint8IsEnabled: boolean;
  newConstraint8KinmuId: number;
  newConstraint8MaxNumberOfDays: number;
};

type ErrorMessages = {
  newConstraint8MaxNumberOfDays: string[];
};

function select(state: RootState) {
  return {
    constraints8: state.present.constraints8,
    kinmus: state.present.kinmus,
  };
}

function Constraints8(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const constraints8InTerm = selected.constraints8.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const initialState = {
    creationDialogIsOpen: false,
    newConstraint8IsEnabled: true,
    newConstraint8KinmuId: kinmusInTerm.length > 0 ? kinmusInTerm[0].id : 0,
    newConstraint8MaxNumberOfDays: constraints8.minOfConstraint8MaxNumberOfDays,
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
  const handleChangeNewConstraint8IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setState((state) => ({ ...state, newConstraint8IsEnabled: checked }));
  };
  const handleChangeNewConstraint8KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint8KinmuId: parseInt(event.target.value, 10),
    }));
  };
  const validate = (newConstraint8MaxNumberOfDays: number): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint8MaxNumberOfDays: [],
    };
    if (isNaN(newConstraint8MaxNumberOfDays)) {
      errorMessages.newConstraint8MaxNumberOfDays.push(
        "間隔日数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeNewConstraint8MaxNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint8MaxNumberOfDays: parseInt(event.target.value, 10),
    }));
  };
  const handleClickCreateConstraint8 = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      constraints8.createConstraint8({
        term_id: termId,
        is_enabled: state.newConstraint8IsEnabled,
        kinmu_id: state.newConstraint8KinmuId,
        max_number_of_days: state.newConstraint8MaxNumberOfDays,
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
                勤務の間隔日数の上限
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {constraints8InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint8 constraint8={c} />
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
          <DialogTitle>勤務の間隔日数の上限を追加できません</DialogTitle>
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
          const newConstraint8Kinmu = kinmusInTerm.find(
            ({ id }) => id === state.newConstraint8KinmuId
          )!;
          const relativesAreEnabled = newConstraint8Kinmu.is_enabled;
          const errorMessages = validate(state.newConstraint8MaxNumberOfDays);
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>勤務の間隔日数の下限の追加</DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint8IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint8IsEnabled}
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
                      value={state.newConstraint8KinmuId}
                      onChange={handleChangeNewConstraint8KinmuId}
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
                      label="間隔日数下限"
                      type="number"
                      defaultValue={state.newConstraint8MaxNumberOfDays}
                      onChange={handleChangeNewConstraint8MaxNumberOfDays}
                      fullWidth={true}
                      inputProps={{
                        min: constraints8.minOfConstraint8MaxNumberOfDays,
                      }}
                      error={
                        errorMessages.newConstraint8MaxNumberOfDays.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint8MaxNumberOfDays.map(
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
                  onClick={handleClickCreateConstraint8}
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

export default withStyles(styles)(Constraints8);
