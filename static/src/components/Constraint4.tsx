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
import * as constraints4 from "../modules/constraints4";
import { RootState } from "../modules/store";

const PREFIX = "Constraint4";

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
  constraint4: constraints4.Constraint4;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint4MaxNumberOfAssignments: string[];
};

function select(state: RootState) {
  return {
    kinmus: state.present.kinmus,
    members: state.present.members,
  };
}

function Constraint4(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const membersInTerm = selected.members.filter(
    ({ term_id }) => term_id === props.constraint4.term_id
  );
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === props.constraint4.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeConstraint4IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints4.updateConstraint4IsEnabled({
        id: props.constraint4.id,
        is_enabled: event.target.checked,
      })
    );
  };
  const handleChangeConstraint4MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints4.updateConstraint4MemberId({
        id: props.constraint4.id,
        member_id: parseInt(event.target.value, 10),
      })
    );
  };
  const handleChangeConstraint4KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints4.updateConstraint4KinmuId({
        id: props.constraint4.id,
        kinmu_id: parseInt(event.target.value, 10),
      })
    );
  };
  const validate = (
    constraint4MaxNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint4MaxNumberOfAssignments: [],
    };
    if (isNaN(constraint4MaxNumberOfAssignments)) {
      errorMessages.constraint4MaxNumberOfAssignments.push(
        "割り当て数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeConstraint4MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints4.updateConstraint4MaxNumberOfAssignments({
        id: props.constraint4.id,
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
  const handleClickDeleteConstraint4 = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(constraints4.deleteConstraint4({ id: props.constraint4.id }));
  };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint4Member = membersInTerm.find(
    ({ id }) => id === props.constraint4.member_id
  )!;
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint4Kinmu = kinmusInTerm.find(
    ({ id }) => id === props.constraint4.kinmu_id
  )!;
  const relativesAreEnabled =
    constraint4Member.is_enabled && constraint4Kinmu.is_enabled;
  const title = (
    <Root>
      <span
        className={classnames({
          [classes.lineThrough]: !constraint4Member.is_enabled,
        })}
      >
        {constraint4Member.name}
      </span>
      に
      <span
        className={classnames({
          [classes.lineThrough]: !constraint4Kinmu.is_enabled,
        })}
      >
        {constraint4Kinmu.name}
      </span>
      を{props.constraint4.max_number_of_assignments}回以下割り当てる
    </Root>
  );
  const errorMessages = validate(props.constraint4.max_number_of_assignments);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint4.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint4IsEnabled}
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
                  value={props.constraint4.member_id}
                  onChange={handleChangeConstraint4MemberId}
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
                  select={true}
                  label="勤務"
                  value={props.constraint4.kinmu_id}
                  onChange={handleChangeConstraint4KinmuId}
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
              <Grid item={true} xs={12}>
                <TextField
                  label="割り当て数上限"
                  type="number"
                  defaultValue={props.constraint4.max_number_of_assignments}
                  onChange={handleChangeConstraint4MaxNumberOfAssignments}
                  fullWidth={true}
                  inputProps={{
                    min: constraints4.minOfConstraint4MaxNumberOfAssignments,
                  }}
                  error={
                    errorMessages.constraint4MaxNumberOfAssignments.length > 0
                  }
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint4MaxNumberOfAssignments.map(
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
        <DialogTitle>職員の勤務の割り当て数の上限の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この職員の勤務の割り当て数の上限を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint4}>
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

export default Constraint4;
