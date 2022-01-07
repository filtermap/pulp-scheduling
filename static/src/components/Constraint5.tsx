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
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useImmer } from "use-immer";

import * as constraints5 from "../modules/constraints5";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";

import Constraint5Name from "./names/Constraint5Name";
import KinmuName from "./names/KinmuName";
import ExpandMoreButton from "./parts/ExpandMoreButton";

type Props = {
  constraint5: constraints5.Constraint5;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
  changes: {
    min_number_of_days: number;
  };
};

// eslint-disable-next-line react/display-name
const Constraint5 = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmu = useAppSelector((state) =>
    kinmus.selectors.selectById(state, props.constraint5.kinmu_id)
  );
  const [state, updateState] = useImmer<State>({
    changes: {
      min_number_of_days: props.constraint5.min_number_of_days,
    },
    deletionDialogIsOpen: false,
    expanded: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.min_number_of_days = props.constraint5.min_number_of_days;
      }),
    [props.constraint5.min_number_of_days, updateState]
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint5.term_id
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeConstraint5IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints5.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.constraint5.id,
      })
    );
  };
  const handleChangeConstraint5KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints5.update({
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
        id: props.constraint5.id,
      })
    );
  };
  const handleChangeConstraint5MinNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.min_number_of_days = parseInt(event.target.value, 10);
    });
  };
  const handleBlurConstraint5MinNumberOfDays = () => {
    if (
      state.changes.min_number_of_days === props.constraint5.min_number_of_days
    )
      return;
    dispatch(
      constraints5.update({
        changes: {
          min_number_of_days: state.changes.min_number_of_days,
        },
        id: props.constraint5.id,
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
  const handleClickDeleteConstraint5 = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(constraints5.remove(props.constraint5.id));
  };
  const relativesAreEnabled = selectedKinmu?.is_enabled;
  const title = <Constraint5Name constraint5={props.constraint5} />;
  const errorMessages = constraints5.getErrorMessages(t, props.constraint5);
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
                  label={t("勤務")}
                  value={props.constraint5.kinmu_id}
                  onChange={handleChangeConstraint5KinmuId}
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
                  label={t("連続日数下限")}
                  type="number"
                  value={state.changes.min_number_of_days}
                  onChange={handleChangeConstraint5MinNumberOfDays}
                  onBlur={handleBlurConstraint5MinNumberOfDays}
                  fullWidth={true}
                  inputProps={{
                    min: constraints5.minOfConstraint5MinNumberOfDays,
                  }}
                  error={errorMessages.min_number_of_days.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.min_number_of_days.map(
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
              {t("削除")}
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
        <DialogTitle>
          {t("{{arg0}}の削除", { arg0: t("勤務の連続日数の下限") })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("この{{arg0}}を削除します", { arg0: t("勤務の連続日数の下限") })}
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint5}>
            {t("削除")}
          </Button>
          <Button color="primary" onClick={handleCloseDeletionDialog}>
            {t("閉じる")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Constraint5;
