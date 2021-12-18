import Box from "@mui/material/Box";
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

import * as constraints5 from "../modules/constraints5";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";

import ExpandMoreButton from "./parts/ExpandMoreButton";
import lineThroughSx from "./parts/lineThroughSx";

type Props = {
  constraint5: constraints5.Constraint5;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint5MinNumberOfDays: string[];
};
function Constraint5(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint5.kinmu_id)!
  );
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint5.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeConstraint5IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints5.update({
        id: props.constraint5.id,
        changes: {
          is_enabled: event.target.checked,
        },
      })
    );
  };
  const handleChangeConstraint5KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints5.update({
        id: props.constraint5.id,
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
      })
    );
  };
  const validate = (constraint5MinNumberOfDays: number): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint5MinNumberOfDays: [],
    };
    if (isNaN(constraint5MinNumberOfDays)) {
      errorMessages.constraint5MinNumberOfDays.push(
        "連続日数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeConstraint5MinNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints5.update({
        id: props.constraint5.id,
        changes: {
          min_number_of_days: parseInt(event.target.value, 10),
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
  const handleClickDeleteConstraint5 = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(constraints5.remove(props.constraint5.id));
  };
  const relativesAreEnabled = selectedKinmu.is_enabled;
  const title = (
    <>
      <Box
        component="span"
        sx={{ ...(!selectedKinmu.is_enabled && lineThroughSx) }}
      >
        {selectedKinmu.name}
      </Box>
      の連続日数を{props.constraint5.min_number_of_days}日以上にする
    </>
  );
  const errorMessages = validate(props.constraint5.min_number_of_days);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint5.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint5IsEnabled}
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
                  value={props.constraint5.kinmu_id}
                  onChange={handleChangeConstraint5KinmuId}
                  fullWidth={true}
                >
                  {kinmusInTerm.map((kinmu) => (
                    <MenuItem key={kinmu.id} value={kinmu.id}>
                      <Box
                        component="span"
                        sx={{ ...(!kinmu.is_enabled && lineThroughSx) }}
                      >
                        {kinmu.name}
                      </Box>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label="連続日数下限"
                  type="number"
                  defaultValue={props.constraint5.min_number_of_days}
                  onChange={handleChangeConstraint5MinNumberOfDays}
                  fullWidth={true}
                  inputProps={{
                    min: constraints5.minOfConstraint5MinNumberOfDays,
                  }}
                  error={errorMessages.constraint5MinNumberOfDays.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint5MinNumberOfDays.map(
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
        <DialogTitle>勤務の連続日数の下限の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この勤務の連続日数の下限を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint5}>
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

export default Constraint5;
