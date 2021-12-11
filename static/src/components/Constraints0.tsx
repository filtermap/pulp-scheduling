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
import Constraint0 from "./Constraint0";

type Props = WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint0IsEnabled: boolean;
  newConstraint0Constraint0KinmuKinmuIds: number[];
};

function selector(state: StateWithHistory<all.State>) {
  return {
    constraints0: state.present.constraints0,
    kinmus: state.present.kinmus,
  };
}

function Constraints0(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(selector, shallowEqual);
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const constraints0InTerm = selected.constraints0.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const initialState = {
    creationDialogIsOpen: false,
    newConstraint0Constraint0KinmuKinmuIds:
      kinmusInTerm.length > 0 ? [kinmusInTerm[0].id, kinmusInTerm[0].id] : [],
    newConstraint0IsEnabled: true,
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
  const handleChangeNewConstraint0IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setState((state) => ({ ...state, newConstraint0IsEnabled: checked }));
  };
  const handleClickCreateNewConstraint0Constraint0Kinmu = (id: number) => {
    return () => {
      const newConstraint0Constraint0KinmuKinmuIds = [
        ...state.newConstraint0Constraint0KinmuKinmuIds,
      ];
      newConstraint0Constraint0KinmuKinmuIds.splice(id, 0, kinmusInTerm[0].id);
      setState((state) => ({
        ...state,
        newConstraint0Constraint0KinmuKinmuIds,
      }));
    };
  };
  const handleChangeNewConstraint0Constraint0KinmuKinmuId = (
    newConstraint0Constraint0KinmuKinmuIdsIndex: number
  ) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      setState((state) => ({
        ...state,
        newConstraint0Constraint0KinmuKinmuIds:
          state.newConstraint0Constraint0KinmuKinmuIds.map((kinmuId, index) => {
            if (index !== newConstraint0Constraint0KinmuKinmuIdsIndex) {
              return kinmuId;
            }
            return parseInt(event.target.value, 10);
          }),
      }));
    };
  };
  const handleClickDeleteNewConstraint0Constraint0Kinmu = (
    newConstraint0Constraint0KinmuKinmuIdsId: number
  ) => {
    return () => {
      setState((state) => ({
        ...state,
        newConstraint0Constraint0KinmuKinmuIds:
          state.newConstraint0Constraint0KinmuKinmuIds.filter(
            (_, id) => id !== newConstraint0Constraint0KinmuKinmuIdsId
          ),
      }));
    };
  };
  const handleClickCreateConstraint0 = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      all.createConstraint0(
        termId,
        state.newConstraint0IsEnabled,
        state.newConstraint0Constraint0KinmuKinmuIds
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
                連続禁止勤務並び
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {constraints0InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint0 constraint0={c} />
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
          <DialogTitle>連続禁止勤務並びを追加できません</DialogTitle>
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
          const newConstraint0Constraint0KinmuKinmus =
            state.newConstraint0Constraint0KinmuKinmuIds.map(
              (kinmu_id) =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                kinmusInTerm.find(({ id }) => id === kinmu_id)!
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
                    (kinmuId, id) => (
                      <React.Fragment key={`${id}-${kinmuId}`}>
                        <Grid item={true} xs={12}>
                          <TextField
                            select={true}
                            label={`勤務${id + 1}`}
                            value={kinmuId}
                            onChange={handleChangeNewConstraint0Constraint0KinmuKinmuId(
                              id
                            )}
                            fullWidth={true}
                          >
                            {kinmusInTerm.map((kinmu) => (
                              <MenuItem key={kinmu.id} value={kinmu.id}>
                                {
                                  <span
                                    className={classnames({
                                      [props.classes.lineThrough]:
                                        !kinmu.is_enabled,
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
                          {state.newConstraint0Constraint0KinmuKinmuIds.length >
                            2 && (
                            <Button
                              size="small"
                              onClick={handleClickDeleteNewConstraint0Constraint0Kinmu(
                                id
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
                              id + 1
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

export default withStyles(styles)(Constraints0);
