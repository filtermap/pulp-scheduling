import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
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

import * as constraints7 from "../modules/constraints7";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as utils from "../utils";

import Constraint7Name from "./names/Constraint7Name";
import KinmuName from "./names/KinmuName";
import ExpandMoreButton from "./parts/ExpandMoreButton";
import FlexStartDialogActions from "./parts/FlexStartDialogActions";

type Props = {
  constraint7: constraints7.Constraint7;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
  changes: {
    min_number_of_days: number;
  };
};

// eslint-disable-next-line react/display-name
const Constraint7 = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmu = useAppSelector((state) =>
    kinmus.selectors.selectById(state, props.constraint7.kinmu_id)
  );
  const [state, updateState] = useImmer<State>({
    changes: {
      min_number_of_days: props.constraint7.min_number_of_days,
    },
    deletionDialogIsOpen: false,
    expanded: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.min_number_of_days = props.constraint7.min_number_of_days;
      }),
    [props.constraint7.min_number_of_days, updateState]
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint7.term_id
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeConstraint7IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints7.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.constraint7.id,
      })
    );
  };
  const handleChangeConstraint7KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints7.update({
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
        id: props.constraint7.id,
      })
    );
  };
  const handleChangeConstraint7MinNumberOfDays = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.min_number_of_days = parseInt(event.target.value, 10);
    });
  };
  const handleBlurConstraint7MinNumberOfDays = () => {
    if (
      state.changes.min_number_of_days === props.constraint7.min_number_of_days
    )
      return;
    dispatch(
      constraints7.update({
        changes: {
          min_number_of_days: state.changes.min_number_of_days,
        },
        id: props.constraint7.id,
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
  const handleClickDeleteConstraint7 = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(constraints7.remove(props.constraint7.id));
  };
  const errorMessages = constraints7.getErrorMessages(t, {
    constraint7: props.constraint7,
  });
  const relativesAreEnabled =
    utils.noErrors(errorMessages) &&
    selectedKinmu?.is_enabled &&
    utils.noErrors(kinmus.getErrorMessages(t, { kinmu: selectedKinmu }));
  const title = <Constraint7Name constraint7={props.constraint7} />;
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
                  label={t("勤務")}
                  value={props.constraint7.kinmu_id}
                  onChange={handleChangeConstraint7KinmuId}
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
                  label={t("間隔日数下限")}
                  type="number"
                  value={state.changes.min_number_of_days}
                  onChange={handleChangeConstraint7MinNumberOfDays}
                  onBlur={handleBlurConstraint7MinNumberOfDays}
                  fullWidth={true}
                  inputProps={{
                    min: constraints7.minOfConstraint7MinNumberOfDays,
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
          {t("{{arg0}}の削除", { arg0: t("勤務の間隔日数の下限") })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("この{{arg0}}を削除します", { arg0: t("勤務の間隔日数の下限") })}
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <FlexStartDialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint7}>
            {t("削除")}
          </Button>
          <Button color="primary" onClick={handleCloseDeletionDialog}>
            {t("閉じる")}
          </Button>
        </FlexStartDialogActions>
      </Dialog>
    </>
  );
});

export default Constraint7;
