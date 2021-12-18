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

import * as constraints7 from "../modules/constraints7";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";

import ExpandMoreButton from "./parts/ExpandMoreButton";
import lineThroughSx from "./parts/lineThroughSx";

type Props = {
  constraint7: constraints7.Constraint7;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint7MinNumberOfDays: string[];
};
function Constraint7(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint7.kinmu_id)!
  );
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint7.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeConstraint7IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints7.update({
        id: props.constraint7.id,
        changes: {
          is_enabled: event.target.checked,
        },
      })
    );
  };
  const handleChangeConstraint7KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints7.update({
        id: props.constraint7.id,
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
      })
    );
  };
  const validate = (constraint7MinNumberOfDays: number): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint7MinNumberOfDays: [],
    };
    if (isNaN(constraint7MinNumberOfDays)) {
      errorMessages.constraint7MinNumberOfDays.push(
        "間隔日数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeConstraint7MinNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints7.update({
        id: props.constraint7.id,
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
  const handleClickDeleteConstraint7 = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(constraints7.remove(props.constraint7.id));
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
      の間隔日数を{props.constraint7.min_number_of_days}日以上にする
    </>
  );
  const errorMessages = validate(props.constraint7.min_number_of_days);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint7.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint7IsEnabled}
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
                  value={props.constraint7.kinmu_id}
                  onChange={handleChangeConstraint7KinmuId}
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
                  label="間隔日数下限"
                  type="number"
                  defaultValue={props.constraint7.min_number_of_days}
                  onChange={handleChangeConstraint7MinNumberOfDays}
                  fullWidth={true}
                  inputProps={{
                    min: constraints7.minOfConstraint7MinNumberOfDays,
                  }}
                  error={errorMessages.constraint7MinNumberOfDays.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint7MinNumberOfDays.map(
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
        <DialogTitle>勤務の間隔日数の下限の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この勤務の間隔日数の下限を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint7}>
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

export default Constraint7;
