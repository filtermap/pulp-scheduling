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

import { m } from "../messages";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import Term from "./Term";
import FloatingAddButton from "./parts/FloatingAddButton";
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

// eslint-disable-next-line react/display-name
const Terms = React.memo((): JSX.Element => {
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
    const newTermStartDate = utils.stringToDate(newTermStartDateName);
    const newTermStopDate = utils.stringToDate(newTermStopDateName);
    if (!newTermStartDate)
      errorMessages.newTermStartDateName.push(
        m["arg0の形式が正しくありません"](m["開始日"])
      );
    if (!newTermStopDate)
      errorMessages.newTermStopDateName.push(
        m["arg0の形式が正しくありません"](m["終了日"])
      );
    if (
      newTermStartDate &&
      newTermStopDate &&
      newTermStartDate > newTermStopDate
    ) {
      errorMessages.newTermStartDateName.push(
        m["arg0にはarg1より過去の日付を入力してください"](
          m["開始日"],
          m["終了日"]
        )
      );
      errorMessages.newTermStopDateName.push(
        m["arg0にはarg1より未来の日付を入力してください"](
          m["終了日"],
          m["開始日"]
        )
      );
    }
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
  const newTermStartDate = utils.stringToDate(state.newTermStartDateName);
  const newTermStopDate = utils.stringToDate(state.newTermStopDateName);
  const newTermStartDateIsEnabled = !!newTermStartDate;
  const newTermStopDateIsEnabled = !!newTermStopDate;
  const newTermStartDateAndStopDateAreEnabled =
    (newTermStartDate &&
      newTermStopDate &&
      newTermStartDate <= newTermStopDate) ||
    false;
  const relativesAreEnabled =
    newTermStartDateIsEnabled &&
    newTermStopDateIsEnabled &&
    newTermStartDateAndStopDateAreEnabled;
  const errorMessages = validate(
    state.newTermStartDateName,
    state.newTermStopDateName
  );
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {m["期間"]}
        </Typography>
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
      <FloatingAddButton onClick={handleClickOpenCreationDialog} />
      <Dialog
        onClose={handleCloseCreationDialog}
        open={state.creationDialogIsOpen}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>{m["arg0の追加"](m["期間"])}</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.newTermIsEnabled && relativesAreEnabled}
                    disabled={!relativesAreEnabled}
                    onChange={handleChangeNewTerm1IsEnabled}
                    color="primary"
                  />
                }
                label={m["有効"]}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label={m["開始日"]}
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
                label={m["終了日"]}
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
            {m["追加"]}
          </Button>
          <Button color="primary" onClick={handleCloseCreationDialog}>
            {m["閉じる"]}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Terms;
