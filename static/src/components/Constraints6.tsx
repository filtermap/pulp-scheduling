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
import * as constraints6 from "../modules/constraints6";
import * as kinmus from "../modules/kinmus";
import Constraint6 from "./Constraint6";

const PREFIX = "Constraints6";

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
  newConstraint6IsEnabled: boolean;
  newConstraint6KinmuId: number | undefined;
  newConstraint6MaxNumberOfDays: number;
};

type ErrorMessages = {
  newConstraint6MaxNumberOfDays: string[];
};

function Constraints6(): JSX.Element {
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints6 = useSelector(constraints6.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const constraints6InTerm = selectedConstraints6.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = React.useMemo(
    () => selectedKinmus.filter(({ term_id }) => term_id === termId),
    [selectedKinmus, termId]
  );
  const initialState = React.useMemo(
    () => ({
      creationDialogIsOpen: false,
      newConstraint6IsEnabled: true,
      newConstraint6KinmuId:
        kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined,
      newConstraint6MaxNumberOfDays:
        constraints6.minOfConstraint6MaxNumberOfDays,
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
  const handleChangeNewConstraint6IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint6IsEnabled: event.target.checked,
    }));
  };
  const handleChangeNewConstraint6KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint6KinmuId: parseInt(event.target.value, 10),
    }));
  };
  const validate = (newConstraint6MaxNumberOfDays: number): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint6MaxNumberOfDays: [],
    };
    if (isNaN(newConstraint6MaxNumberOfDays)) {
      errorMessages.newConstraint6MaxNumberOfDays.push(
        "連続日数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeNewConstraint6MaxNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint6MaxNumberOfDays: parseInt(event.target.value, 10),
    }));
  };
  const handleClickCreateConstraint6 = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      constraints6.add({
        term_id: termId,
        is_enabled: state.newConstraint6IsEnabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint6KinmuId!,
        max_number_of_days: state.newConstraint6MaxNumberOfDays,
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
                勤務の連続日数の上限
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {constraints6InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint6 constraint6={c} />
            </Grid>
          ))}
        </Grid>
      </div>
      {state.newConstraint6KinmuId ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>勤務の連続日数の上限を追加できません</DialogTitle>
          <DialogContent>
            {state.newConstraint6KinmuId && (
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
          const newConstraint6Kinmu =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedKinmuById[state.newConstraint6KinmuId]!;
          const relativesAreEnabled = newConstraint6Kinmu.is_enabled;
          const errorMessages = validate(state.newConstraint6MaxNumberOfDays);
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>勤務の連続日数の上限の追加</DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint6IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint6IsEnabled}
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
                      value={state.newConstraint6KinmuId}
                      onChange={handleChangeNewConstraint6KinmuId}
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
                    <TextField
                      label="連続日数上限"
                      type="number"
                      defaultValue={state.newConstraint6MaxNumberOfDays}
                      onChange={handleChangeNewConstraint6MaxNumberOfDays}
                      fullWidth={true}
                      inputProps={{
                        min: constraints6.minOfConstraint6MaxNumberOfDays,
                      }}
                      error={
                        errorMessages.newConstraint6MaxNumberOfDays.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint6MaxNumberOfDays.map(
                        (messages) => (
                          <div key={messages}>{messages}</div>
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
                  onClick={handleClickCreateConstraint6}
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
    </Root>
  );
}

export default Constraints6;
