import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
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
import FlexStartDialogActions from "./parts/FlexStartDialogActions";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  term: {
    is_enabled: boolean;
    start_date_name: string;
    stop_date_name: string;
  };
};

// eslint-disable-next-line react/display-name
const Terms = React.memo((): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedTerms = useSelector(terms.selectors.selectAll);
  const todayString = utils.dateToString(new Date());
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    term: {
      is_enabled: true,
      start_date_name: todayString,
      stop_date_name: todayString,
    },
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
      state.term.is_enabled = event.target.checked;
    });
  };
  const handleChangeNewTermStartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.term.start_date_name = event.target.value;
    });
  };
  const handleChangeNewTermStopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.term.stop_date_name = event.target.value;
    });
  };
  const handleClickCreateTerm = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(terms.add(state.term));
  };
  const errorMessages = terms.getErrorMessages(t, { term: state.term });
  const relativesAreEnabled = utils.noErrors(errorMessages);
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
                    checked={state.term.is_enabled && relativesAreEnabled}
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
                value={state.term.start_date_name}
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
                value={state.term.stop_date_name}
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
        <FlexStartDialogActions>
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
        </FlexStartDialogActions>
      </Dialog>
    </>
  );
});

export default Terms;
