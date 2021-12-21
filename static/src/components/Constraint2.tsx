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

import * as constraints2 from "../modules/constraints2";
import * as groups from "../modules/groups";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import Constraint2Name from "./names/Constraint2Name";
import GroupName from "./names/GroupName";
import KinmuName from "./names/KinmuName";
import ExpandMoreButton from "./parts/ExpandMoreButton";
import lineThroughSx from "./parts/lineThroughSx";

type Props = {
  constraint2: constraints2.Constraint2;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint2StartDateName: string[];
  constraint2StopDateName: string[];
  constraint2MaxNumberOfAssignments: string[];
};

function Constraint2(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedTerm = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => terms.selectors.selectById(state, props.constraint2.term_id)!
  );
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const selectedGroupById = useSelector(groups.selectors.selectEntities);
  const [state, updateState] = useImmer<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint2.term_id
  );
  const groupsInTerm = selectedGroups.filter(
    ({ term_id }) => term_id === props.constraint2.term_id
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeConstraint2IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints2.update({
        id: props.constraint2.id,
        changes: {
          is_enabled: event.target.checked,
        },
      })
    );
  };
  const validate = (
    constraint2StartDateName: string,
    constraint2StopDateName: string,
    constraint2MaxNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint2MaxNumberOfAssignments: [],
      constraint2StartDateName: [],
      constraint2StopDateName: [],
    };
    if (!utils.stringToDate(constraint2StartDateName)) {
      errorMessages.constraint2StartDateName.push(
        "開始日の形式が正しくありません"
      );
    }
    if (!utils.stringToDate(constraint2StopDateName)) {
      errorMessages.constraint2StopDateName.push(
        "終了日の形式が正しくありません"
      );
    }
    if (isNaN(constraint2MaxNumberOfAssignments)) {
      errorMessages.constraint2MaxNumberOfAssignments.push(
        "割り当て職員数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeConstraint2StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints2.update({
        id: props.constraint2.id,
        changes: {
          start_date_name: event.target.value,
        },
      })
    );
  };
  const handleChangeConstraint2StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints2.update({
        id: props.constraint2.id,
        changes: {
          stop_date_name: event.target.value,
        },
      })
    );
  };
  const handleChangeConstraint2KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints2.update({
        id: props.constraint2.id,
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
      })
    );
  };
  const handleChangeConstraint2GroupId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints2.update({
        id: props.constraint2.id,
        changes: {
          group_id: parseInt(event.target.value, 10),
        },
      })
    );
  };
  const handleChangeConstraint2MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints2.update({
        id: props.constraint2.id,
        changes: {
          max_number_of_assignments: parseInt(event.target.value, 10),
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
  const handleClickDeleteConstraint2 = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(constraints2.remove(props.constraint2.id));
  };
  const constraint2StartDate = utils.stringToDate(
    props.constraint2.start_date_name
  );
  const termStartDate = utils.stringToDate(selectedTerm.start_date_name);
  const constraint2StartDateIsEnabled =
    !constraint2StartDate || !termStartDate
      ? false
      : termStartDate <= constraint2StartDate;
  const constraint2StopDate = utils.stringToDate(
    props.constraint2.stop_date_name
  );
  const termStopDate = utils.stringToDate(selectedTerm.stop_date_name);
  const constraint2StopDateIsEnabled =
    !constraint2StopDate || !termStopDate
      ? false
      : constraint2StopDate <= termStopDate;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint2Kinmu = selectedKinmuById[props.constraint2.kinmu_id]!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint2Group = selectedGroupById[props.constraint2.group_id]!;
  const relativesAreEnabled =
    constraint2StartDateIsEnabled &&
    constraint2StopDateIsEnabled &&
    constraint2Kinmu.is_enabled &&
    constraint2Group.is_enabled;
  const title = <Constraint2Name constraint2={props.constraint2} />;
  const errorMessages = validate(
    props.constraint2.start_date_name,
    props.constraint2.stop_date_name,
    props.constraint2.max_number_of_assignments
  );
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint2.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint2IsEnabled}
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
                  defaultValue={props.constraint2.start_date_name}
                  onChange={handleChangeConstraint2StartDateName}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    sx: {
                      ...(!constraint2StartDateIsEnabled && lineThroughSx),
                    },
                  }}
                  error={errorMessages.constraint2StartDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint2StartDateName.map(
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
                  defaultValue={props.constraint2.stop_date_name}
                  onChange={handleChangeConstraint2StopDateName}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    sx: { ...(constraint2StopDateIsEnabled && lineThroughSx) },
                  }}
                  error={errorMessages.constraint2StopDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint2StopDateName.map(
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
                  value={props.constraint2.kinmu_id}
                  onChange={handleChangeConstraint2KinmuId}
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
                  value={props.constraint2.group_id}
                  onChange={handleChangeConstraint2GroupId}
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
                  label="割り当て職員数上限"
                  type="number"
                  defaultValue={props.constraint2.max_number_of_assignments}
                  onChange={handleChangeConstraint2MaxNumberOfAssignments}
                  fullWidth={true}
                  inputProps={{
                    min: constraints2.minOfConstraint2MaxNumberOfAssignments,
                  }}
                  error={
                    errorMessages.constraint2MaxNumberOfAssignments.length > 0
                  }
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint2MaxNumberOfAssignments.map(
                    (message) => (
                      <div key={message}>{message}</div>
                    )
                  )}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions>
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
          期間の勤務にグループから割り当てる職員数の上限の削除
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            この期間の勤務にグループから割り当てる職員数の上限を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint2}>
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

export default Constraint2;
