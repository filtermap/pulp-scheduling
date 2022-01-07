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
import * as constraints10 from "../modules/constraints10";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import Constraint10 from "./Constraint10";
import KinmuName from "./names/KinmuName";
import MemberName from "./names/MemberName";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";
import lineThroughSx from "./parts/lineThroughSx";

type State = {
  creationDialogIsOpen: boolean;
  constraint10: {
    is_enabled: boolean;
    member_id: number | undefined;
    start_date_name: string | undefined;
    stop_date_name: string | undefined;
    kinmu_id: number | undefined;
  };
};

// eslint-disable-next-line react/display-name
const Constraints10 = React.memo((): JSX.Element => {
  const { t } = useTranslation();
  const [position, ref] = usePosition();
  useHashFragment(position?.top);
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints10 = useSelector(constraints10.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedTerm = useAppSelector((state) =>
    terms.selectors.selectById(state, termId)
  );
  const selectedMemberById = useSelector(members.selectors.selectEntities);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const constraints10InTerm = selectedConstraints10.filter(
    ({ term_id }) => term_id === termId
  );
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmu_id = kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined;
  const member_id = membersInTerm.length > 0 ? membersInTerm[0].id : undefined;
  const start_date_name = selectedTerm?.start_date_name;
  const stop_date_name = selectedTerm?.stop_date_name;
  const [state, updateState] = useImmer<State>({
    constraint10: {
      is_enabled: true,
      kinmu_id: kinmu_id,
      member_id: member_id,
      start_date_name: start_date_name,
      stop_date_name: stop_date_name,
    },
    creationDialogIsOpen: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.constraint10 = {
          ...state.constraint10,
          kinmu_id: kinmu_id,
          member_id: member_id,
          start_date_name: start_date_name,
          stop_date_name: stop_date_name,
        };
      }),
    [kinmu_id, member_id, start_date_name, stop_date_name, updateState]
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
  const handleChangeNewConstraint10IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint10.is_enabled = event.target.checked;
    });
  };
  const handleChangeNewConstraint10MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint10.member_id = parseInt(event.target.value, 10);
    });
  };
  const handleChangeNewConstraint10StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint10.start_date_name = event.target.value;
    });
  };
  const handleChangeNewConstraint10StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint10.stop_date_name = event.target.value;
    });
  };
  const handleChangeNewConstraint10KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint10.kinmu_id = parseInt(event.target.value, 10);
    });
  };
  const handleClickCreateConstraint10 = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      constraints10.add({
        is_enabled: state.constraint10.is_enabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.constraint10.kinmu_id!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        member_id: state.constraint10.member_id!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        start_date_name: state.constraint10.start_date_name!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        stop_date_name: state.constraint10.stop_date_name!,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {t("期間中職員に割り当てない勤務")}
        </Typography>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1} ref={ref}>
          {constraints10InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12} id={`constraint10-${c.id}`}>
              <Constraint10 constraint10={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      <FloatingAddButton onClick={handleClickOpenCreationDialog} />
      {state.constraint10.member_id === undefined ||
      state.constraint10.kinmu_id === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            {t("{{arg0}}を追加できません", {
              arg0: t("期間中職員に割り当てない勤務"),
            })}
          </DialogTitle>
          <DialogContent>
            {state.constraint10.member_id === undefined && (
              <DialogContentText>{t("職員がいません")}</DialogContentText>
            )}
            {state.constraint10.kinmu_id === undefined && (
              <DialogContentText>{t("勤務がありません")}</DialogContentText>
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
          const newConstraint10Member =
            selectedMemberById[state.constraint10.member_id];
          const newConstraint10StartDate =
            state.constraint10.start_date_name &&
            utils.stringToDate(state.constraint10.start_date_name);
          const termStartDate =
            selectedTerm && utils.stringToDate(selectedTerm.start_date_name);
          const newConstraint10StartDateIsEnabled =
            !newConstraint10StartDate || !termStartDate
              ? false
              : termStartDate <= newConstraint10StartDate;
          const newConstraint10StopDate =
            state.constraint10.stop_date_name &&
            utils.stringToDate(state.constraint10.stop_date_name);
          const termStopDate =
            selectedTerm && utils.stringToDate(selectedTerm.stop_date_name);
          const newConstraint10StopDateIsEnabled =
            !newConstraint10StopDate || !termStopDate
              ? false
              : newConstraint10StopDate <= termStopDate;
          const newConstraint10StartDateAndStopDateAreEnabled =
            (newConstraint10StartDate &&
              newConstraint10StopDate &&
              newConstraint10StartDate <= newConstraint10StopDate) ||
            false;
          const newConstraint10Kinmu =
            selectedKinmuById[state.constraint10.kinmu_id];
          const relativesAreEnabled =
            newConstraint10Member?.is_enabled &&
            newConstraint10StartDateIsEnabled &&
            newConstraint10StopDateIsEnabled &&
            newConstraint10StartDateAndStopDateAreEnabled &&
            newConstraint10Kinmu?.is_enabled;
          const errorMessages = constraints10.getErrorMessages(
            t,
            state.constraint10
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
                  arg0: t("期間中職員に割り当てない勤務"),
                })}
              </DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.constraint10.is_enabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint10IsEnabled}
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
                      value={state.constraint10.start_date_name}
                      onChange={handleChangeNewConstraint10StartDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint10StartDateIsEnabled &&
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
                      value={state.constraint10.stop_date_name}
                      onChange={handleChangeNewConstraint10StopDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint10StopDateIsEnabled &&
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
                      label={t("職員")}
                      value={state.constraint10.member_id}
                      onChange={handleChangeNewConstraint10MemberId}
                      fullWidth={true}
                    >
                      {membersInTerm.map((member) => (
                        <MenuItem key={member.id} value={member.id}>
                          <MemberName member={member} />
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label={t("勤務")}
                      value={state.constraint10.kinmu_id}
                      onChange={handleChangeNewConstraint10KinmuId}
                      fullWidth={true}
                    >
                      {kinmusInTerm.map((kinmu) => (
                        <MenuItem key={kinmu.id} value={kinmu.id}>
                          <KinmuName kinmu={kinmu} />
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  disabled={Object.values(errorMessages).some(
                    (messages) => messages.length > 0
                  )}
                  onClick={handleClickCreateConstraint10}
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

export default Constraints10;
