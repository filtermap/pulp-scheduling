import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useImmer } from "use-immer";

import * as terms from "../modules/terms";
import * as utils from "../utils";

import Term from "./Term";
import GridFrame from "./parts/GridFrame";

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

const Terms = (): JSX.Element => {
  const dispatch = useDispatch();
  const selectedTerms = useSelector(terms.selectors.selectAll);
  const todayString = utils.dateToString(new Date());
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    newTermIsEnabled: true,
    newTermStartDateName: todayString,
    newTermStopDateName: todayString,
  });
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
  const handleChangeNewTerm1IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newTermIsEnabled = event.target.checked;
    });
  };
  const validate = (
    newTermStartDateName: string,
    newTermStopDateName: string
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newTermStartDateName: [],
      newTermStopDateName: [],
    };
    if (!utils.stringToDate(newTermStartDateName))
      errorMessages.newTermStartDateName.push("開始日の形式が正しくありません");
    if (!utils.stringToDate(newTermStopDateName))
      errorMessages.newTermStopDateName.push("終了日の形式が正しくありません");
    return errorMessages;
  };
  const handleChangeNewTermStartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newTermStartDateName = event.target.value;
    });
  };
  const handleChangeNewTermStopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newTermStopDateName = event.target.value;
    });
  };
  const handleClickCreateTerm = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      terms.add({
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
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          期間
        </Typography>
        <Button size="small" onClick={handleClickOpenCreationDialog}>
          追加
        </Button>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {selectedTerms.map((term) => (
            <Grid key={term.id} item={true} xs={12}>
              <Term term={term} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
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
                value={state.newTermStartDateName}
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
                value={state.newTermStopDateName}
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
};

export default Terms;
