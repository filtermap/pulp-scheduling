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

import * as constraints8 from "../modules/constraints8";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";

import ExpandMoreButton from "./parts/ExpandMoreButton";
import LineThrough from "./parts/LineThrough";

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

function Constraint8(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint8.kinmu_id)!
  );
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint8.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeConstraint8IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints8.update({
        id: props.constraint8.id,
        changes: {
          is_enabled: event.target.checked,
        },
      })
    );
  };
  const handleChangeConstraint8KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints8.update({
        id: props.constraint8.id,
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
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
      constraints8.update({
        id: props.constraint8.id,
        changes: {
          max_number_of_days: parseInt(event.target.value, 10),
        },
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
    dispatch(constraints8.remove(props.constraint8.id));
  };
  const relativesAreEnabled = selectedKinmu.is_enabled;
  const title = (
    <>
      <LineThrough line={!selectedKinmu.is_enabled}>
        {selectedKinmu.name}
      </LineThrough>
      の間隔日数を{props.constraint8.max_number_of_days}日以下にする
    </>
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
                  value={props.constraint8.kinmu_id}
                  onChange={handleChangeConstraint8KinmuId}
                  fullWidth={true}
                >
                  {kinmusInTerm.map((kinmu) => (
                    <MenuItem key={kinmu.id} value={kinmu.id}>
                      <LineThrough line={!kinmu.is_enabled}>
                        {kinmu.name}
                      </LineThrough>
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
