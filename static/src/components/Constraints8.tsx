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

import * as constraints8 from "../modules/constraints8";
import * as kinmus from "../modules/kinmus";

import Constraint8 from "./Constraint8";
import KinmuName from "./names/KinmuName";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint8IsEnabled: boolean;
  newConstraint8KinmuId: number | undefined;
  newConstraint8MaxNumberOfDays: number;
};

type ErrorMessages = {
  newConstraint8MaxNumberOfDays: string[];
};

// eslint-disable-next-line react/display-name
const Constraints8 = React.memo((): JSX.Element => {
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints8 = useSelector(constraints8.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const constraints8InTerm = selectedConstraints8.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const newConstraint8KinmuId =
    kinmusInTerm.length > 0 ? kinmusInTerm[0].id : 0;
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    newConstraint8IsEnabled: true,
    newConstraint8KinmuId,
    newConstraint8MaxNumberOfDays: constraints8.minOfConstraint8MaxNumberOfDays,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.newConstraint8KinmuId = newConstraint8KinmuId;
      }),
    [newConstraint8KinmuId, updateState]
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
  const handleChangeNewConstraint8IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint8IsEnabled = event.target.checked;
    });
  };
  const handleChangeNewConstraint8KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint8KinmuId = parseInt(event.target.value, 10);
    });
  };
  const validate = (newConstraint8MaxNumberOfDays: number): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint8MaxNumberOfDays: [],
    };
    if (isNaN(newConstraint8MaxNumberOfDays))
      errorMessages.newConstraint8MaxNumberOfDays.push(
        "間隔日数下限の形式が正しくありません"
      );
    return errorMessages;
  };
  const handleChangeNewConstraint8MaxNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint8MaxNumberOfDays = parseInt(event.target.value, 10);
    });
  };
  const handleClickCreateConstraint8 = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      constraints8.add({
        is_enabled: state.newConstraint8IsEnabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint8KinmuId!,
        max_number_of_days: state.newConstraint8MaxNumberOfDays,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          勤務の間隔日数の上限
        </Typography>
        <Button size="small" onClick={handleClickOpenCreationDialog}>
          追加
        </Button>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {constraints8InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint8 constraint8={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      {state.newConstraint8KinmuId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>勤務の間隔日数の上限を追加できません</DialogTitle>
          <DialogContent>
            {state.newConstraint8KinmuId === undefined && (
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
          const newConstraint8Kinmu =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedKinmuById[state.newConstraint8KinmuId]!;
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
                          <KinmuName kinmu={kinmu} />
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      label="間隔日数下限"
                      type="number"
                      value={state.newConstraint8MaxNumberOfDays}
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
});

export default Constraints8;
