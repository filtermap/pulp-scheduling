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

import * as all from "../modules/all";
import * as constraints0 from "../modules/constraints0";
import * as kinmus from "../modules/kinmus";

import Constraint0 from "./Constraint0";
import KinmuName from "./names/KinmuName";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint0IsEnabled: boolean;
  newConstraint0Constraint0KinmuKinmuIds: number[];
};

function Constraints0(): JSX.Element {
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints0 = useSelector(constraints0.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const constraints0InTerm = selectedConstraints0.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = React.useMemo(
    () => selectedKinmus.filter(({ term_id }) => term_id === termId),
    [selectedKinmus, termId]
  );
  const initialState = React.useMemo(
    () => ({
      creationDialogIsOpen: false,
      newConstraint0Constraint0KinmuKinmuIds:
        kinmusInTerm.length > 0 ? [kinmusInTerm[0].id, kinmusInTerm[0].id] : [],
      newConstraint0IsEnabled: true,
    }),
    [kinmusInTerm]
  );
  const [state, updateState] = useImmer<State>(initialState);
  React.useEffect(() => updateState(initialState), [initialState, updateState]);
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
  const handleChangeNewConstraint0IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint0IsEnabled = event.target.checked;
    });
  };
  const handleClickCreateNewConstraint0Constraint0Kinmu = (index: number) => {
    return () => {
      updateState((state) => {
        state.newConstraint0Constraint0KinmuKinmuIds.splice(
          index,
          0,
          kinmusInTerm[0].id
        );
      });
    };
  };
  const handleChangeNewConstraint0Constraint0KinmuKinmuId = (index: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      updateState((state) => {
        state.newConstraint0Constraint0KinmuKinmuIds[index] = parseInt(
          event.target.value,
          10
        );
      });
    };
  };
  const handleClickDeleteNewConstraint0Constraint0Kinmu = (index: number) => {
    return () => {
      updateState((state) => {
        state.newConstraint0Constraint0KinmuKinmuIds.splice(index, 1);
      });
    };
  };
  const handleClickCreateConstraint0 = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      all.addConstraint0({
        constraint0: {
          term_id: termId,
          is_enabled: state.newConstraint0IsEnabled,
        },
        kinmu_ids: state.newConstraint0Constraint0KinmuKinmuIds,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          連続禁止勤務並び
        </Typography>
        <Button size="small" onClick={handleClickOpenCreationDialog}>
          追加
        </Button>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {constraints0InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint0 constraint0={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      {kinmusInTerm.length === 0 ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>連続禁止勤務並びを追加できません</DialogTitle>
          <DialogContent>
            {kinmusInTerm.length === 0 && (
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
          const newConstraint0Constraint0KinmuKinmus =
            state.newConstraint0Constraint0KinmuKinmuIds.map(
              (kinmu_id) =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                selectedKinmuById[kinmu_id]!
            );
          const relativesAreEnabled =
            newConstraint0Constraint0KinmuKinmus.every(
              ({ is_enabled }) => is_enabled
            );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>連続禁止勤務並びの追加</DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint0IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint0IsEnabled}
                          color="primary"
                        />
                      }
                      label="有効"
                    />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <Button
                      size="small"
                      onClick={handleClickCreateNewConstraint0Constraint0Kinmu(
                        0
                      )}
                    >
                      追加
                    </Button>
                  </Grid>
                  {state.newConstraint0Constraint0KinmuKinmuIds.map(
                    (kinmuId, index) => (
                      <React.Fragment key={`${index}-${kinmuId}`}>
                        <Grid item={true} xs={12}>
                          <TextField
                            select={true}
                            label={`勤務${index + 1}`}
                            value={kinmuId}
                            onChange={handleChangeNewConstraint0Constraint0KinmuKinmuId(
                              index
                            )}
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
                          {state.newConstraint0Constraint0KinmuKinmuIds.length >
                            2 && (
                            <Button
                              size="small"
                              onClick={handleClickDeleteNewConstraint0Constraint0Kinmu(
                                index
                              )}
                            >
                              削除
                            </Button>
                          )}
                        </Grid>
                        <Grid item={true} xs={12}>
                          <Button
                            size="small"
                            onClick={handleClickCreateNewConstraint0Constraint0Kinmu(
                              index + 1
                            )}
                          >
                            追加
                          </Button>
                        </Grid>
                      </React.Fragment>
                    )
                  )}
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button color="primary" onClick={handleClickCreateConstraint0}>
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

export default Constraints0;
