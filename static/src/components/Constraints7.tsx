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

import * as constraints7 from "../modules/constraints7";
import * as kinmus from "../modules/kinmus";

import Constraint7 from "./Constraint7";
import KinmuName from "./names/KinmuName";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint7IsEnabled: boolean;
  newConstraint7KinmuId: number | undefined;
  newConstraint7MinNumberOfDays: number;
};

type ErrorMessages = {
  newConstraint7MinNumberOfDays: string[];
};

// eslint-disable-next-line react/display-name
const Constraints7 = React.memo((): JSX.Element => {
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints7 = useSelector(constraints7.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const constraints7InTerm = selectedConstraints7.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const newConstraint7KinmuId =
    kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined;
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    newConstraint7IsEnabled: true,
    newConstraint7KinmuId,
    newConstraint7MinNumberOfDays: constraints7.minOfConstraint7MinNumberOfDays,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.newConstraint7KinmuId = newConstraint7KinmuId;
      }),
    [newConstraint7KinmuId, updateState]
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
  const handleChangeNewConstraint7IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint7IsEnabled = event.target.checked;
    });
  };
  const handleChangeNewConstraint7KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint7KinmuId = parseInt(event.target.value, 10);
    });
  };
  const validate = (newConstraint7MinNumberOfDays: number): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint7MinNumberOfDays: [],
    };
    if (isNaN(newConstraint7MinNumberOfDays))
      errorMessages.newConstraint7MinNumberOfDays.push(
        "間隔日数下限の形式が正しくありません"
      );
    return errorMessages;
  };
  const handleChangeNewConstraint7MinNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint7MinNumberOfDays = parseInt(event.target.value, 10);
    });
  };
  const handleClickCreateConstraint7 = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      constraints7.add({
        is_enabled: state.newConstraint7IsEnabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint7KinmuId!,
        min_number_of_days: state.newConstraint7MinNumberOfDays,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          勤務の間隔日数の下限
        </Typography>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {constraints7InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12} id={`constraint7-${c.id}`}>
              <Constraint7 constraint7={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      <FloatingAddButton onClick={handleClickOpenCreationDialog} />
      {state.newConstraint7KinmuId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>勤務の間隔日数の下限を追加できません</DialogTitle>
          <DialogContent>
            {state.newConstraint7KinmuId === undefined && (
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
          const newConstraint7Kinmu =
            selectedKinmuById[state.newConstraint7KinmuId];
          const relativesAreEnabled = newConstraint7Kinmu?.is_enabled;
          const errorMessages = validate(state.newConstraint7MinNumberOfDays);
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
                            state.newConstraint7IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint7IsEnabled}
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
                      value={state.newConstraint7KinmuId}
                      onChange={handleChangeNewConstraint7KinmuId}
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
                      label="間隔日数下限"
                      type="number"
                      value={state.newConstraint7MinNumberOfDays}
                      onChange={handleChangeNewConstraint7MinNumberOfDays}
                      fullWidth={true}
                      inputProps={{
                        min: constraints7.minOfConstraint7MinNumberOfDays,
                      }}
                      error={
                        errorMessages.newConstraint7MinNumberOfDays.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint7MinNumberOfDays.map(
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
                  onClick={handleClickCreateConstraint7}
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

export default Constraints7;
