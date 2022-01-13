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
import * as constraints1 from "../modules/constraints1";
import * as groups from "../modules/groups";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import Constraint1 from "./Constraint1";
import GroupName from "./names/GroupName";
import KinmuName from "./names/KinmuName";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  constraint1: {
    is_enabled: boolean;
    start_date_name: string | undefined;
    stop_date_name: string | undefined;
    kinmu_id: number | undefined;
    group_id: number | undefined;
    min_number_of_assignments: number;
  };
};

// eslint-disable-next-line react/display-name
const Constraints1 = React.memo((): JSX.Element => {
  const { t } = useTranslation();
  const [position, ref] = usePosition();
  useHashFragment(position?.top);
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints1 = useSelector(constraints1.selectors.selectAll);
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedTerm = useAppSelector((state) =>
    terms.selectors.selectById(state, termId)
  );
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const selectedGroupById = useSelector(groups.selectors.selectEntities);
  const constraints1InTerm = selectedConstraints1.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const groupsInTerm = selectedGroups.filter(
    ({ term_id }) => term_id === termId
  );
  const group_id = groupsInTerm.length > 0 ? groupsInTerm[0].id : undefined;
  const kinmu_id = kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined;
  const start_date_name = selectedTerm?.start_date_name;
  const stop_date_name = selectedTerm?.stop_date_name;
  const [state, updateState] = useImmer<State>({
    constraint1: {
      group_id,
      is_enabled: true,
      kinmu_id,
      min_number_of_assignments:
        constraints1.minOfConstraint1MinNumberOfAssignments,
      start_date_name,
      stop_date_name,
    },
    creationDialogIsOpen: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.constraint1 = {
          ...state.constraint1,
          group_id,
          kinmu_id,
          start_date_name,
          stop_date_name,
        };
      }),
    [group_id, kinmu_id, start_date_name, stop_date_name, updateState]
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
  const handleChangeNewConstraint1IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint1.is_enabled = event.target.checked;
    });
  };
  const handleChangeNewConstraint1StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint1.start_date_name = event.target.value;
    });
  };
  const handleChangeNewConstraint1StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint1.stop_date_name = event.target.value;
    });
  };
  const handleChangeNewConstraint1KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint1.kinmu_id = parseInt(event.target.value, 10);
    });
  };
  const handleChangeNewConstraint1GroupId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint1.group_id = parseInt(event.target.value, 10);
    });
  };
  const handleChangeNewConstraint1MinNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint1.min_number_of_assignments = parseInt(
        event.target.value,
        10
      );
    });
  };
  const handleClickCreateConstraint1 = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      constraints1.add({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        group_id: state.constraint1.group_id!,
        is_enabled: state.constraint1.is_enabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.constraint1.kinmu_id!,
        min_number_of_assignments: state.constraint1.min_number_of_assignments,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        start_date_name: state.constraint1.start_date_name!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        stop_date_name: state.constraint1.stop_date_name!,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {t("期間中勤務にグループから割り当てる職員数の下限")}
        </Typography>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1} ref={ref}>
          {constraints1InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12} id={`constraint1-${c.id}`}>
              <Constraint1 constraint1={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      <FloatingAddButton onClick={handleClickOpenCreationDialog} />
      {state.constraint1.kinmu_id === undefined ||
      state.constraint1.group_id === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            {t("{{arg0}}を追加できません", {
              arg0: t("期間中勤務にグループから割り当てる職員数の下限"),
            })}
          </DialogTitle>
          <DialogContent>
            {state.constraint1.kinmu_id === undefined && (
              <DialogContentText>{t("勤務がありません")}</DialogContentText>
            )}
            {state.constraint1.group_id === undefined && (
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
          const newConstraint1Kinmu =
            selectedKinmuById[state.constraint1.kinmu_id];
          const newConstraint1Group =
            selectedGroupById[state.constraint1.group_id];
          const errorMessages = constraints1.getErrorMessages(t, {
            constraint1: state.constraint1,
            term: selectedTerm,
          });
          const relativesAreEnabled =
            utils.noErrors(errorMessages) &&
            newConstraint1Kinmu?.is_enabled &&
            utils.noErrors(
              kinmus.getErrorMessages(t, { kinmu: newConstraint1Kinmu })
            ) &&
            newConstraint1Group?.is_enabled &&
            utils.noErrors(
              groups.getErrorMessages(t, { group: newConstraint1Group })
            );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>
                {t("{{arg0}}の追加", {
                  arg0: t("期間中勤務にグループから割り当てる職員数の下限"),
                })}
              </DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.constraint1.is_enabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint1IsEnabled}
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
                      value={state.constraint1.start_date_name}
                      onChange={handleChangeNewConstraint1StartDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
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
                      value={state.constraint1.stop_date_name}
                      onChange={handleChangeNewConstraint1StopDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
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
                      value={state.constraint1.kinmu_id}
                      onChange={handleChangeNewConstraint1KinmuId}
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
                      value={state.constraint1.group_id}
                      onChange={handleChangeNewConstraint1GroupId}
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
                      label={t("割り当て職員数下限")}
                      type="number"
                      value={state.constraint1.min_number_of_assignments}
                      onChange={
                        handleChangeNewConstraint1MinNumberOfAssignments
                      }
                      fullWidth={true}
                      inputProps={{
                        min: constraints1.minOfConstraint1MinNumberOfAssignments,
                      }}
                      error={errorMessages.min_number_of_assignments.length > 0}
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.min_number_of_assignments.map(
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
                  onClick={handleClickCreateConstraint1}
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

export default Constraints1;
