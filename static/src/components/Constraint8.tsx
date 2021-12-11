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
import * as constraints8 from "../modules/constraints8";
import { RootState } from "../modules/store";

const PREFIX = "Constraint8";

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
  constraint8: constraints8.Constraint8;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint8MaxNumberOfDays: string[];
};

function select(state: RootState) {
  return {
    kinmus: state.present.kinmus,
  };
}

function Constraint8(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === props.constraint8.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeConstraint8IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints8.updateConstraint8IsEnabled({
        id: props.constraint8.id,
        is_enabled: event.target.checked,
      })
    );
  };
  const handleChangeConstraint8KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints8.updateConstraint8KinmuId({
        id: props.constraint8.id,
        kinmu_id: parseInt(event.target.value, 10),
      })
    );
  };
  const validate = (constraint8MaxNumberOfDays: number): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint8MaxNumberOfDays: [],
    };
    if (isNaN(constraint8MaxNumberOfDays)) {
      errorMessages.constraint8MaxNumberOfDays.push(
        "間隔日数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeConstraint8MaxNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints8.updateConstraint8MaxNumberOfDays({
        id: props.constraint8.id,
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
  const handleClickDeleteConstraint8 = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(constraints8.deleteConstraint8({ id: props.constraint8.id }));
  };
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const constraint8Kinmu = kinmusInTerm.find(
    ({ id }) => id === props.constraint8.kinmu_id
  )!;
  const relativesAreEnabled = constraint8Kinmu.is_enabled;
  const title = (
    <Root>
      <span
        className={classnames({
          [classes.lineThrough]: !constraint8Kinmu.is_enabled,
        })}
      >
        {constraint8Kinmu.name}
      </span>
      の間隔日数を{props.constraint8.max_number_of_days}日以下にする
    </Root>
  );
  const errorMessages = validate(props.constraint8.max_number_of_days);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint8.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint8IsEnabled}
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
                  label="勤務"
                  value={props.constraint8.kinmu_id}
                  onChange={handleChangeConstraint8KinmuId}
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
                  label="間隔日数上限"
                  type="number"
                  defaultValue={props.constraint8.max_number_of_days}
                  onChange={handleChangeConstraint8MaxNumberOfDays}
                  fullWidth={true}
                  inputProps={{
                    min: constraints8.minOfConstraint8MaxNumberOfDays,
                  }}
                  error={errorMessages.constraint8MaxNumberOfDays.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint8MaxNumberOfDays.map(
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
        <DialogTitle>勤務の間隔日数の上限の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この勤務の間隔日数の上限を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint8}>
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

export default Constraint8;
