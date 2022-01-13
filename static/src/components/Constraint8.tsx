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

import * as constraints8 from "../modules/constraints8";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as utils from "../utils";

import Constraint8Name from "./names/Constraint8Name";
import KinmuName from "./names/KinmuName";
import ExpandMoreButton from "./parts/ExpandMoreButton";

type Props = {
  constraint8: constraints8.Constraint8;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
  changes: {
    max_number_of_days: number;
  };
};

// eslint-disable-next-line react/display-name
const Constraint8 = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmu = useAppSelector((state) =>
    kinmus.selectors.selectById(state, props.constraint8.kinmu_id)
  );
  const [state, updateState] = useImmer<State>({
    changes: {
      max_number_of_days: props.constraint8.max_number_of_days,
    },
    deletionDialogIsOpen: false,
    expanded: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.max_number_of_days = props.constraint8.max_number_of_days;
      }),
    [props.constraint8.max_number_of_days, updateState]
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint8.term_id
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeConstraint8IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints8.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.constraint8.id,
      })
    );
  };
  const handleChangeConstraint8KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints8.update({
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
        id: props.constraint8.id,
      })
    );
  };
  const handleChangeConstraint8MaxNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.max_number_of_days = parseInt(event.target.value, 10);
    });
  };
  const handleBlurConstraint8MaxNumberOfDays = () => {
    if (
      state.changes.max_number_of_days === props.constraint8.max_number_of_days
    )
      return;
    dispatch(
      constraints8.update({
        changes: {
          max_number_of_days: state.changes.max_number_of_days,
        },
        id: props.constraint8.id,
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
  const handleClickDeleteConstraint8 = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(constraints8.remove(props.constraint8.id));
  };
  const errorMessages = constraints8.getErrorMessages(t, {
    constraint8: props.constraint8,
  });
  const relativesAreEnabled =
    utils.noErrors(errorMessages) &&
    selectedKinmu?.is_enabled &&
    utils.noErrors(kinmus.getErrorMessages(t, { kinmu: selectedKinmu }));
  const title = <Constraint8Name constraint8={props.constraint8} />;
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
                  label={t("勤務")}
                  value={props.constraint8.kinmu_id}
                  onChange={handleChangeConstraint8KinmuId}
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
                  label={t("間隔日数上限")}
                  type="number"
                  value={state.changes.max_number_of_days}
                  onChange={handleChangeConstraint8MaxNumberOfDays}
                  onBlur={handleBlurConstraint8MaxNumberOfDays}
                  fullWidth={true}
                  inputProps={{
                    min: constraints8.minOfConstraint8MaxNumberOfDays,
                  }}
                  error={errorMessages.max_number_of_days.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.max_number_of_days.map(
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
          {t("{{arg0}}の削除", { arg0: t("勤務の間隔日数の上限") })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("この{{arg0}}を削除します", { arg0: t("勤務の間隔日数の上限") })}
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint8}>
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

export default Constraint8;
