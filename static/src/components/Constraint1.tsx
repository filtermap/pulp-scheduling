import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useImmer } from "use-immer";

import * as constraints1 from "../modules/constraints1";
import * as groups from "../modules/groups";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import Constraint1Name from "./names/Constraint1Name";
import GroupName from "./names/GroupName";
import KinmuName from "./names/KinmuName";
import ExpandMoreButton from "./parts/ExpandMoreButton";
import lineThroughSx from "./parts/lineThroughSx";

type Props = {
  constraint1: constraints1.Constraint1;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
  changes: {
    start_date_name: string;
    stop_date_name: string;
    min_number_of_assignments: number;
  };
};

// eslint-disable-next-line react/display-name
const Constraint1 = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedTerm = useAppSelector((state) =>
    terms.selectors.selectById(state, props.constraint1.term_id)
  );
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const selectedGroupById = useSelector(groups.selectors.selectEntities);
  const [state, updateState] = useImmer<State>({
    changes: {
      min_number_of_assignments: props.constraint1.min_number_of_assignments,
      start_date_name: props.constraint1.start_date_name,
      stop_date_name: props.constraint1.stop_date_name,
    },
    deletionDialogIsOpen: false,
    expanded: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.start_date_name = props.constraint1.start_date_name;
        state.changes.stop_date_name = props.constraint1.stop_date_name;
        state.changes.min_number_of_assignments =
          props.constraint1.min_number_of_assignments;
      }),
    [
      props.constraint1.min_number_of_assignments,
      props.constraint1.start_date_name,
      props.constraint1.stop_date_name,
      updateState,
    ]
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint1.term_id
  );
  const groupsInTerm = selectedGroups.filter(
    ({ term_id }) => term_id === props.constraint1.term_id
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeConstraint1IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints1.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.constraint1.id,
      })
    );
  };
  const handleChangeConstraint1StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.start_date_name = event.target.value;
    });
  };
  const handleBlurConstraint1StartDateName = () => {
    if (state.changes.start_date_name === props.constraint1.start_date_name)
      return;
    dispatch(
      constraints1.update({
        changes: {
          start_date_name: state.changes.start_date_name,
        },
        id: props.constraint1.id,
      })
    );
  };
  const handleChangeConstraint1StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.stop_date_name = event.target.value;
    });
  };
  const handleBlurConstraint1StopDateName = () => {
    if (state.changes.stop_date_name === props.constraint1.stop_date_name)
      return;
    dispatch(
      constraints1.update({
        changes: {
          stop_date_name: state.changes.stop_date_name,
        },
        id: props.constraint1.id,
      })
    );
  };
  const handleChangeConstraint1KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints1.update({
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
        id: props.constraint1.id,
      })
    );
  };
  const handleChangeConstraint1GroupId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints1.update({
        changes: {
          group_id: parseInt(event.target.value, 10),
        },
        id: props.constraint1.id,
      })
    );
  };
  const handleChangeConstraint1MinNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.min_number_of_assignments = parseInt(
        event.target.value,
        10
      );
    });
  };
  const handleBlurConstraint1MinNumberOfAssignments = () => {
    if (
      state.changes.min_number_of_assignments ===
      props.constraint1.min_number_of_assignments
    )
      return;
    dispatch(
      constraints1.update({
        changes: {
          min_number_of_assignments: state.changes.min_number_of_assignments,
        },
        id: props.constraint1.id,
      })
    );
  };
  const handleClickOpenDeletionDialog = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = true;
    });
  };
  const handleCloseDeletionDialog = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
  };
  const handleClickDeleteConstraint1 = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(constraints1.remove(props.constraint1.id));
  };
  const constraint1StartDate = utils.stringToDate(
    props.constraint1.start_date_name
  );
  const termStartDate =
    selectedTerm && utils.stringToDate(selectedTerm.start_date_name);
  const constraint1StartDateIsEnabled =
    !constraint1StartDate || !termStartDate
      ? false
      : termStartDate <= constraint1StartDate;
  const constraint1StopDate = utils.stringToDate(
    props.constraint1.stop_date_name
  );
  const termStopDate =
    selectedTerm && utils.stringToDate(selectedTerm.stop_date_name);
  const constraint1StopDateIsEnabled =
    !constraint1StopDate || !termStopDate
      ? false
      : constraint1StopDate <= termStopDate;
  const constraint1StartDateAndStopDateAreEnabled =
    (constraint1StartDate &&
      constraint1StopDate &&
      constraint1StartDate <= constraint1StopDate) ||
    false;
  const constraint1Kinmu = selectedKinmuById[props.constraint1.kinmu_id];
  const constraint1Group = selectedGroupById[props.constraint1.group_id];
  const relativesAreEnabled =
    constraint1StartDateIsEnabled &&
    constraint1StopDateIsEnabled &&
    constraint1StartDateAndStopDateAreEnabled &&
    constraint1Kinmu?.is_enabled &&
    constraint1Group?.is_enabled;
  const title = <Constraint1Name constraint1={props.constraint1} />;
  const errorMessages = constraints1.getErrorMessages(t, props.constraint1);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint1.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint1IsEnabled}
              color="primary"
            />
          }
          action={
            <ExpandMoreButton
              expanded={state.expanded}
              onClick={handleClickExpand}
              aria-expanded={state.expanded}
              size="large"
            />
          }
          title={title}
          titleTypographyProps={{
            variant: "h5",
          }}
        />
        <Collapse in={state.expanded} timeout="auto" unmountOnExit={true}>
          <CardContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <TextField
                  label={t("開始日")}
                  type="date"
                  value={state.changes.start_date_name}
                  onChange={handleChangeConstraint1StartDateName}
                  onBlur={handleBlurConstraint1StartDateName}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    sx: {
                      ...(!constraint1StartDateIsEnabled && lineThroughSx),
                    },
                  }}
                  error={errorMessages.start_date_name.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.start_date_name.map((message) => (
                    <div key={message}>{message}</div>
                  ))}
                />
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label={t("終了日")}
                  type="date"
                  value={state.changes.stop_date_name}
                  onChange={handleChangeConstraint1StopDateName}
                  onBlur={handleBlurConstraint1StopDateName}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    sx: { ...(!constraint1StopDateIsEnabled && lineThroughSx) },
                  }}
                  error={errorMessages.stop_date_name.length > 0}
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
                  select={true}
                  label={t("勤務")}
                  value={props.constraint1.kinmu_id}
                  onChange={handleChangeConstraint1KinmuId}
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
                  value={props.constraint1.group_id}
                  onChange={handleChangeConstraint1GroupId}
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
                  value={state.changes.min_number_of_assignments}
                  onChange={handleChangeConstraint1MinNumberOfAssignments}
                  onBlur={handleBlurConstraint1MinNumberOfAssignments}
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
          </CardContent>
          <CardActions disableSpacing={true}>
            <Button size="small" onClick={handleClickOpenDeletionDialog}>
              {t("削除")}
            </Button>
          </CardActions>
        </Collapse>
      </Card>
      <Dialog
        onClose={handleCloseDeletionDialog}
        open={state.deletionDialogIsOpen}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>
          {t("{{arg0}}の削除", {
            arg0: t("期間中勤務にグループから割り当てる職員数の下限"),
          })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("この{{arg0}}を削除します", {
              arg0: t("期間中勤務にグループから割り当てる職員数の下限"),
            })}
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint1}>
            {t("削除")}
          </Button>
          <Button color="primary" onClick={handleCloseDeletionDialog}>
            {t("閉じる")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Constraint1;
