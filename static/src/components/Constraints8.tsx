import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
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
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useImmer } from "use-immer";

import { useHashFragment } from "../hooks/useHashFragment";
import { usePosition } from "../hooks/usePosition";
import * as constraints8 from "../modules/constraints8";
import * as kinmus from "../modules/kinmus";
import * as utils from "../utils";

import Constraint8 from "./Constraint8";
import KinmuName from "./names/KinmuName";
import FlexStartDialogActions from "./parts/FlexStartDialogActions";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  constraint8: {
    is_enabled: boolean;
    kinmu_id: number | undefined;
    max_number_of_days: number;
  };
};

// eslint-disable-next-line react/display-name
const Constraints8 = React.memo((): JSX.Element => {
  const { t } = useTranslation();
  const [position, ref] = usePosition();
  useHashFragment(position?.top);
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints8 = useSelector(constraints8.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const constraints8InTerm = selectedConstraints8.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmu_id = kinmusInTerm.length > 0 ? kinmusInTerm[0].id : 0;
  const [state, updateState] = useImmer<State>({
    constraint8: {
      is_enabled: true,
      kinmu_id,
      max_number_of_days: constraints8.minOfConstraint8MaxNumberOfDays,
    },
    creationDialogIsOpen: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.constraint8.kinmu_id = kinmu_id;
      }),
    [kinmu_id, updateState]
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
  const handleChangeNewConstraint8IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint8.is_enabled = event.target.checked;
    });
  };
  const handleChangeNewConstraint8KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint8.kinmu_id = parseInt(event.target.value, 10);
    });
  };
  const handleChangeNewConstraint8MaxNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint8.max_number_of_days = parseInt(event.target.value, 10);
    });
  };
  const handleClickCreateConstraint8 = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      constraints8.add({
        is_enabled: state.constraint8.is_enabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.constraint8.kinmu_id!,
        max_number_of_days: state.constraint8.max_number_of_days,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {t("勤務の間隔日数の上限")}
        </Typography>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1} ref={ref}>
          {constraints8InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12} id={`constraint8-${c.id}`}>
              <Constraint8 constraint8={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      <FloatingAddButton onClick={handleClickOpenCreationDialog} />
      {state.constraint8.kinmu_id === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            {t("{{arg0}}を追加できません", { arg0: t("勤務の間隔日数の上限") })}
          </DialogTitle>
          <DialogContent>
            {state.constraint8.kinmu_id === undefined && (
              <DialogContentText>{t("勤務がありません")}</DialogContentText>
            )}
          </DialogContent>
          <FlexStartDialogActions>
            <Button color="primary" onClick={handleCloseCreationDialog}>
              {t("閉じる")}
            </Button>
          </FlexStartDialogActions>
        </Dialog>
      ) : (
        (() => {
          const errorMessages = constraints8.getErrorMessages(t, {
            constraint8: state.constraint8,
          });
          const newConstraint8Kinmu =
            selectedKinmuById[state.constraint8.kinmu_id];
          const relativesAreEnabled =
            utils.noErrors(errorMessages) &&
            newConstraint8Kinmu?.is_enabled &&
            utils.noErrors(
              kinmus.getErrorMessages(t, { kinmu: newConstraint8Kinmu })
            );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>
                {t("{{arg0}}の追加", { arg0: t("勤務の間隔日数の下限") })}
              </DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.constraint8.is_enabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint8IsEnabled}
                          color="primary"
                        />
                      }
                      label={t("有効")}
                    />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label={t("勤務")}
                      value={state.constraint8.kinmu_id}
                      onChange={handleChangeNewConstraint8KinmuId}
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
                    <TextField
                      label={t("間隔日数下限")}
                      type="number"
                      value={state.constraint8.max_number_of_days}
                      onChange={handleChangeNewConstraint8MaxNumberOfDays}
                      fullWidth={true}
                      inputProps={{
                        min: constraints8.minOfConstraint8MaxNumberOfDays,
                      }}
                      error={errorMessages.max_number_of_days.length > 0}
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.max_number_of_days.map(
                        (message) => (
                          <div key={message}>{message}</div>
                        )
                      )}
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
                  onClick={handleClickCreateConstraint8}
                >
                  {t("追加")}
                </Button>
                <Button color="primary" onClick={handleCloseCreationDialog}>
                  {t("閉じる")}
                </Button>
              </FlexStartDialogActions>
            </Dialog>
          );
        })()
      )}
    </>
  );
});

export default Constraints8;
