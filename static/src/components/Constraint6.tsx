import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import MenuItem from "@material-ui/core/MenuItem";
import { Theme, WithStyles } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classnames from "classnames";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as constraints6 from "../modules/constraints6";
import { RootState } from "../modules/store";

type Props = {
  constraint6: constraints6.Constraint6;
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint6MaxNumberOfDays: string[];
};

function select(state: RootState) {
  return {
    kinmus: state.present.kinmus,
  };
}

function Constraint6(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === props.constraint6.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeConstraint6IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    dispatch(
      constraints6.updateConstraint6IsEnabled({
        id: props.constraint6.id,
        is_enabled: checked,
      })
    );
  };
  const handleChangeConstraint6KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints6.updateConstraint6KinmuId({
        id: props.constraint6.id,
        kinmu_id: parseInt(event.target.value, 10),
      })
    );
  };
  const validate = (constraint6MaxNumberOfDays: number): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint6MaxNumberOfDays: [],
    };
    if (isNaN(constraint6MaxNumberOfDays)) {
      errorMessages.constraint6MaxNumberOfDays.push(
        "連続日数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeConstraint6MaxNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints6.updateConstraint6MaxNumberOfDays({
        id: props.constraint6.id,
        max_number_of_days: parseInt(event.target.value, 10),
      })
    );
  };
  const handleClickOpenDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: true }));
  };
  const handleCloseDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
  };
  const handleClickDeleteConstraint6 = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(constraints6.deleteConstraint6({ id: props.constraint6.id }));
  };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint6Kinmu = kinmusInTerm.find(
    ({ id }) => id === props.constraint6.kinmu_id
  )!;
  const relativesAreEnabled = constraint6Kinmu.is_enabled;
  const title = (
    <>
      <span
        className={classnames({
          [props.classes.lineThrough]: !constraint6Kinmu.is_enabled,
        })}
      >
        {constraint6Kinmu.name}
      </span>
      の連続日数を{props.constraint6.max_number_of_days}日以下にする
    </>
  );
  const errorMessages = validate(props.constraint6.max_number_of_days);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint6.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint6IsEnabled}
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
                  label="勤務"
                  value={props.constraint6.kinmu_id}
                  onChange={handleChangeConstraint6KinmuId}
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
                  label="連続日数上限"
                  type="number"
                  defaultValue={props.constraint6.max_number_of_days}
                  onChange={handleChangeConstraint6MaxNumberOfDays}
                  fullWidth={true}
                  inputProps={{
                    min: constraints6.minOfConstraint6MaxNumberOfDays,
                  }}
                  error={errorMessages.constraint6MaxNumberOfDays.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint6MaxNumberOfDays.map(
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
        <DialogTitle>勤務の連続日数の上限の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この勤務の連続日数の上限を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint6}>
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

export default withStyles(styles)(Constraint6);
