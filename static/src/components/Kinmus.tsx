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
import { useParams } from "react-router";
import { useImmer } from "use-immer";

import { useHashFragment } from "../hooks/useHashFragment";
import { usePosition } from "../hooks/usePosition";
import * as kinmus from "../modules/kinmus";
import * as utils from "../utils";

import Kinmu from "./Kinmu";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  kinmu: {
    is_enabled: boolean;
    name: string;
  };
};

// eslint-disable-next-line react/display-name
const Kinmus = React.memo((): JSX.Element => {
  const { t } = useTranslation();
  const [position, ref] = usePosition();
  useHashFragment(position?.top);
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    kinmu: {
      is_enabled: true,
      name: "",
    },
  });
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
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
  const handleChangeNewKinmuIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.kinmu.is_enabled = event.target.checked;
    });
  };
  const handleChangeNewKinmuName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.kinmu.name = event.target.value;
    });
  };
  const handleClickCreateKinmu = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      kinmus.add({
        ...state.kinmu,
        term_id: termId,
      })
    );
  };
  const errorMessages = kinmus.getErrorMessages(t, { kinmu: state.kinmu });
  const relativesAreEnabled = utils.noErrors(errorMessages);
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {t("勤務")}
        </Typography>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1} ref={ref}>
          {kinmusInTerm.map((kinmu) => (
            <Grid key={kinmu.id} item={true} xs={12} id={`kinmu-${kinmu.id}`}>
              <Kinmu kinmu={kinmu} />
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
        <DialogTitle>{t("{{arg0}}の追加", { arg0: t("勤務") })}</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.kinmu.is_enabled && relativesAreEnabled}
                    disabled={!relativesAreEnabled}
                    onChange={handleChangeNewKinmuIsEnabled}
                    color="primary"
                  />
                }
                label={t("有効")}
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label={t("勤務名")}
                value={state.kinmu.name}
                onChange={handleChangeNewKinmuName}
                fullWidth={true}
                error={errorMessages.name.length > 0}
                FormHelperTextProps={{
                  // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                  component: "div",
                }}
                helperText={errorMessages.name.map((message) => (
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
            onClick={handleClickCreateKinmu}
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

export default Kinmus;
