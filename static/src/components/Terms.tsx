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
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useImmer } from "use-immer";

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

// eslint-disable-next-line react/display-name
const Terms = React.memo((): JSX.Element => {
  const { t } = useTranslation();
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
  const errorMessages = terms.getErrorMessages(t, {
    start_date_name: state.newTermStartDateName,
    stop_date_name: state.newTermStopDateName,
  });
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {t("期間")}
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
        <DialogTitle>{t("{{arg0}}の追加", { arg0: t("期間") })}</DialogTitle>
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
                label={t("有効")}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label={t("開始日")}
                type="date"
                value={state.newTermStartDateName}
                onChange={handleChangeNewTermStartDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errorMessages.start_date_name.length > 0}
                FormHelperTextProps={{
                  // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                  component: "div",
                }}
                helperText={errorMessages.stop_date_name.map((message) => (
                  <div key={message}>{message}</div>
                ))}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label={t("終了日")}
                type="date"
                value={state.newTermStopDateName}
                onChange={handleChangeNewTermStopDateName}
                fullWidth={true}
                InputLabelProps={{
                  shrink: true,
                }}
                error={errorMessages.start_date_name.length > 0}
                FormHelperTextProps={{
                  // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                  component: "div",
                }}
                helperText={errorMessages.stop_date_name.map((message) => (
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
            {t("追加")}
          </Button>
          <Button color="primary" onClick={handleCloseCreationDialog}>
            {t("閉じる")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Terms;
