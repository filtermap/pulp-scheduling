import Button from "@mui/material/Button";
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
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useImmer } from "use-immer";

import { useHashFragment } from "../hooks/useHashFragment";
import { usePosition } from "../hooks/usePosition";
import * as constraints2 from "../modules/constraints2";
import * as groups from "../modules/groups";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import Constraint2 from "./Constraint2";
import GroupName from "./names/GroupName";
import KinmuName from "./names/KinmuName";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";
import lineThroughSx from "./parts/lineThroughSx";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint2IsEnabled: boolean;
  newConstraint2StartDateName: string | undefined;
  newConstraint2StopDateName: string | undefined;
  newConstraint2KinmuId: number | undefined;
  newConstraint2GroupId: number | undefined;
  newConstraint2MaxNumberOfAssignments: number;
};

// eslint-disable-next-line react/display-name
const Constraints2 = React.memo((): JSX.Element => {
  const { t } = useTranslation();
  const [position, ref] = usePosition();
  useHashFragment(position?.top);
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints2 = useSelector(constraints2.selectors.selectAll);
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedTerm = useAppSelector((state) =>
    terms.selectors.selectById(state, termId)
  );
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const selectedGroupById = useSelector(groups.selectors.selectEntities);
  const constraints2InTerm = selectedConstraints2.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const groupsInTerm = selectedGroups.filter(
    ({ term_id }) => term_id === termId
  );
  const newConstraint2GroupId =
    groupsInTerm.length > 0 ? groupsInTerm[0].id : undefined;
  const newConstraint2KinmuId =
    kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined;
  const newConstraint2StartDateName = selectedTerm?.start_date_name;
  const newConstraint2StopDateName = selectedTerm?.stop_date_name;
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    newConstraint2GroupId,
    newConstraint2IsEnabled: true,
    newConstraint2KinmuId,
    newConstraint2MaxNumberOfAssignments:
      constraints2.minOfConstraint2MaxNumberOfAssignments,
    newConstraint2StartDateName,
    newConstraint2StopDateName,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.newConstraint2GroupId = newConstraint2GroupId;
        state.newConstraint2KinmuId = newConstraint2KinmuId;
        state.newConstraint2StartDateName = newConstraint2StartDateName;
        state.newConstraint2StopDateName = newConstraint2StopDateName;
      }),
    [
      newConstraint2GroupId,
      newConstraint2KinmuId,
      newConstraint2StartDateName,
      newConstraint2StopDateName,
      updateState,
    ]
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
  const handleChangeNewConstraint2IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint2IsEnabled = event.target.checked;
    });
  };
  const handleChangeNewConstraint2StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint2StartDateName = event.target.value;
    });
  };
  const handleChangeNewConstraint2StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint2StopDateName = event.target.value;
    });
  };
  const handleChangeNewConstraint2KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint2KinmuId = parseInt(event.target.value, 10);
    });
  };
  const handleChangeNewConstraint2GroupId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint2GroupId = parseInt(event.target.value, 10);
    });
  };
  const handleChangeNewConstraint2MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint2MaxNumberOfAssignments = parseInt(
        event.target.value,
        10
      );
    });
  };
  const handleClickCreateConstraint2 = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      constraints2.add({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        group_id: state.newConstraint2GroupId!,
        is_enabled: state.newConstraint2IsEnabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint2KinmuId!,
        max_number_of_assignments: state.newConstraint2MaxNumberOfAssignments,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        start_date_name: state.newConstraint2StartDateName!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        stop_date_name: state.newConstraint2StopDateName!,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {t("期間中勤務にグループから割り当てる職員数の上限")}
        </Typography>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1} ref={ref}>
          {constraints2InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12} id={`constraint2-${c.id}`}>
              <Constraint2 constraint2={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      <FloatingAddButton onClick={handleClickOpenCreationDialog} />
      {state.newConstraint2KinmuId === undefined ||
      state.newConstraint2GroupId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            {t("{{arg0}}を追加できません", {
              arg0: t("期間中勤務にグループから割り当てる職員数の上限"),
            })}
          </DialogTitle>
          <DialogContent>
            {state.newConstraint2KinmuId === undefined && (
              <DialogContentText>{t("勤務がありません")}</DialogContentText>
            )}
            {state.newConstraint2GroupId === undefined && (
              <DialogContentText>{t("グループがありません")}</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleCloseCreationDialog}>
              {t("閉じる")}
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        (() => {
          const newConstraint2StartDate =
            state.newConstraint2StartDateName &&
            utils.stringToDate(state.newConstraint2StartDateName);
          const termStartDate =
            selectedTerm && utils.stringToDate(selectedTerm.start_date_name);
          const newConstraint2StartDateIsEnabled =
            !newConstraint2StartDate || !termStartDate
              ? false
              : termStartDate <= newConstraint2StartDate;
          const newConstraint2StopDate =
            state.newConstraint2StopDateName &&
            utils.stringToDate(state.newConstraint2StopDateName);
          const termStopDate =
            selectedTerm && utils.stringToDate(selectedTerm.stop_date_name);
          const newConstraint2StopDateIsEnabled =
            !newConstraint2StopDate || !termStopDate
              ? false
              : newConstraint2StopDate <= termStopDate;
          const newConstraint2StartDateAndStopDateAreEnabled =
            (newConstraint2StartDate &&
              newConstraint2StopDate &&
              newConstraint2StartDate <= newConstraint2StopDate) ||
            false;
          const newConstraint2Kinmu =
            selectedKinmuById[state.newConstraint2KinmuId];
          const newConstraint2Group =
            selectedGroupById[state.newConstraint2GroupId];
          const relativesAreEnabled =
            newConstraint2StartDateIsEnabled &&
            newConstraint2StopDateIsEnabled &&
            newConstraint2StartDateAndStopDateAreEnabled &&
            newConstraint2Kinmu?.is_enabled &&
            newConstraint2Group?.is_enabled;
          const errorMessages = constraints2.getErrorMessages(t, {
            max_number_of_assignments:
              state.newConstraint2MaxNumberOfAssignments,
            start_date_name: state.newConstraint2StartDateName,
            stop_date_name: state.newConstraint2StopDateName,
          });
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>
                {t("{{arg0}}の追加", {
                  arg0: t("期間中勤務にグループから割り当てる職員数の上限"),
                })}
              </DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint2IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint2IsEnabled}
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
                      value={state.newConstraint2StartDateName}
                      onChange={handleChangeNewConstraint2StartDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint2StartDateIsEnabled &&
                            lineThroughSx),
                        },
                      }}
                      error={errorMessages.start_date_name.length > 0}
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.start_date_name.map(
                        (message) => (
                          <div key={message}>{message}</div>
                        )
                      )}
                    />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      label={t("終了日")}
                      type="date"
                      value={state.newConstraint2StopDateName}
                      onChange={handleChangeNewConstraint2StopDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint2StopDateIsEnabled &&
                            lineThroughSx),
                        },
                      }}
                      error={errorMessages.stop_date_name.length > 0}
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.stop_date_name.map(
                        (message) => (
                          <div key={message}>{message}</div>
                        )
                      )}
                    />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label={t("勤務")}
                      value={state.newConstraint2KinmuId}
                      onChange={handleChangeNewConstraint2KinmuId}
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
                      select={true}
                      label={t("グループ")}
                      value={state.newConstraint2GroupId}
                      onChange={handleChangeNewConstraint2GroupId}
                      fullWidth={true}
                    >
                      {groupsInTerm.map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                          <GroupName group={group} />
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      label={t("割り当て職員数上限")}
                      type="number"
                      value={state.newConstraint2MaxNumberOfAssignments}
                      onChange={
                        handleChangeNewConstraint2MaxNumberOfAssignments
                      }
                      fullWidth={true}
                      inputProps={{
                        min: constraints2.minOfConstraint2MaxNumberOfAssignments,
                      }}
                      error={errorMessages.max_number_of_assignments.length > 0}
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.max_number_of_assignments.map(
                        (message) => (
                          <div key={message}>{message}</div>
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
                  onClick={handleClickCreateConstraint2}
                >
                  {t("追加")}
                </Button>
                <Button color="primary" onClick={handleCloseCreationDialog}>
                  {t("閉じる")}
                </Button>
              </DialogActions>
            </Dialog>
          );
        })()
      )}
    </>
  );
});

export default Constraints2;
