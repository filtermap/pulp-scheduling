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

type ErrorMessages = {
  constraint1StartDateName: string[];
  constraint1StopDateName: string[];
  constraint1MinNumberOfAssignments: string[];
};

const Constraint1 = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedTerm = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => terms.selectors.selectById(state, props.constraint1.term_id)!
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
  const validate = (
    constraint1StartDateName: string,
    constraint1StopDateName: string,
    constraint1MinNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint1MinNumberOfAssignments: [],
      constraint1StartDateName: [],
      constraint1StopDateName: [],
    };
    if (!utils.stringToDate(constraint1StartDateName)) {
      errorMessages.constraint1StartDateName.push(
        "開始日の形式が正しくありません"
      );
    }
    if (!utils.stringToDate(constraint1StopDateName)) {
      errorMessages.constraint1StopDateName.push(
        "終了日の形式が正しくありません"
      );
    }
    if (isNaN(constraint1MinNumberOfAssignments)) {
      errorMessages.constraint1MinNumberOfAssignments.push(
        "割り当て職員数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeConstraint1StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.start_date_name = event.target.value;
    });
  };
  const handleBlurConstraint1StartDateName = () => {
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
  const termStartDate = utils.stringToDate(selectedTerm.start_date_name);
  const constraint1StartDateIsEnabled =
    !constraint1StartDate || !termStartDate
      ? false
      : termStartDate <= constraint1StartDate;
  const constraint1StopDate = utils.stringToDate(
    props.constraint1.stop_date_name
  );
  const termStopDate = utils.stringToDate(selectedTerm.stop_date_name);
  const constraint1StopDateIsEnabled =
    !constraint1StopDate || !termStopDate
      ? false
      : constraint1StopDate <= termStopDate;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint1Kinmu = selectedKinmuById[props.constraint1.kinmu_id]!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint1Group = selectedGroupById[props.constraint1.group_id]!;
  const relativesAreEnabled =
    constraint1StartDateIsEnabled &&
    constraint1StopDateIsEnabled &&
    constraint1Kinmu.is_enabled &&
    constraint1Group.is_enabled;
  const title = <Constraint1Name constraint1={props.constraint1} />;
  const errorMessages = validate(
    props.constraint1.start_date_name,
    props.constraint1.stop_date_name,
    props.constraint1.min_number_of_assignments
  );
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
                  label="開始日"
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
                  error={errorMessages.constraint1StartDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint1StartDateName.map(
                    (message) => (
                      <div key={message}>{message}</div>
                    )
                  )}
                />
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label="終了日"
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
                  error={errorMessages.constraint1StopDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint1StopDateName.map(
                    (message) => (
                      <div key={message}>{message}</div>
                    )
                  )}
                />
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  select={true}
                  label="勤務"
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
                  label="グループ"
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
                  label="割り当て職員数下限"
                  type="number"
                  value={state.changes.min_number_of_assignments}
                  onChange={handleChangeConstraint1MinNumberOfAssignments}
                  onBlur={handleBlurConstraint1MinNumberOfAssignments}
                  fullWidth={true}
                  inputProps={{
                    min: constraints1.minOfConstraint1MinNumberOfAssignments,
                  }}
                  error={
                    errorMessages.constraint1MinNumberOfAssignments.length > 0
                  }
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint1MinNumberOfAssignments.map(
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
        <DialogTitle>
          期間の勤務にグループから割り当てる職員数の下限の削除
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            この期間の勤務にグループから割り当てる職員数の下限を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint1}>
            削除
          </Button>
          <Button color="primary" onClick={handleCloseDeletionDialog}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Constraint1;
