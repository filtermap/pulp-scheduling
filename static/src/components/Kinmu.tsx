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

import Constraint0Name from "./names/Constraint0Name";
import Constraint10Name from "./names/Constraint10Name";
import Constraint1Name from "./names/Constraint1Name";
import Constraint2Name from "./names/Constraint2Name";
import Constraint3Name from "./names/Constraint3Name";
import Constraint4Name from "./names/Constraint4Name";
import Constraint5Name from "./names/Constraint5Name";
import Constraint6Name from "./names/Constraint6Name";
import Constraint7Name from "./names/Constraint7Name";
import Constraint8Name from "./names/Constraint8Name";
import Constraint9Name from "./names/Constraint9Name";
import KinmuName from "./names/KinmuName";
import ScheduleName from "./names/ScheduleName";
import ExpandMoreButton from "./parts/ExpandMoreButton";

type Props = {
  kinmu: kinmus.Kinmu;
};

type State = {
  deletionDialogIsOpen: boolean;
  expanded: boolean;
};

type ErrorMessages = {
  kinmuName: string[];
};

function Kinmu(props: Props): JSX.Element {
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
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const [state, updateState] = useImmer<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const kinmuIdsInTerm = new Set(kinmusInTerm.map(({ id }) => id));
  const assignmentsInTerm = selectedAssignments.filter(({ kinmu_id }) =>
    kinmuIdsInTerm.has(kinmu_id)
  );
  const constraint0KinmusInTerm = selectedConstraint0Kinmus.filter(
    ({ kinmu_id }) => kinmuIdsInTerm.has(kinmu_id)
  );
  const constraints0InTerm = selectedConstraints0.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints1InTerm = selectedConstraints1.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints2InTerm = selectedConstraints2.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints3InTerm = selectedConstraints3.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints4InTerm = selectedConstraints4.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints5InTerm = selectedConstraints5.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints6InTerm = selectedConstraints6.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints7InTerm = selectedConstraints7.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints8InTerm = selectedConstraints8.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints9InTerm = selectedConstraints9.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints10InTerm = selectedConstraints10.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
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
        id: props.kinmu.id,
        changes: {
          is_enabled: event.target.checked,
        },
      })
    );
  };
  const validate = (kinmuName: string): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      kinmuName: [],
    };
    if (kinmuName === "") {
      errorMessages.kinmuName.push("勤務名を入力してください");
    }
    return errorMessages;
  };
  const handleChangeKinmuName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      kinmus.update({
        id: props.kinmu.id,
        changes: {
          name: event.target.value,
        },
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
  const kinmuScheduleIds = new Set(
    assignmentsInTerm
      .filter(({ kinmu_id }) => kinmu_id === props.kinmu.id)
      .map(({ schedule_id }) => schedule_id)
  );
  const kinmuSchedules = selectedSchedules.filter(({ id }) =>
    kinmuScheduleIds.has(id)
  );
  const kinmuConstraint0Ids = new Set(
    constraint0KinmusInTerm
      .filter(({ kinmu_id }) => kinmu_id === props.kinmu.id)
      .map(({ constraint0_id }) => constraint0_id)
  );
  const kinmuConstraints0 = constraints0InTerm.filter(({ id }) =>
    kinmuConstraint0Ids.has(id)
  );
  const kinmuConstraints1 = constraints1InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints2 = constraints2InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints3 = constraints3InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints4 = constraints4InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints5 = constraints5InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints6 = constraints6InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints7 = constraints7InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints8 = constraints8InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints9 = constraints9InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints10 = constraints10InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const errorMessages = validate(props.kinmu.name);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.kinmu.is_enabled}
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
                  label="勤務名"
                  defaultValue={props.kinmu.name}
                  onChange={handleChangeKinmuName}
                  margin="normal"
                  error={errorMessages.kinmuName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.kinmuName.map((message) => (
                    <div key={message}>{message}</div>
                  ))}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions disableSpacing={true}>
            <Button size="small" onClick={handleClickOpenDeletionDialog}>
              削除
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
        <DialogTitle>勤務の削除</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <DialogContentText>この勤務を削除します</DialogContentText>
              <Typography>
                <KinmuName kinmu={props.kinmu} />
              </Typography>
            </Grid>
            <Grid item={true} xs={12}>
              {kinmuSchedules.length > 0 && (
                <DialogContentText>
                  以下の勤務表も削除されます
                </DialogContentText>
              )}
              {kinmuSchedules.map((schedule) => (
                <Typography key={schedule.id}>
                  <ScheduleName schedule={schedule} />
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
                <DialogContentText>以下の条件も削除されます</DialogContentText>
              )}
              {kinmuConstraints0.map((c) => (
                <Typography key={`constraint0_${c.id}`}>
                  <Constraint0Name constraint0={c} />
                </Typography>
              ))}
              {kinmuConstraints1.map((c) => (
                <Typography key={`constraint1_${c.id}`}>
                  <Constraint1Name constraint1={c} />
                </Typography>
              ))}
              {kinmuConstraints2.map((c) => (
                <Typography key={`constraint2_${c.id}`}>
                  <Constraint2Name constraint2={c} />
                </Typography>
              ))}
              {kinmuConstraints3.map((c) => (
                <Typography key={`constraint3_${c.id}`}>
                  <Constraint3Name constraint3={c} />
                </Typography>
              ))}
              {kinmuConstraints4.map((c) => (
                <Typography key={`constraint4_${c.id}`}>
                  <Constraint4Name constraint4={c} />
                </Typography>
              ))}
              {kinmuConstraints5.map((c) => (
                <Typography key={`constraint5_${c.id}`}>
                  <Constraint5Name constraint5={c} />
                </Typography>
              ))}
              {kinmuConstraints6.map((c) => (
                <Typography key={`constraint6_${c.id}`}>
                  <Constraint6Name constraint6={c} />
                </Typography>
              ))}
              {kinmuConstraints7.map((c) => (
                <Typography key={`constraint7_${c.id}`}>
                  <Constraint7Name constraint7={c} />
                </Typography>
              ))}
              {kinmuConstraints8.map((c) => (
                <Typography key={`constraint8_${c.id}`}>
                  <Constraint8Name constraint8={c} />
                </Typography>
              ))}
              {kinmuConstraints9.map((c) => (
                <Typography key={`constraint9_${c.id}`}>
                  <Constraint9Name constraint9={c} />
                </Typography>
              ))}
              {kinmuConstraints10.map((c) => (
                <Typography key={`constraint10_${c.id}`}>
                  <Constraint10Name constraint10={c} />
                </Typography>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteKinmu}>
            削除
          </Button>
          <Button color="primary" onClick={handleCloseDeletionDialog}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Kinmu;
