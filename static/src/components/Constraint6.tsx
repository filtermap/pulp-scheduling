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

import * as constraints6 from "../modules/constraints6";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";

import Constraint6Name from "./names/Constraint6Name";
import KinmuName from "./names/KinmuName";
import ExpandMoreButton from "./parts/ExpandMoreButton";

type Props = {
  constraint6: constraints6.Constraint6;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
  changes: {
    max_number_of_days: number;
  };
};

type ErrorMessages = {
  constraint6MaxNumberOfDays: string[];
};

// eslint-disable-next-line react/display-name
const Constraint6 = React.memo((props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint6.kinmu_id)!
  );
  const [state, updateState] = useImmer<State>({
    changes: {
      max_number_of_days: props.constraint6.max_number_of_days,
    },
    deletionDialogIsOpen: false,
    expanded: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.max_number_of_days = props.constraint6.max_number_of_days;
      }),
    [props.constraint6.max_number_of_days, updateState]
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint6.term_id
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeConstraint6IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints6.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.constraint6.id,
      })
    );
  };
  const handleChangeConstraint6KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints6.update({
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
        id: props.constraint6.id,
      })
    );
  };
  const validate = (constraint6MaxNumberOfDays: number): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint6MaxNumberOfDays: [],
    };
    if (isNaN(constraint6MaxNumberOfDays))
      errorMessages.constraint6MaxNumberOfDays.push(
        "連続日数上限の形式が正しくありません"
      );
    return errorMessages;
  };
  const handleChangeConstraint6MaxNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.max_number_of_days = parseInt(event.target.value, 10);
    });
  };
  const handleBlurConstraint6MaxNumberOfDays = () => {
    if (
      state.changes.max_number_of_days === props.constraint6.max_number_of_days
    )
      return;
    dispatch(
      constraints6.update({
        changes: {
          max_number_of_days: state.changes.max_number_of_days,
        },
        id: props.constraint6.id,
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
  const handleClickDeleteConstraint6 = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(constraints6.remove(props.constraint6.id));
  };
  const relativesAreEnabled = selectedKinmu.is_enabled;
  const title = <Constraint6Name constraint6={props.constraint6} />;
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
                  select={true}
                  label="勤務"
                  value={props.constraint6.kinmu_id}
                  onChange={handleChangeConstraint6KinmuId}
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
                  label="連続日数上限"
                  type="number"
                  value={state.changes.max_number_of_days}
                  onChange={handleChangeConstraint6MaxNumberOfDays}
                  onBlur={handleBlurConstraint6MaxNumberOfDays}
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
});

export default Constraint6;
