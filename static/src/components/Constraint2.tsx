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
  changes: {
    start_date_name: string;
    stop_date_name: string;
    max_number_of_assignments: number;
  };
};

type ErrorMessages = {
  constraint2StartDateName: string[];
  constraint2StopDateName: string[];
  constraint2MaxNumberOfAssignments: string[];
};

// eslint-disable-next-line react/display-name
const Constraint2 = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedTerm = useAppSelector((state) =>
    terms.selectors.selectById(state, props.constraint2.term_id)
  );
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const selectedGroupById = useSelector(groups.selectors.selectEntities);
  const [state, updateState] = useImmer<State>({
    changes: {
      max_number_of_assignments: props.constraint2.max_number_of_assignments,
      start_date_name: props.constraint2.start_date_name,
      stop_date_name: props.constraint2.stop_date_name,
    },
    deletionDialogIsOpen: false,
    expanded: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.start_date_name = props.constraint2.start_date_name;
        state.changes.stop_date_name = props.constraint2.stop_date_name;
        state.changes.max_number_of_assignments =
          props.constraint2.max_number_of_assignments;
      }),
    [
      props.constraint2.max_number_of_assignments,
      props.constraint2.start_date_name,
      props.constraint2.stop_date_name,
      updateState,
    ]
  );
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
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.constraint2.id,
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
    const constraint2StartDate = utils.stringToDate(constraint2StartDateName);
    const constraint2StopDate = utils.stringToDate(constraint2StopDateName);
    if (!constraint2StartDate)
      errorMessages.constraint2StartDateName.push(
        t("{{arg0}}の形式が正しくありません", { arg0: t("開始日") })
      );
    if (!constraint2StopDate)
      errorMessages.constraint2StopDateName.push(
        t("{{arg0}}の形式が正しくありません", { arg0: t("終了日") })
      );
    if (
      constraint2StartDate &&
      constraint2StopDate &&
      constraint2StartDate > constraint2StopDate
    ) {
      errorMessages.constraint2StartDateName.push(
        t("{{arg0}}には{{arg1}}より前の日付を入力してください", {
          arg0: t("開始日"),
          arg1: t("終了日"),
        })
      );
      errorMessages.constraint2StopDateName.push(
        t("{{arg0}}には{{arg1}}より後の日付を入力してください", {
          arg0: t("終了日"),
          arg1: t("開始日"),
        })
      );
    }
    if (isNaN(constraint2MaxNumberOfAssignments))
      errorMessages.constraint2MaxNumberOfAssignments.push(
        t("{{arg0}}の形式が正しくありません", { arg0: t("割り当て職員数上限") })
      );
    return errorMessages;
  };
  const handleChangeConstraint2StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.start_date_name = event.target.value;
    });
  };
  const handleBlurConstraint2StartDateName = () => {
    if (state.changes.start_date_name === props.constraint2.start_date_name)
      return;
    dispatch(
      constraints2.update({
        changes: {
          start_date_name: state.changes.start_date_name,
        },
        id: props.constraint2.id,
      })
    );
  };
  const handleChangeConstraint2StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.stop_date_name = event.target.value;
    });
  };
  const handleBlurConstraint2StopDateName = () => {
    if (state.changes.stop_date_name === props.constraint2.stop_date_name)
      dispatch(
        constraints2.update({
          changes: {
            stop_date_name: state.changes.stop_date_name,
          },
          id: props.constraint2.id,
        })
      );
  };
  const handleChangeConstraint2KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints2.update({
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
        id: props.constraint2.id,
      })
    );
  };
  const handleChangeConstraint2GroupId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints2.update({
        changes: {
          group_id: parseInt(event.target.value, 10),
        },
        id: props.constraint2.id,
      })
    );
  };
  const handleChangeConstraint2MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.max_number_of_assignments = parseInt(
        event.target.value,
        10
      );
    });
  };
  const handleBlurConstraint2MaxNumberOfAssignments = () => {
    if (
      state.changes.max_number_of_assignments ===
      props.constraint2.max_number_of_assignments
    )
      return;
    dispatch(
      constraints2.update({
        changes: {
          max_number_of_assignments: state.changes.max_number_of_assignments,
        },
        id: props.constraint2.id,
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
  const termStartDate =
    selectedTerm && utils.stringToDate(selectedTerm.start_date_name);
  const constraint2StartDateIsEnabled =
    !constraint2StartDate || !termStartDate
      ? false
      : termStartDate <= constraint2StartDate;
  const constraint2StopDate = utils.stringToDate(
    props.constraint2.stop_date_name
  );
  const termStopDate =
    selectedTerm && utils.stringToDate(selectedTerm.stop_date_name);
  const constraint2StopDateIsEnabled =
    !constraint2StopDate || !termStopDate
      ? false
      : constraint2StopDate <= termStopDate;
  const constraint2StartDateAndStopDateAreEnabled =
    (constraint2StartDate &&
      constraint2StopDate &&
      constraint2StartDate <= constraint2StopDate) ||
    false;
  const constraint2Kinmu = selectedKinmuById[props.constraint2.kinmu_id];
  const constraint2Group = selectedGroupById[props.constraint2.group_id];
  const relativesAreEnabled =
    constraint2StartDateIsEnabled &&
    constraint2StopDateIsEnabled &&
    constraint2StartDateAndStopDateAreEnabled &&
    constraint2Kinmu?.is_enabled &&
    constraint2Group?.is_enabled;
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
                  label={t("開始日")}
                  type="date"
                  value={state.changes.start_date_name}
                  onChange={handleChangeConstraint2StartDateName}
                  onBlur={handleBlurConstraint2StartDateName}
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
                  label={t("終了日")}
                  type="date"
                  value={state.changes.stop_date_name}
                  onChange={handleChangeConstraint2StopDateName}
                  onBlur={handleBlurConstraint2StopDateName}
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
                  label={t("勤務")}
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
                  label={t("グループ")}
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
                  label={t("割り当て職員数上限")}
                  type="number"
                  value={state.changes.max_number_of_assignments}
                  onChange={handleChangeConstraint2MaxNumberOfAssignments}
                  onBlur={handleBlurConstraint2MaxNumberOfAssignments}
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
            arg0: t("期間中勤務にグループから割り当てる職員数の上限"),
          })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("この{{arg0}}を削除します", {
              arg0: t("期間中勤務にグループから割り当てる職員数の上限"),
            })}
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint2}>
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

export default Constraint2;
