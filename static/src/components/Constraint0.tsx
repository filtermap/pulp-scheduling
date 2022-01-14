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

import * as all from "../modules/all";
import * as constraint0_kinmus from "../modules/constraint0_kinmus";
import * as constraints0 from "../modules/constraints0";
import * as kinmus from "../modules/kinmus";
import * as utils from "../utils";

import Constraint0Name from "./names/Constraint0Name";
import KinmuName from "./names/KinmuName";
import ExpandMoreButton from "./parts/ExpandMoreButton";
import FlexStartDialogActions from "./parts/FlexStartDialogActions";

type Props = {
  constraint0: constraints0.Constraint0;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

// eslint-disable-next-line react/display-name
const Constraint0 = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedConstraint0Kinmus = useSelector(
    constraint0_kinmus.selectors.selectAll
  );
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const [state, updateState] = useImmer<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint0.term_id
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeConstraint0IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints0.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.constraint0.id,
      })
    );
  };
  const handleClickCreateConstraint0Kinmu = (sequence_number: number) => () => {
    const kinmu_id = kinmusInTerm[0].id;
    dispatch(
      constraint0_kinmus.add({
        constraint0_id: props.constraint0.id,
        kinmu_id,
        sequence_number,
      })
    );
  };
  const handleChangeConstraint0KinmuKinmuId =
    (constraint0_kinmu_id: number) =>
    (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        constraint0_kinmus.update({
          changes: {
            kinmu_id: parseInt(event.target.value, 10),
          },
          id: constraint0_kinmu_id,
        })
      );
    };
  const handleClickDeleteConstraint0Kinmu =
    (constraint0_kinmu_id: number) => () => {
      dispatch(all.removeConstraint0Kinmu(constraint0_kinmu_id));
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
  const handleClickDeleteConstraint0 = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(all.removeConstraint0(props.constraint0.id));
  };
  const constraint0Constraint0Kinmus = selectedConstraint0Kinmus
    .filter(({ constraint0_id }) => constraint0_id === props.constraint0.id)
    .sort((a, b) => a.sequence_number - b.sequence_number);
  const relativesAreEnabled = constraint0Constraint0Kinmus.every(
    ({ kinmu_id }) => {
      const kinmu = selectedKinmuById[kinmu_id];
      return (
        kinmu?.is_enabled &&
        utils.noErrors(kinmus.getErrorMessages(t, { kinmu }))
      );
    }
  );
  const title = <Constraint0Name constraint0={props.constraint0} />;
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint0.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint0IsEnabled}
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
                <Button
                  size="small"
                  onClick={handleClickCreateConstraint0Kinmu(0)}
                >
                  {t("追加")}
                </Button>
              </Grid>
              {constraint0Constraint0Kinmus.map((constraint0_kinmu, index) => (
                <React.Fragment key={constraint0_kinmu.id}>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label={t("勤務{{arg0}}", { arg0: index + 1 })}
                      value={constraint0_kinmu.kinmu_id}
                      onChange={handleChangeConstraint0KinmuKinmuId(
                        constraint0_kinmu.id
                      )}
                      fullWidth={true}
                    >
                      {kinmusInTerm.map((kinmu) => (
                        <MenuItem key={kinmu.id} value={kinmu.id}>
                          <KinmuName kinmu={kinmu} />
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  {constraint0Constraint0Kinmus.length > 2 && (
                    <Grid item={true} xs={12}>
                      <Button
                        size="small"
                        onClick={handleClickDeleteConstraint0Kinmu(
                          constraint0_kinmu.id
                        )}
                      >
                        {t("削除")}
                      </Button>
                    </Grid>
                  )}
                  <Grid item={true} xs={12}>
                    <Button
                      size="small"
                      onClick={handleClickCreateConstraint0Kinmu(
                        constraint0_kinmu.sequence_number + 1
                      )}
                    >
                      {t("追加")}
                    </Button>
                  </Grid>
                </React.Fragment>
              ))}
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
          {t("{{arg0}}の削除", { arg0: t("連続禁止勤務並び") })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("この{{arg0}}を削除します", { arg0: t("連続禁止勤務並び") })}
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <FlexStartDialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint0}>
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

export default Constraint0;
