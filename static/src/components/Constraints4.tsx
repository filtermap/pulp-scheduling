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

import * as constraints4 from "../modules/constraints4";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";

import Constraint4 from "./Constraint4";
import KinmuName from "./names/KinmuName";
import MemberName from "./names/MemberName";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint4IsEnabled: boolean;
  newConstraint4MemberId: number | undefined;
  newConstraint4KinmuId: number | undefined;
  newConstraint4MaxNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint4MaxNumberOfAssignments: string[];
};

// eslint-disable-next-line react/display-name
const Constraints4 = React.memo((): JSX.Element => {
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
  const newConstraint4KinmuId =
    kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined;
  const newConstraint4MemberId =
    membersInTerm.length > 0 ? membersInTerm[0].id : undefined;
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    newConstraint4IsEnabled: true,
    newConstraint4KinmuId,
    newConstraint4MaxNumberOfAssignments:
      constraints4.minOfConstraint4MaxNumberOfAssignments,
    newConstraint4MemberId,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.newConstraint4KinmuId = newConstraint4KinmuId;
        state.newConstraint4MemberId = newConstraint4MemberId;
      }),
    [newConstraint4KinmuId, newConstraint4MemberId, updateState]
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
      state.newConstraint4IsEnabled = event.target.checked;
    });
  };
  const handleChangeNewConstraint4MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint4MemberId = parseInt(event.target.value, 10);
    });
  };
  const handleChangeNewConstraint4KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint4KinmuId = parseInt(event.target.value, 10);
    });
  };
  const validate = (
    newConstraint4MaxNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint4MaxNumberOfAssignments: [],
    };
    if (isNaN(newConstraint4MaxNumberOfAssignments))
      errorMessages.newConstraint4MaxNumberOfAssignments.push(
        "割り当て数上限の形式が正しくありません"
      );
    return errorMessages;
  };
  const handleChangeNewConstraint4MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint4MaxNumberOfAssignments = parseInt(
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
        is_enabled: state.newConstraint4IsEnabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint4KinmuId!,
        max_number_of_assignments: state.newConstraint4MaxNumberOfAssignments,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        member_id: state.newConstraint4MemberId!,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          職員の勤務の割り当て数の上限
        </Typography>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {constraints4InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint4 constraint4={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      <FloatingAddButton onClick={handleClickOpenCreationDialog} />
      {state.newConstraint4MemberId === undefined ||
      state.newConstraint4KinmuId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            職員の勤務の割り当て数の上限を追加できません
          </DialogTitle>
          <DialogContent>
            {state.newConstraint4MemberId === undefined && (
              <DialogContentText>職員がいません</DialogContentText>
            )}
            {state.newConstraint4KinmuId === undefined && (
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
          const newConstraint4Member =
            selectedMemberById[state.newConstraint4MemberId];
          const newConstraint4Kinmu =
            selectedKinmuById[state.newConstraint4KinmuId];
          const relativesAreEnabled =
            newConstraint4Member?.is_enabled && newConstraint4Kinmu?.is_enabled;
          const errorMessages = validate(
            state.newConstraint4MaxNumberOfAssignments
          );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>職員の勤務の割り当て数の上限の追加</DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint4IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint4IsEnabled}
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
                      value={state.newConstraint4MemberId}
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
                      label="勤務"
                      value={state.newConstraint4KinmuId}
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
                      label="割り当て数上限"
                      type="number"
                      value={state.newConstraint4MaxNumberOfAssignments}
                      onChange={
                        handleChangeNewConstraint4MaxNumberOfAssignments
                      }
                      fullWidth={true}
                      inputProps={{
                        min: constraints4.minOfConstraint4MaxNumberOfAssignments,
                      }}
                      error={
                        errorMessages.newConstraint4MaxNumberOfAssignments
                          .length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint4MaxNumberOfAssignments.map(
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
                  onClick={handleClickCreateConstraint4}
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
});

export default Constraints4;
