import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
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
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import classnames from "classnames";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as constraints10 from "../modules/constraints10";
import { RootState } from "../modules/store";
import * as utils from "../utils";

const PREFIX = "Constraint10";

const classes = {
  expand: `${PREFIX}-expand`,
  expandOpen: `${PREFIX}-expandOpen`,
  lineThrough: `${PREFIX}-lineThrough`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(({ theme }) => ({
  [`& .${classes.expand}`]: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  [`& .${classes.expandOpen}`]: {
    transform: "rotate(180deg)",
  },
  [`& .${classes.lineThrough}`]: {
    "&::-webkit-datetime-edit-fields-wrapper": {
      textDecoration: "line-through",
    },
    textDecoration: "line-through",
  },
}));

type Props = {
  constraint10: constraints10.Constraint10;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint10StartDateName: string[];
  constraint10StopDateName: string[];
};

function select(state: RootState) {
  return {
    kinmus: state.present.kinmus,
    members: state.present.members,
    terms: state.present.terms,
  };
}

function Constraint10(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const membersInTerm = selected.members.filter(
    ({ term_id }) => term_id === props.constraint10.term_id
  );
  const termsInTerm = selected.terms.filter(
    ({ id }) => id === props.constraint10.term_id
  );
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === props.constraint10.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeConstraint10IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints10.updateConstraint10IsEnabled({
        id: props.constraint10.id,
        is_enabled: event.target.checked,
      })
    );
  };
  const handleChangeConstraint10MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints10.updateConstraint10MemberId({
        id: props.constraint10.id,
        member_id: parseInt(event.target.value, 10),
      })
    );
  };
  const validate = (
    constraint10StartDateName: string,
    constraint10StopDateName: string
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint10StartDateName: [],
      constraint10StopDateName: [],
    };
    if (!utils.stringToDate(constraint10StartDateName)) {
      errorMessages.constraint10StartDateName.push(
        "開始日の形式が正しくありません"
      );
    }
    if (!utils.stringToDate(constraint10StopDateName)) {
      errorMessages.constraint10StopDateName.push(
        "終了日の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeConstraint10StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints10.updateConstraint10StartDateName({
        id: props.constraint10.id,
        start_date_name: event.target.value,
      })
    );
  };
  const handleChangeConstraint10StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints10.updateConstraint10StopDateName({
        id: props.constraint10.id,
        stop_date_name: event.target.value,
      })
    );
  };
  const handleChangeConstraint10KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints10.updateConstraint10KinmuId({
        id: props.constraint10.id,
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
  const handleClickDeleteConstraint10 = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(constraints10.deleteConstraint10({ id: props.constraint10.id }));
  };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint10Member = membersInTerm.find(
    ({ id }) => id === props.constraint10.member_id
  )!;
  const constraint10StartDate = utils.stringToDate(
    props.constraint10.start_date_name
  );
  const constraint10StartDateIsEnabled = constraint10StartDate
    ? termsInTerm.every(({ start_date_name }) => {
        const startDate = utils.stringToDate(start_date_name);
        if (!startDate) {
          return false;
        }
        return startDate <= constraint10StartDate;
      })
    : false;
  const constraint10StopDate = utils.stringToDate(
    props.constraint10.stop_date_name
  );
  const constraint10StopDateIsEnabled = constraint10StopDate
    ? termsInTerm.every(({ stop_date_name }) => {
        const stopDate = utils.stringToDate(stop_date_name);
        if (!stopDate) {
          return false;
        }
        return stopDate >= constraint10StopDate;
      })
    : false;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint10Kinmu = kinmusInTerm.find(
    ({ id }) => id === props.constraint10.kinmu_id
  )!;
  const relativesAreEnabled =
    constraint10Member.is_enabled &&
    constraint10StartDateIsEnabled &&
    constraint10StopDateIsEnabled &&
    constraint10Kinmu.is_enabled;
  const title = (
    <Root>
      <span
        className={classnames({
          [classes.lineThrough]: !constraint10Member.is_enabled,
        })}
      >
        {constraint10Member.name}
      </span>
      の
      <span
        className={classnames({
          [classes.lineThrough]: !constraint10StartDateIsEnabled,
        })}
      >
        {props.constraint10.start_date_name}
      </span>
      から
      <span
        className={classnames({
          [classes.lineThrough]: !constraint10StopDateIsEnabled,
        })}
      >
        {props.constraint10.stop_date_name}
      </span>
      までに
      <span
        className={classnames({
          [classes.lineThrough]: !constraint10Kinmu.is_enabled,
        })}
      >
        {constraint10Kinmu.name}
      </span>
      を割り当てない
    </Root>
  );
  const errorMessages = validate(
    props.constraint10.start_date_name,
    props.constraint10.stop_date_name
  );
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint10.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint10IsEnabled}
              color="primary"
            />
          }
          action={
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: state.expanded,
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
                  value={props.constraint10.member_id}
                  onChange={handleChangeConstraint10MemberId}
                  fullWidth={true}
                >
                  {membersInTerm.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      {
                        <span
                          className={classnames({
                            [classes.lineThrough]: !member.is_enabled,
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
                  defaultValue={props.constraint10.start_date_name}
                  onChange={handleChangeConstraint10StartDateName}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    className: classnames({
                      [classes.lineThrough]: !constraint10StartDateIsEnabled,
                    }),
                  }}
                  error={errorMessages.constraint10StartDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint10StartDateName.map(
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
                  defaultValue={props.constraint10.stop_date_name}
                  onChange={handleChangeConstraint10StopDateName}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    className: classnames({
                      [classes.lineThrough]: !constraint10StopDateIsEnabled,
                    }),
                  }}
                  error={errorMessages.constraint10StopDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint10StopDateName.map(
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
                  value={props.constraint10.kinmu_id}
                  onChange={handleChangeConstraint10KinmuId}
                  fullWidth={true}
                >
                  {kinmusInTerm.map((kinmu) => (
                    <MenuItem key={kinmu.id} value={kinmu.id}>
                      {
                        <span
                          className={classnames({
                            [classes.lineThrough]: !kinmu.is_enabled,
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
        <DialogTitle>職員の期間に割り当てない勤務の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この職員の期間に割り当てない勤務を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint10}>
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

export default Constraint10;
