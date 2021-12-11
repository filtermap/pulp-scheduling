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
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as constraints9 from "../modules/constraints9";
import { RootState } from "../modules/store";
import * as utils from "../utils";

type Props = {
  constraint9: constraints9.Constraint9;
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint9StartDateName: string[];
  constraint9StopDateName: string[];
};

function select(state: RootState) {
  return {
    kinmus: state.present.kinmus,
    members: state.present.members,
    terms: state.present.terms,
  };
}

function Constraint9(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const membersInTerm = selected.members.filter(
    ({ term_id }) => term_id === props.constraint9.term_id
  );
  const termsInTerm = selected.terms.filter(
    ({ id }) => id === props.constraint9.term_id
  );
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === props.constraint9.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeConstraint9IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    dispatch(
      constraints9.updateConstraint9IsEnabled({
        id: props.constraint9.id,
        is_enabled: checked,
      })
    );
  };
  const handleChangeConstraint9MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints9.updateConstraint9MemberId({
        id: props.constraint9.id,
        member_id: parseInt(event.target.value, 10),
      })
    );
  };
  const validate = (
    constraint9StartDateName: string,
    constraint9StopDateName: string
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint9StartDateName: [],
      constraint9StopDateName: [],
    };
    if (!utils.stringToDate(constraint9StartDateName)) {
      errorMessages.constraint9StartDateName.push(
        "開始日の形式が正しくありません"
      );
    }
    if (!utils.stringToDate(constraint9StopDateName)) {
      errorMessages.constraint9StopDateName.push(
        "終了日の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeConstraint9StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints9.updateConstraint9StartDateName({
        id: props.constraint9.id,
        start_date_name: event.target.value,
      })
    );
  };
  const handleChangeConstraint9StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints9.updateConstraint9StopDateName({
        id: props.constraint9.id,
        stop_date_name: event.target.value,
      })
    );
  };
  const handleChangeConstraint9KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints9.updateConstraint9KinmuId({
        id: props.constraint9.id,
        kinmu_id: parseInt(event.target.value, 10),
      })
    );
  };
  const handleClickOpenDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: true }));
  };
  const handleCloseDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
  };
  const handleClickDeleteConstraint9 = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(constraints9.deleteConstraint9({ id: props.constraint9.id }));
  };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint9Member = membersInTerm.find(
    ({ id }) => id === props.constraint9.member_id
  )!;
  const constraint9StartDate = utils.stringToDate(
    props.constraint9.start_date_name
  );
  const constraint9StartDateIsEnabled = constraint9StartDate
    ? termsInTerm.every(({ start_date_name }) => {
        const startDate = utils.stringToDate(start_date_name);
        if (!startDate) {
          return false;
        }
        return startDate <= constraint9StartDate;
      })
    : false;
  const constraint9StopDate = utils.stringToDate(
    props.constraint9.stop_date_name
  );
  const constraint9StopDateIsEnabled = constraint9StopDate
    ? termsInTerm.every(({ stop_date_name }) => {
        const stopDate = utils.stringToDate(stop_date_name);
        if (!stopDate) {
          return false;
        }
        return stopDate >= constraint9StopDate;
      })
    : false;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint9Kinmu = kinmusInTerm.find(
    ({ id }) => id === props.constraint9.kinmu_id
  )!;
  const relativesAreEnabled =
    constraint9Member.is_enabled &&
    constraint9StartDateIsEnabled &&
    constraint9StopDateIsEnabled &&
    constraint9Kinmu.is_enabled;
  const title = (
    <>
      <span
        className={classnames({
          [props.classes.lineThrough]: !constraint9Member.is_enabled,
        })}
      >
        {constraint9Member.name}
      </span>
      の
      <span
        className={classnames({
          [props.classes.lineThrough]: !constraint9StartDateIsEnabled,
        })}
      >
        {props.constraint9.start_date_name}
      </span>
      から
      <span
        className={classnames({
          [props.classes.lineThrough]: !constraint9StopDateIsEnabled,
        })}
      >
        {props.constraint9.stop_date_name}
      </span>
      までに
      <span
        className={classnames({
          [props.classes.lineThrough]: !constraint9Kinmu.is_enabled,
        })}
      >
        {constraint9Kinmu.name}
      </span>
      を割り当てる
    </>
  );
  const errorMessages = validate(
    props.constraint9.start_date_name,
    props.constraint9.stop_date_name
  );
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint9.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint9IsEnabled}
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
                  select={true}
                  label="職員"
                  value={props.constraint9.member_id}
                  onChange={handleChangeConstraint9MemberId}
                  fullWidth={true}
                >
                  {membersInTerm.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {
                        <span
                          className={classnames({
                            [props.classes.lineThrough]: !member.is_enabled,
                          })}
                        >
                          {member.name}
                        </span>
                      }
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label="開始日"
                  type="date"
                  defaultValue={props.constraint9.start_date_name}
                  onChange={handleChangeConstraint9StartDateName}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    className: classnames({
                      [props.classes.lineThrough]:
                        !constraint9StartDateIsEnabled,
                    }),
                  }}
                  error={errorMessages.constraint9StartDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint9StartDateName.map(
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
                  defaultValue={props.constraint9.stop_date_name}
                  onChange={handleChangeConstraint9StopDateName}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    className: classnames({
                      [props.classes.lineThrough]:
                        !constraint9StopDateIsEnabled,
                    }),
                  }}
                  error={errorMessages.constraint9StopDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint9StopDateName.map(
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
                  value={props.constraint9.kinmu_id}
                  onChange={handleChangeConstraint9KinmuId}
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
        <DialogTitle>職員の期間に割り当てる勤務の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この職員の期間に割り当てる勤務を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint9}>
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

export default withStyles(styles)(Constraint9);
