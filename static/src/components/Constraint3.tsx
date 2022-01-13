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

import * as constraints3 from "../modules/constraints3";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import * as utils from "../utils";

import Constraint3Name from "./names/Constraint3Name";
import KinmuName from "./names/KinmuName";
import MemberName from "./names/MemberName";
import ExpandMoreButton from "./parts/ExpandMoreButton";

type Props = {
  constraint3: constraints3.Constraint3;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
  changes: {
    min_number_of_assignments: number;
  };
};

// eslint-disable-next-line react/display-name
const Constraint3 = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedMember = useAppSelector((state) =>
    members.selectors.selectById(state, props.constraint3.member_id)
  );
  const selectedKinmu = useAppSelector((state) =>
    kinmus.selectors.selectById(state, props.constraint3.kinmu_id)
  );
  const [state, updateState] = useImmer<State>({
    changes: {
      min_number_of_assignments: props.constraint3.min_number_of_assignments,
    },
    deletionDialogIsOpen: false,
    expanded: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.min_number_of_assignments =
          props.constraint3.min_number_of_assignments;
      }),
    [props.constraint3.min_number_of_assignments, updateState]
  );
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === props.constraint3.term_id
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint3.term_id
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeConstraint3IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints3.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.constraint3.id,
      })
    );
  };
  const handleChangeConstraint3MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints3.update({
        changes: {
          member_id: parseInt(event.target.value, 10),
        },
        id: props.constraint3.id,
      })
    );
  };
  const handleChangeConstraint3KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints3.update({
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
        id: props.constraint3.id,
      })
    );
  };
  const handleChangeConstraint3MinNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.min_number_of_assignments = parseInt(
        event.target.value,
        10
      );
    });
  };
  const handleBlurConstraint3MinNumberOfAssignments = () => {
    if (
      state.changes.min_number_of_assignments ===
      props.constraint3.min_number_of_assignments
    )
      return;
    dispatch(
      constraints3.update({
        changes: {
          min_number_of_assignments: state.changes.min_number_of_assignments,
        },
        id: props.constraint3.id,
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
  const handleClickDeleteConstraint3 = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(constraints3.remove(props.constraint3.id));
  };
  const errorMessages = constraints3.getErrorMessages(t, {
    constraint3: props.constraint3,
  });
  const relativesAreEnabled =
    utils.noErrors(errorMessages) &&
    selectedMember?.is_enabled &&
    utils.noErrors(members.getErrorMessages(t, { member: selectedMember })) &&
    selectedKinmu?.is_enabled &&
    utils.noErrors(kinmus.getErrorMessages(t, { kinmu: selectedKinmu }));
  const title = <Constraint3Name constraint3={props.constraint3} />;
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint3.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint3IsEnabled}
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
                  label={t("職員")}
                  value={props.constraint3.member_id}
                  onChange={handleChangeConstraint3MemberId}
                  fullWidth={true}
                >
                  {membersInTerm.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      <MemberName member={member} />
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  select={true}
                  label={t("勤務")}
                  value={props.constraint3.kinmu_id}
                  onChange={handleChangeConstraint3KinmuId}
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
                  label={t("勤務割り当て数下限")}
                  type="number"
                  value={state.changes.min_number_of_assignments}
                  onChange={handleChangeConstraint3MinNumberOfAssignments}
                  onBlur={handleBlurConstraint3MinNumberOfAssignments}
                  fullWidth={true}
                  inputProps={{
                    min: constraints3.minOfConstraint3MinNumberOfAssignments,
                  }}
                  error={errorMessages.min_number_of_assignments.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.min_number_of_assignments.map(
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
          {t("{{arg0}}の削除", { arg0: t("職員への勤務の割り当て数の下限") })}
        </DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("この{{arg0}}を削除します", {
              arg0: t("職員への勤務の割り当て数の下限"),
            })}
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint3}>
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

export default Constraint3;
