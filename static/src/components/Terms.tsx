import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import TextField from "@mui/material/TextField";
import DialogActions from "@mui/material/DialogActions";
import FormControlLabel from "@mui/material/FormControlLabel";
import Switch from "@mui/material/Switch";
import * as utils from "../utils";
import * as terms from "../modules/terms";
import { RootState } from "../modules/store";
import Term from "./Term";

type Props = WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newTermIsEnabled: boolean;
  newTermStartDateName: string;
  newTermStopDateName: string;
};

type ErrorMessages = {
  newTermStartDateName: string[];
  newTermStopDateName: string[];
};

function select(state: RootState) {
  return {
    terms: state.present.terms,
  };
}

function Terms(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const todayString = utils.dateToString(new Date());
  const [state, setState] = React.useState<State>({
    creationDialogIsOpen: false,
    newTermIsEnabled: true,
    newTermStartDateName: todayString,
    newTermStopDateName: todayString,
  });
  const handleClickOpenCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: true }));
  };
  const handleCloseCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
  };
  const handleChangeNewTerm1IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setState((state) => ({ ...state, newTermIsEnabled: checked }));
  };
  const validate = (
    newTermStartDateName: string,
    newTermStopDateName: string
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newTermStartDateName: [],
      newTermStopDateName: [],
    };
    if (!utils.stringToDate(newTermStartDateName)) {
      errorMessages.newTermStartDateName.push("開始日の形式が正しくありません");
    }
    if (!utils.stringToDate(newTermStopDateName)) {
      errorMessages.newTermStopDateName.push("終了日の形式が正しくありません");
    }
    return errorMessages;
  };
  const handleChangeNewTermStartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newTermStartDateName: event.target.value,
    }));
  };
  const handleChangeNewTermStopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newTermStopDateName: event.target.value,
    }));
  };
  const handleClickCreateTerm = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      terms.createTerm({
        is_enabled: state.newTermIsEnabled,
        start_date_name: state.newTermStartDateName,
        stop_date_name: state.newTermStopDateName,
      })
    );
  };
  const errorMessages = validate(
    state.newTermStartDateName,
    state.newTermStopDateName
  );
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
                期間
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {selected.terms.map((term) => (
            <Grid key={term.id} item={true} xs={12}>
              <Term term={term} />
            </Grid>
          ))}
        </Grid>
      </div>
      <Dialog
        onClose={handleCloseCreationDialog}
        open={state.creationDialogIsOpen}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>期間の追加</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.newTermIsEnabled}
                    onChange={handleChangeNewTerm1IsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label="開始日"
                type="date"
                defaultValue={state.newTermStartDateName}
                onChange={handleChangeNewTermStartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errorMessages.newTermStartDateName.length > 0}
                FormHelperTextProps={{
                  // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                  component: "div",
                }}
                helperText={errorMessages.newTermStartDateName.map(
                  (message) => (
                    <div key={message}>{message}</div>
                  )
                )}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label="終了日"
                type="date"
                defaultValue={state.newTermStopDateName}
                onChange={handleChangeNewTermStopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errorMessages.newTermStopDateName.length > 0}
                FormHelperTextProps={{
                  // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                  component: "div",
                }}
                helperText={errorMessages.newTermStopDateName.map((message) => (
                  <div key={message}>{message}</div>
                ))}
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
            onClick={handleClickCreateTerm}
          >
            追加
          </Button>
          <Button color="primary" onClick={handleCloseCreationDialog}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const styles = createStyles({
  gridFrame: {
    padding: 8,
  },
  toolbarTitle: {
    flex: 1,
  },
});

export default withStyles(styles)(Terms);
