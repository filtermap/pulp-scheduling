import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useImmer } from "use-immer";

import * as constraints5 from "../modules/constraints5";
import * as kinmus from "../modules/kinmus";

import Constraint5 from "./Constraint5";
import KinmuName from "./names/KinmuName";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint5IsEnabled: boolean;
  newConstraint5KinmuId: number | undefined;
  newConstraint5MinNumberOfDays: number;
};

type ErrorMessages = {
  newConstraint5MinNumberOfDays: string[];
};

// eslint-disable-next-line react/display-name
const Constraints5 = React.memo((): JSX.Element => {
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints5 = useSelector(constraints5.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const constraints5InTerm = selectedConstraints5.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const newConstraint5KinmuId =
    kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined;
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    newConstraint5IsEnabled: true,
    newConstraint5KinmuId,
    newConstraint5MinNumberOfDays: constraints5.minOfConstraint5MinNumberOfDays,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.newConstraint5KinmuId = newConstraint5KinmuId;
      }),
    [newConstraint5KinmuId, updateState]
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
  const handleChangeNewConstraint5IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint5IsEnabled = event.target.checked;
    });
  };
  const handleChangeNewConstraint5KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint5KinmuId = parseInt(event.target.value, 10);
    });
  };
  const validate = (newConstraint5MinNumberOfDays: number): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint5MinNumberOfDays: [],
    };
    if (isNaN(newConstraint5MinNumberOfDays))
      errorMessages.newConstraint5MinNumberOfDays.push(
        "連続日数下限の形式が正しくありません"
      );
    return errorMessages;
  };
  const handleChangeNewConstraint5MinNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint5MinNumberOfDays = parseInt(event.target.value, 10);
    });
  };
  const handleClickCreateConstraint5 = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      constraints5.add({
        is_enabled: state.newConstraint5IsEnabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint5KinmuId!,
        min_number_of_days: state.newConstraint5MinNumberOfDays,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          勤務の連続日数の下限
        </Typography>
        <Button size="small" onClick={handleClickOpenCreationDialog}>
          追加
        </Button>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {constraints5InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint5 constraint5={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      {state.newConstraint5KinmuId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>勤務の連続日数の下限を追加できません</DialogTitle>
          <DialogContent>
            {state.newConstraint5KinmuId === undefined && (
              <DialogContentText>勤務がありません</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleCloseCreationDialog}>
              閉じる
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        (() => {
          const newConstraint5Kinmu =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedKinmuById[state.newConstraint5KinmuId]!;
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
                          <KinmuName kinmu={kinmu} />
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      label="連続日数下限"
                      type="number"
                      value={state.newConstraint5MinNumberOfDays}
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
});

export default Constraints5;
