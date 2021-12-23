import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
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
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import { useImmer } from "use-immer";

import * as constraints3 from "../modules/constraints3";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";

import Constraint3 from "./Constraint3";
import KinmuName from "./names/KinmuName";
import MemberName from "./names/MemberName";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint3IsEnabled: boolean;
  newConstraint3MemberId: number | undefined;
  newConstraint3KinmuId: number | undefined;
  newConstraint3MinNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint3MinNumberOfAssignments: string[];
};

const Constraints3 = (): JSX.Element => {
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedConstraints3 = useSelector(constraints3.selectors.selectAll);
  const selectedMemberById = useSelector(members.selectors.selectEntities);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const constraints3InTerm = selectedConstraints3.filter(
    ({ term_id }) => term_id === termId
  );
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const newConstraint3KinmuId =
    kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined;
  const newConstraint3MemberId =
    membersInTerm.length > 0 ? membersInTerm[0].id : undefined;
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    newConstraint3IsEnabled: true,
    newConstraint3KinmuId,
    newConstraint3MemberId,
    newConstraint3MinNumberOfAssignments:
      constraints3.minOfConstraint3MinNumberOfAssignments,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.newConstraint3KinmuId = newConstraint3KinmuId;
        state.newConstraint3MemberId = newConstraint3MemberId;
      }),
    [newConstraint3KinmuId, newConstraint3MemberId, updateState]
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
  const handleChangeNewConstraint3IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint3IsEnabled = event.target.checked;
    });
  };
  const handleChangeNewConstraint3MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint3MemberId = parseInt(event.target.value, 10);
    });
  };
  const handleChangeNewConstraint3KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint3KinmuId = parseInt(event.target.value, 10);
    });
  };
  const validate = (
    newConstraint3MinNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint3MinNumberOfAssignments: [],
    };
    if (isNaN(newConstraint3MinNumberOfAssignments)) {
      errorMessages.newConstraint3MinNumberOfAssignments.push(
        "割り当て数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeNewConstraint3MinNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint3MinNumberOfAssignments = parseInt(
        event.target.value,
        10
      );
    });
  };
  const handleClickCreateConstraint3 = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      constraints3.add({
        is_enabled: state.newConstraint3IsEnabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint3KinmuId!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        member_id: state.newConstraint3MemberId!,
        min_number_of_assignments: state.newConstraint3MinNumberOfAssignments,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          職員の勤務の割り当て数の下限
        </Typography>
        <Button size="small" onClick={handleClickOpenCreationDialog}>
          追加
        </Button>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {constraints3InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint3 constraint3={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      {state.newConstraint3MemberId === undefined ||
      state.newConstraint3KinmuId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            職員の勤務の割り当て数の下限を追加できません
          </DialogTitle>
          <DialogContent>
            {state.newConstraint3MemberId === undefined && (
              <DialogContentText>職員がいません</DialogContentText>
            )}
            {state.newConstraint3KinmuId === undefined && (
              <DialogContentText>勤務がありません</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleCloseCreationDialog}>
              閉じる
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        (() => {
          const newConstraint3Member =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedMemberById[state.newConstraint3MemberId]!;
          const newConstraint3Kinmu =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedKinmuById[state.newConstraint3KinmuId]!;
          const relativesAreEnabled =
            newConstraint3Member.is_enabled && newConstraint3Kinmu.is_enabled;
          const errorMessages = validate(
            state.newConstraint3MinNumberOfAssignments
          );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>職員の勤務の割り当て数の下限の追加</DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint3IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint3IsEnabled}
                          color="primary"
                        />
                      }
                      label="有効"
                    />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label="職員"
                      value={state.newConstraint3MemberId}
                      onChange={handleChangeNewConstraint3MemberId}
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
                      label="勤務"
                      value={state.newConstraint3KinmuId}
                      onChange={handleChangeNewConstraint3KinmuId}
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
                      label="割り当て数下限"
                      type="number"
                      value={state.newConstraint3MinNumberOfAssignments}
                      onChange={
                        handleChangeNewConstraint3MinNumberOfAssignments
                      }
                      fullWidth={true}
                      inputProps={{
                        min: constraints3.minOfConstraint3MinNumberOfAssignments,
                      }}
                      error={
                        errorMessages.newConstraint3MinNumberOfAssignments
                          .length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint3MinNumberOfAssignments.map(
                        (message) => (
                          <div key={message}>{message}</div>
                        )
                      )}
                    />
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  disabled={Object.values(errorMessages).some(
                    (messages) => messages.length > 0
                  )}
                  onClick={handleClickCreateConstraint3}
                >
                  追加
                </Button>
                <Button color="primary" onClick={handleCloseCreationDialog}>
                  閉じる
                </Button>
              </DialogActions>
            </Dialog>
          );
        })()
      )}
    </>
  );
};

export default Constraints3;
