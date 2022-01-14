import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useImmer } from "use-immer";

import { useHashFragment } from "../hooks/useHashFragment";
import { usePosition } from "../hooks/usePosition";
import * as constraints4 from "../modules/constraints4";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import * as utils from "../utils";

import Constraint4 from "./Constraint4";
import KinmuName from "./names/KinmuName";
import MemberName from "./names/MemberName";
import FlexStartDialogActions from "./parts/FlexStartDialogActions";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  constraint4: {
    is_enabled: boolean;
    member_id: number | undefined;
    kinmu_id: number | undefined;
    max_number_of_assignments: number;
  };
};

// eslint-disable-next-line react/display-name
const Constraints4 = React.memo((): JSX.Element => {
  const { t } = useTranslation();
  const [position, ref] = usePosition();
  useHashFragment(position?.top);
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints4 = useSelector(constraints4.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedMemberById = useSelector(members.selectors.selectEntities);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const constraints4InTerm = selectedConstraints4.filter(
    ({ term_id }) => term_id === termId
  );
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmu_id = kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined;
  const member_id = membersInTerm.length > 0 ? membersInTerm[0].id : undefined;
  const [state, updateState] = useImmer<State>({
    constraint4: {
      is_enabled: true,
      kinmu_id,
      max_number_of_assignments:
        constraints4.minOfConstraint4MaxNumberOfAssignments,
      member_id,
    },
    creationDialogIsOpen: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.constraint4 = {
          ...state.constraint4,
          kinmu_id,
          member_id,
        };
      }),
    [kinmu_id, member_id, updateState]
  );
  const handleClickOpenCreationDialog = () => {
    updateState((state) => {
      state.creationDialogIsOpen = true;
    });
  };
  const handleCloseCreationDialog = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
  };
  const handleChangeNewConstraint4IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint4.is_enabled = event.target.checked;
    });
  };
  const handleChangeNewConstraint4MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint4.member_id = parseInt(event.target.value, 10);
    });
  };
  const handleChangeNewConstraint4KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint4.kinmu_id = parseInt(event.target.value, 10);
    });
  };
  const handleChangeNewConstraint4MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.constraint4.max_number_of_assignments = parseInt(
        event.target.value,
        10
      );
    });
  };
  const handleClickCreateConstraint4 = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      constraints4.add({
        is_enabled: state.constraint4.is_enabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.constraint4.kinmu_id!,
        max_number_of_assignments: state.constraint4.max_number_of_assignments,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        member_id: state.constraint4.member_id!,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {t("職員への勤務の割り当て数の上限")}
        </Typography>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1} ref={ref}>
          {constraints4InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12} id={`constraint4-${c.id}`}>
              <Constraint4 constraint4={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      <FloatingAddButton onClick={handleClickOpenCreationDialog} />
      {state.constraint4.member_id === undefined ||
      state.constraint4.kinmu_id === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            {t("{{arg0}}を追加できません", {
              arg0: t("職員への勤務の割り当て数の上限"),
            })}
          </DialogTitle>
          <DialogContent>
            {state.constraint4.member_id === undefined && (
              <DialogContentText>{t("職員がいません")}</DialogContentText>
            )}
            {state.constraint4.kinmu_id === undefined && (
              <DialogContentText>{t("勤務がありません")}</DialogContentText>
            )}
          </DialogContent>
          <FlexStartDialogActions>
            <Button color="primary" onClick={handleCloseCreationDialog}>
              {t("閉じる")}
            </Button>
          </FlexStartDialogActions>
        </Dialog>
      ) : (
        (() => {
          const errorMessages = constraints4.getErrorMessages(t, {
            constraint4: state.constraint4,
          });
          const newConstraint4Member =
            selectedMemberById[state.constraint4.member_id];
          const newConstraint4Kinmu =
            selectedKinmuById[state.constraint4.kinmu_id];
          const relativesAreEnabled =
            utils.noErrors(errorMessages) &&
            newConstraint4Member?.is_enabled &&
            utils.noErrors(
              members.getErrorMessages(t, { member: newConstraint4Member })
            ) &&
            newConstraint4Kinmu?.is_enabled &&
            utils.noErrors(
              kinmus.getErrorMessages(t, { kinmu: newConstraint4Kinmu })
            );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>
                {t("{{arg0}}の追加", {
                  arg0: t("職員への勤務の割り当て数の上限"),
                })}
              </DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.constraint4.is_enabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint4IsEnabled}
                          color="primary"
                        />
                      }
                      label={t("有効")}
                    />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label={t("職員")}
                      value={state.constraint4.member_id}
                      onChange={handleChangeNewConstraint4MemberId}
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
                      value={state.constraint4.kinmu_id}
                      onChange={handleChangeNewConstraint4KinmuId}
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
                      label={t("勤務割り当て数上限")}
                      type="number"
                      value={state.constraint4.max_number_of_assignments}
                      onChange={
                        handleChangeNewConstraint4MaxNumberOfAssignments
                      }
                      fullWidth={true}
                      inputProps={{
                        min: constraints4.minOfConstraint4MaxNumberOfAssignments,
                      }}
                      error={errorMessages.max_number_of_assignments.length > 0}
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.max_number_of_assignments.map(
                        (message) => (
                          <div key={message}>{message}</div>
                        )
                      )}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <FlexStartDialogActions>
                <Button
                  color="primary"
                  disabled={Object.values(errorMessages).some(
                    (messages) => messages.length > 0
                  )}
                  onClick={handleClickCreateConstraint4}
                >
                  {t("追加")}
                </Button>
                <Button color="primary" onClick={handleCloseCreationDialog}>
                  {t("閉じる")}
                </Button>
              </FlexStartDialogActions>
            </Dialog>
          );
        })()
      )}
    </>
  );
});

export default Constraints4;
