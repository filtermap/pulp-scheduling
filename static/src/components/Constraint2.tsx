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
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import { Theme } from "@mui/material/styles";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import classnames from "classnames";
import * as React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as constraints2 from "../modules/constraints2";
import { RootState } from "../modules/store";
import * as utils from "../utils";

type Props = {
  constraint2: constraints2.Constraint2;
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint2StartDateName: string[];
  constraint2StopDateName: string[];
  constraint2MaxNumberOfAssignments: string[];
};

function select(state: RootState) {
  return {
    groups: state.present.groups,
    kinmus: state.present.kinmus,
    terms: state.present.terms,
  };
}

function Constraint2(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const termsInTerm = selected.terms.filter(
    ({ id }) => id === props.constraint2.term_id
  );
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === props.constraint2.term_id
  );
  const groupsInTerm = selected.groups.filter(
    ({ term_id }) => term_id === props.constraint2.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeConstraint2IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    dispatch(
      constraints2.updateConstraint2IsEnabled({
        id: props.constraint2.id,
        is_enabled: checked,
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
      constraints2.updateConstraint2StartDateName({
        id: props.constraint2.id,
        start_date_name: event.target.value,
      })
    );
  };
  const handleChangeConstraint2StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints2.updateConstraint2StopDateName({
        id: props.constraint2.id,
        stop_date_name: event.target.value,
      })
    );
  };
  const handleChangeConstraint2KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints2.updateConstraint2KinmuId({
        id: props.constraint2.id,
        kinmu_id: parseInt(event.target.value, 10),
      })
    );
  };
  const handleChangeConstraint2GroupId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints2.updateConstraint2GroupId({
        id: props.constraint2.id,
        group_id: parseInt(event.target.value, 10),
      })
    );
  };
  const handleChangeConstraint2MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints2.updateConstraint2MaxNumberOfAssignments({
        id: props.constraint2.id,
        max_number_of_assignments: parseInt(event.target.value, 10),
      })
    );
  };
  const handleClickOpenDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: true }));
  };
  const handleCloseDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
  };
  const handleClickDeleteConstraint2 = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(constraints2.deleteConstraint2({ id: props.constraint2.id }));
  };
  const constraint2StartDate = utils.stringToDate(
    props.constraint2.start_date_name
  );
  const constraint2StartDateIsEnabled = constraint2StartDate
    ? termsInTerm.every(({ start_date_name }) => {
        const startDate = utils.stringToDate(start_date_name);
        if (!startDate) {
          return false;
        }
        return startDate <= constraint2StartDate;
      })
    : false;
  const constraint2StopDate = utils.stringToDate(
    props.constraint2.stop_date_name
  );
  const constraint2StopDateIsEnabled = constraint2StopDate
    ? termsInTerm.every(({ stop_date_name }) => {
        const stopDate = utils.stringToDate(stop_date_name);
        if (!stopDate) {
          return false;
        }
        return stopDate >= constraint2StopDate;
      })
    : false;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint2Kinmu = kinmusInTerm.find(
    ({ id }) => id === props.constraint2.kinmu_id
  )!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint2Group = groupsInTerm.find(
    ({ id }) => id === props.constraint2.group_id
  )!;
  const relativesAreEnabled =
    constraint2StartDateIsEnabled &&
    constraint2StopDateIsEnabled &&
    constraint2Kinmu.is_enabled &&
    constraint2Group.is_enabled;
  const title = (
    <>
      <span
        className={classnames({
          [props.classes.lineThrough]: !constraint2StartDateIsEnabled,
        })}
      >
        {props.constraint2.start_date_name}
      </span>
      から
      <span
        className={classnames({
          [props.classes.lineThrough]: !constraint2StopDateIsEnabled,
        })}
      >
        {props.constraint2.stop_date_name}
      </span>
      までの
      <span
        className={classnames({
          [props.classes.lineThrough]: !constraint2Kinmu.is_enabled,
        })}
      >
        {constraint2Kinmu.name}
      </span>
      に
      <span
        className={classnames({
          [props.classes.lineThrough]: !constraint2Group.is_enabled,
        })}
      >
        {constraint2Group.name}
      </span>
      から{props.constraint2.max_number_of_assignments}
      人以下の職員を割り当てる
    </>
  );
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
            <IconButton
              className={classnames(props.classes.expand, {
                [props.classes.expandOpen]: state.expanded,
              })}
              onClick={handleClickExpand}
              aria-expanded={state.expanded}
              size="large"
            >
              <ExpandMoreIcon />
            </IconButton>
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
                    className: classnames({
                      [props.classes.lineThrough]:
                        !constraint2StartDateIsEnabled,
                    }),
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
                    className: classnames({
                      [props.classes.lineThrough]:
                        !constraint2StopDateIsEnabled,
                    }),
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
                      {
                        <span
                          className={classnames({
                            [props.classes.lineThrough]: !kinmu.is_enabled,
                          })}
                        >
                          {kinmu.name}
                        </span>
                      }
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
                      {
                        <span
                          className={classnames({
                            [props.classes.lineThrough]: !group.is_enabled,
                          })}
                        >
                          {group.name}
                        </span>
                      }
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

const styles = (theme: Theme) =>
  createStyles({
    expand: {
      transform: "rotate(0deg)",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
    lineThrough: {
      "&::-webkit-datetime-edit-fields-wrapper": {
        textDecoration: "line-through",
      },
      textDecoration: "line-through",
    },
  });

export default withStyles(styles)(Constraint2);
