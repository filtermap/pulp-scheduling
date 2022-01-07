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
import lineThroughSx from "./parts/lineThroughSx";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint1IsEnabled: boolean;
  newConstraint1StartDateName: string | undefined;
  newConstraint1StopDateName: string | undefined;
  newConstraint1KinmuId: number | undefined;
  newConstraint1GroupId: number | undefined;
  newConstraint1MinNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint1StartDateName: string[];
  newConstraint1StopDateName: string[];
  newConstraint1MinNumberOfAssignments: string[];
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
  const newConstraint1GroupId =
    groupsInTerm.length > 0 ? groupsInTerm[0].id : undefined;
  const newConstraint1KinmuId =
    kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined;
  const newConstraint1StartDateName = selectedTerm?.start_date_name;
  const newConstraint1StopDateName = selectedTerm?.stop_date_name;
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    newConstraint1GroupId,
    newConstraint1IsEnabled: true,
    newConstraint1KinmuId,
    newConstraint1MinNumberOfAssignments:
      constraints1.minOfConstraint1MinNumberOfAssignments,
    newConstraint1StartDateName,
    newConstraint1StopDateName,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.newConstraint1GroupId = newConstraint1GroupId;
        state.newConstraint1KinmuId = newConstraint1KinmuId;
        state.newConstraint1StartDateName = newConstraint1StartDateName;
        state.newConstraint1StopDateName = newConstraint1StopDateName;
      }),
    [
      newConstraint1GroupId,
      newConstraint1KinmuId,
      newConstraint1StartDateName,
      newConstraint1StopDateName,
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
  const handleChangeNewConstraint1IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint1IsEnabled = event.target.checked;
    });
  };
  const validate = (
    newConstraint1StartDateName: string | undefined,
    newConstraint1StopDateName: string | undefined,
    newConstraint1MinNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint1MinNumberOfAssignments: [],
      newConstraint1StartDateName: [],
      newConstraint1StopDateName: [],
    };
    const newConstraint1StartDate =
      newConstraint1StartDateName &&
      utils.stringToDate(newConstraint1StartDateName);
    const newConstraint1StopDate =
      newConstraint1StopDateName &&
      utils.stringToDate(newConstraint1StopDateName);
    if (!newConstraint1StartDate)
      errorMessages.newConstraint1StartDateName.push(
        t("{{arg0}}の形式が正しくありません", { arg0: t("開始日") })
      );
    if (!newConstraint1StopDate)
      errorMessages.newConstraint1StopDateName.push(
        t("{{arg0}}の形式が正しくありません", { arg0: t("終了日") })
      );
    if (
      newConstraint1StartDate &&
      newConstraint1StopDate &&
      newConstraint1StartDate > newConstraint1StopDate
    ) {
      errorMessages.newConstraint1StartDateName.push(
        t("{{arg0}}には{{arg1}}より前の日付を入力してください", {
          arg0: t("開始日"),
          arg1: t("終了日"),
        })
      );
      errorMessages.newConstraint1StopDateName.push(
        t("{{arg0}}には{{arg1}}より後の日付を入力してください", {
          arg0: t("終了日"),
          arg1: t("開始日"),
        })
      );
    }
    if (isNaN(newConstraint1MinNumberOfAssignments))
      errorMessages.newConstraint1MinNumberOfAssignments.push(
        t("{{arg0}}の形式が正しくありません", { arg0: t("割り当て職員数下限") })
      );
    return errorMessages;
  };
  const handleChangeNewConstraint1StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint1StartDateName = event.target.value;
    });
  };
  const handleChangeNewConstraint1StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint1StopDateName = event.target.value;
    });
  };
  const handleChangeNewConstraint1KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint1KinmuId = parseInt(event.target.value, 10);
    });
  };
  const handleChangeNewConstraint1GroupId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint1GroupId = parseInt(event.target.value, 10);
    });
  };
  const handleChangeNewConstraint1MinNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint1MinNumberOfAssignments = parseInt(
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
        group_id: state.newConstraint1GroupId!,
        is_enabled: state.newConstraint1IsEnabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint1KinmuId!,
        min_number_of_assignments: state.newConstraint1MinNumberOfAssignments,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        start_date_name: state.newConstraint1StartDateName!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        stop_date_name: state.newConstraint1StopDateName!,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {t("期間の勤務にグループから割り当てる職員数の下限")}
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
      {state.newConstraint1KinmuId === undefined ||
      state.newConstraint1GroupId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            {t("{{arg0}}を追加できません", {
              arg0: t("期間の勤務にグループから割り当てる職員数の下限"),
            })}
          </DialogTitle>
          <DialogContent>
            {state.newConstraint1KinmuId === undefined && (
              <DialogContentText>{t("勤務がありません")}</DialogContentText>
            )}
            {state.newConstraint1GroupId === undefined && (
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
          const newConstraint1StartDate =
            state.newConstraint1StartDateName &&
            utils.stringToDate(state.newConstraint1StartDateName);
          const termStartDate =
            selectedTerm && utils.stringToDate(selectedTerm.start_date_name);
          const newConstraint1StartDateIsEnabled =
            !newConstraint1StartDate || !termStartDate
              ? false
              : termStartDate <= newConstraint1StartDate;
          const newConstraint1StopDate =
            state.newConstraint1StopDateName &&
            utils.stringToDate(state.newConstraint1StopDateName);
          const termStopDate =
            selectedTerm && utils.stringToDate(selectedTerm.stop_date_name);
          const newConstraint1StopDateIsEnabled =
            !newConstraint1StopDate || !termStopDate
              ? false
              : newConstraint1StopDate <= termStopDate;
          const newConstraint1StartDateAndStopDateAreEnabled =
            (newConstraint1StartDate &&
              newConstraint1StopDate &&
              newConstraint1StartDate <= newConstraint1StopDate) ||
            false;
          const newConstraint1Kinmu =
            selectedKinmuById[state.newConstraint1KinmuId];
          const newConstraint1Group =
            selectedGroupById[state.newConstraint1GroupId];
          const relativesAreEnabled =
            newConstraint1StartDateIsEnabled &&
            newConstraint1StopDateIsEnabled &&
            newConstraint1StartDateAndStopDateAreEnabled &&
            newConstraint1Kinmu?.is_enabled &&
            newConstraint1Group?.is_enabled;
          const errorMessages = validate(
            state.newConstraint1StartDateName,
            state.newConstraint1StopDateName,
            state.newConstraint1MinNumberOfAssignments
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
                  arg0: t("期間の勤務にグループから割り当てる職員数の下限"),
                })}
              </DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint1IsEnabled && relativesAreEnabled
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
                      value={state.newConstraint1StartDateName}
                      onChange={handleChangeNewConstraint1StartDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint1StartDateIsEnabled &&
                            lineThroughSx),
                        },
                      }}
                      error={
                        errorMessages.newConstraint1StartDateName.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint1StartDateName.map(
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
                      value={state.newConstraint1StopDateName}
                      onChange={handleChangeNewConstraint1StopDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint1StopDateIsEnabled &&
                            lineThroughSx),
                        },
                      }}
                      error={
                        errorMessages.newConstraint1StopDateName.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint1StopDateName.map(
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
                      value={state.newConstraint1KinmuId}
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
                      value={state.newConstraint1GroupId}
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
                      value={state.newConstraint1MinNumberOfAssignments}
                      onChange={
                        handleChangeNewConstraint1MinNumberOfAssignments
                      }
                      fullWidth={true}
                      inputProps={{
                        min: constraints1.minOfConstraint1MinNumberOfAssignments,
                      }}
                      error={
                        errorMessages.newConstraint1MinNumberOfAssignments
                          .length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint1MinNumberOfAssignments.map(
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
