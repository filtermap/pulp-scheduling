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
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useImmer } from "use-immer";

import * as all from "../modules/all";
import * as assignments from "../modules/assignments";
import * as constraint0_kinmus from "../modules/constraint0_kinmus";
import * as constraints0 from "../modules/constraints0";
import * as constraints1 from "../modules/constraints1";
import * as constraints10 from "../modules/constraints10";
import * as constraints2 from "../modules/constraints2";
import * as constraints3 from "../modules/constraints3";
import * as constraints4 from "../modules/constraints4";
import * as constraints5 from "../modules/constraints5";
import * as constraints6 from "../modules/constraints6";
import * as constraints7 from "../modules/constraints7";
import * as constraints8 from "../modules/constraints8";
import * as constraints9 from "../modules/constraints9";
import * as kinmus from "../modules/kinmus";
import * as schedules from "../modules/schedules";
import * as utils from "../utils";

import { Constraint0NameLink } from "./names/Constraint0Name";
import { Constraint10NameLink } from "./names/Constraint10Name";
import { Constraint1NameLink } from "./names/Constraint1Name";
import { Constraint2NameLink } from "./names/Constraint2Name";
import { Constraint3NameLink } from "./names/Constraint3Name";
import { Constraint4NameLink } from "./names/Constraint4Name";
import { Constraint5NameLink } from "./names/Constraint5Name";
import { Constraint6NameLink } from "./names/Constraint6Name";
import { Constraint7NameLink } from "./names/Constraint7Name";
import { Constraint8NameLink } from "./names/Constraint8Name";
import { Constraint9NameLink } from "./names/Constraint9Name";
import KinmuName from "./names/KinmuName";
import { ScheduleNameLink } from "./names/ScheduleName";
import ExpandMoreButton from "./parts/ExpandMoreButton";

type Props = {
  kinmu: kinmus.Kinmu;
};

type State = {
  deletionDialogIsOpen: boolean;
  expanded: boolean;
  changes: {
    name: string;
  };
};

// eslint-disable-next-line react/display-name
const Kinmu = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedAssignments = useSelector(assignments.selectors.selectAll);
  const selectedSchedules = useSelector(schedules.selectors.selectAll);
  const selectedConstraint0Kinmus = useSelector(
    constraint0_kinmus.selectors.selectAll
  );
  const selectedConstraints0 = useSelector(constraints0.selectors.selectAll);
  const selectedConstraints1 = useSelector(constraints1.selectors.selectAll);
  const selectedConstraints10 = useSelector(constraints10.selectors.selectAll);
  const selectedConstraints2 = useSelector(constraints2.selectors.selectAll);
  const selectedConstraints3 = useSelector(constraints3.selectors.selectAll);
  const selectedConstraints4 = useSelector(constraints4.selectors.selectAll);
  const selectedConstraints5 = useSelector(constraints5.selectors.selectAll);
  const selectedConstraints6 = useSelector(constraints6.selectors.selectAll);
  const selectedConstraints7 = useSelector(constraints7.selectors.selectAll);
  const selectedConstraints8 = useSelector(constraints8.selectors.selectAll);
  const selectedConstraints9 = useSelector(constraints9.selectors.selectAll);
  const [state, updateState] = useImmer<State>({
    changes: {
      name: props.kinmu.name,
    },
    deletionDialogIsOpen: false,
    expanded: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.name = props.kinmu.name;
      }),
    [props.kinmu.name, updateState]
  );
  const kinmuScheduleIds = new Set(
    selectedAssignments
      .filter(({ kinmu_id }) => kinmu_id === props.kinmu.id)
      .map(({ schedule_id }) => schedule_id)
  );
  const kinmuSchedules = selectedSchedules.filter(({ id }) =>
    kinmuScheduleIds.has(id)
  );
  const kinmuConstraint0Kinmus = selectedConstraint0Kinmus.filter(
    ({ kinmu_id }) => kinmu_id === props.kinmu.id
  );
  const kinmuConstraint0Ids = new Set(
    kinmuConstraint0Kinmus.map(({ constraint0_id }) => constraint0_id)
  );
  const kinmuConstraints0 = selectedConstraints0.filter(({ id }) =>
    kinmuConstraint0Ids.has(id)
  );
  const kinmuConstraints1 = selectedConstraints1.filter(
    ({ kinmu_id }) => kinmu_id === props.kinmu.id
  );
  const kinmuConstraints2 = selectedConstraints2.filter(
    ({ kinmu_id }) => kinmu_id === props.kinmu.id
  );
  const kinmuConstraints3 = selectedConstraints3.filter(
    ({ kinmu_id }) => kinmu_id === props.kinmu.id
  );
  const kinmuConstraints4 = selectedConstraints4.filter(
    ({ kinmu_id }) => kinmu_id === props.kinmu.id
  );
  const kinmuConstraints5 = selectedConstraints5.filter(
    ({ kinmu_id }) => kinmu_id === props.kinmu.id
  );
  const kinmuConstraints6 = selectedConstraints6.filter(
    ({ kinmu_id }) => kinmu_id === props.kinmu.id
  );
  const kinmuConstraints7 = selectedConstraints7.filter(
    ({ kinmu_id }) => kinmu_id === props.kinmu.id
  );
  const kinmuConstraints8 = selectedConstraints8.filter(
    ({ kinmu_id }) => kinmu_id === props.kinmu.id
  );
  const kinmuConstraints9 = selectedConstraints9.filter(
    ({ kinmu_id }) => kinmu_id === props.kinmu.id
  );
  const kinmuConstraints10 = selectedConstraints10.filter(
    ({ kinmu_id }) => kinmu_id === props.kinmu.id
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeKinmuIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      kinmus.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.kinmu.id,
      })
    );
  };
  const handleChangeKinmuName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.name = event.target.value;
    });
  };
  const handleBlurKinmuName = () => {
    if (state.changes.name === props.kinmu.name) return;
    dispatch(
      kinmus.update({
        changes: {
          name: state.changes.name,
        },
        id: props.kinmu.id,
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
  const handleClickDeleteKinmu = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(all.removeKinmu(props.kinmu.id));
  };
  const errorMessages = kinmus.getErrorMessages(t, { kinmu: props.kinmu });
  const relativesAreEnabled = utils.noErrors(errorMessages);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.kinmu.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeKinmuIsEnabled}
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
          title={<KinmuName kinmu={props.kinmu} />}
          titleTypographyProps={{
            variant: "h5",
          }}
        />
        <Collapse in={state.expanded} timeout="auto" unmountOnExit={true}>
          <CardContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <TextField
                  label={t("勤務名")}
                  value={state.changes.name}
                  onChange={handleChangeKinmuName}
                  onBlur={handleBlurKinmuName}
                  margin="normal"
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
        <DialogTitle>{t("{{arg0}}の削除", { arg0: t("勤務") })}</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <DialogContentText>
                {t("この{{arg0}}を削除します", { arg0: t("勤務") })}
              </DialogContentText>
              <Typography>
                <KinmuName kinmu={props.kinmu} />
              </Typography>
            </Grid>
            <Grid item={true} xs={12}>
              {kinmuSchedules.length > 0 && (
                <DialogContentText>
                  {t("以下の勤務表も削除されます")}
                </DialogContentText>
              )}
              {kinmuSchedules.map((schedule) => (
                <Typography key={schedule.id}>
                  <ScheduleNameLink schedule={schedule} />
                </Typography>
              ))}
            </Grid>
            <Grid item={true} xs={12}>
              {(kinmuConstraints0.length > 0 ||
                kinmuConstraints1.length > 0 ||
                kinmuConstraints2.length > 0 ||
                kinmuConstraints3.length > 0 ||
                kinmuConstraints4.length > 0 ||
                kinmuConstraints5.length > 0 ||
                kinmuConstraints6.length > 0 ||
                kinmuConstraints7.length > 0 ||
                kinmuConstraints8.length > 0 ||
                kinmuConstraints9.length > 0 ||
                kinmuConstraints10.length > 0) && (
                <DialogContentText>
                  {t("以下の条件も削除されます")}
                </DialogContentText>
              )}
              {kinmuConstraints0.map((c) => (
                <Typography key={`constraint0_${c.id}`}>
                  <Constraint0NameLink constraint0={c} />
                </Typography>
              ))}
              {kinmuConstraints1.map((c) => (
                <Typography key={`constraint1_${c.id}`}>
                  <Constraint1NameLink constraint1={c} />
                </Typography>
              ))}
              {kinmuConstraints2.map((c) => (
                <Typography key={`constraint2_${c.id}`}>
                  <Constraint2NameLink constraint2={c} />
                </Typography>
              ))}
              {kinmuConstraints3.map((c) => (
                <Typography key={`constraint3_${c.id}`}>
                  <Constraint3NameLink constraint3={c} />
                </Typography>
              ))}
              {kinmuConstraints4.map((c) => (
                <Typography key={`constraint4_${c.id}`}>
                  <Constraint4NameLink constraint4={c} />
                </Typography>
              ))}
              {kinmuConstraints5.map((c) => (
                <Typography key={`constraint5_${c.id}`}>
                  <Constraint5NameLink constraint5={c} />
                </Typography>
              ))}
              {kinmuConstraints6.map((c) => (
                <Typography key={`constraint6_${c.id}`}>
                  <Constraint6NameLink constraint6={c} />
                </Typography>
              ))}
              {kinmuConstraints7.map((c) => (
                <Typography key={`constraint7_${c.id}`}>
                  <Constraint7NameLink constraint7={c} />
                </Typography>
              ))}
              {kinmuConstraints8.map((c) => (
                <Typography key={`constraint8_${c.id}`}>
                  <Constraint8NameLink constraint8={c} />
                </Typography>
              ))}
              {kinmuConstraints9.map((c) => (
                <Typography key={`constraint9_${c.id}`}>
                  <Constraint9NameLink constraint9={c} />
                </Typography>
              ))}
              {kinmuConstraints10.map((c) => (
                <Typography key={`constraint10_${c.id}`}>
                  <Constraint10NameLink constraint10={c} />
                </Typography>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteKinmu}>
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

export default Kinmu;
