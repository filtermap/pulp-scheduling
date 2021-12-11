import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
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
import classnames from "classnames";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as all from "../modules/all";
import * as constraints0 from "../modules/constraints0";
import * as kinmus from "../modules/kinmus";
import Constraint0 from "./Constraint0";

const PREFIX = "Constraints0";

const classes = {
  gridFrame: `${PREFIX}-gridFrame`,
  lineThrough: `${PREFIX}-lineThrough`,
  toolbarTitle: `${PREFIX}-toolbarTitle`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")({
  [`& .${classes.gridFrame}`]: {
    padding: 8,
  },
  [`& .${classes.lineThrough}`]: {
    "&::-webkit-datetime-edit-fields-wrapper": {
      textDecoration: "line-through",
    },
    textDecoration: "line-through",
  },
  [`& .${classes.toolbarTitle}`]: {
    flex: 1,
  },
});

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
  const [state, setState] = React.useState<State>(initialState);
  React.useEffect(() => setState(initialState), [initialState]);
  const handleClickOpenCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: true }));
  };
  const handleCloseCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
  };
  const handleChangeNewConstraint0IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint0IsEnabled: event.target.checked,
    }));
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
      all.createConstraint0({
        constraint0: {
          term_id: termId,
          is_enabled: state.newConstraint0IsEnabled,
        },
        kinmu_ids: state.newConstraint0Constraint0KinmuKinmuIds,
      })
    );
  };
  return (
    <Root>
      <div className={classes.gridFrame}>
        <Grid container={true} spacing={1}>
          <Grid item={true} xs={12}>
            <Toolbar>
              <Typography variant="subtitle1" className={classes.toolbarTitle}>
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
                                      [classes.lineThrough]: !kinmu.is_enabled,
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
    </Root>
  );
}

export default Constraints0;
