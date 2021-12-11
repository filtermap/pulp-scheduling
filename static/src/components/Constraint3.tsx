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
import * as constraints3 from "../modules/constraints3";
import { RootState } from "../modules/store";

type Props = {
  constraint3: constraints3.Constraint3;
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint3MinNumberOfAssignments: string[];
};

function select(state: RootState) {
  return {
    kinmus: state.present.kinmus,
    members: state.present.members,
  };
}

function Constraint3(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const membersInTerm = selected.members.filter(
    ({ term_id }) => term_id === props.constraint3.term_id
  );
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === props.constraint3.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeConstraint3IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    dispatch(
      constraints3.updateConstraint3IsEnabled({
        id: props.constraint3.id,
        is_enabled: checked,
      })
    );
  };
  const handleChangeConstraint3MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints3.updateConstraint3MemberId({
        id: props.constraint3.id,
        member_id: parseInt(event.target.value, 10),
      })
    );
  };
  const handleChangeConstraint3KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints3.updateConstraint3KinmuId({
        id: props.constraint3.id,
        kinmu_id: parseInt(event.target.value, 10),
      })
    );
  };
  const validate = (
    constraint3MinNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint3MinNumberOfAssignments: [],
    };
    if (isNaN(constraint3MinNumberOfAssignments)) {
      errorMessages.constraint3MinNumberOfAssignments.push(
        "割り当て数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeConstraint3MinNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints3.updateConstraint3MinNumberOfAssignments({
        id: props.constraint3.id,
        min_number_of_assignments: parseInt(event.target.value, 10),
      })
    );
  };
  const handleClickOpenDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: true }));
  };
  const handleCloseDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
  };
  const handleClickDeleteConstraint3 = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(constraints3.deleteConstraint3({ id: props.constraint3.id }));
  };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint3Member = membersInTerm.find(
    ({ id }) => id === props.constraint3.member_id
  )!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint3Kinmu = kinmusInTerm.find(
    ({ id }) => id === props.constraint3.kinmu_id
  )!;
  const relativesAreEnabled =
    constraint3Member.is_enabled && constraint3Kinmu.is_enabled;
  const title = (
    <>
      <span
        className={classnames({
          [props.classes.lineThrough]: !constraint3Member.is_enabled,
        })}
      >
        {constraint3Member.name}
      </span>
      に
      <span
        className={classnames({
          [props.classes.lineThrough]: !constraint3Kinmu.is_enabled,
        })}
      >
        {constraint3Kinmu.name}
      </span>
      を{props.constraint3.min_number_of_assignments}回以上割り当てる
    </>
  );
  const errorMessages = validate(props.constraint3.min_number_of_assignments);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint3.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint3IsEnabled}
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
                  label="職員"
                  value={props.constraint3.member_id}
                  onChange={handleChangeConstraint3MemberId}
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
                  select={true}
                  label="勤務"
                  value={props.constraint3.kinmu_id}
                  onChange={handleChangeConstraint3KinmuId}
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
                  label="割り当て数下限"
                  type="number"
                  defaultValue={props.constraint3.min_number_of_assignments}
                  onChange={handleChangeConstraint3MinNumberOfAssignments}
                  fullWidth={true}
                  inputProps={{
                    min: constraints3.minOfConstraint3MinNumberOfAssignments,
                  }}
                  error={
                    errorMessages.constraint3MinNumberOfAssignments.length > 0
                  }
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint3MinNumberOfAssignments.map(
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
        <DialogTitle>職員の勤務の割り当て数の下限の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この職員の勤務の割り当て数の下限を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint3}>
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

export default withStyles(styles)(Constraint3);
