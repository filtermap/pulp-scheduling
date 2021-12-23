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

import * as constraints9 from "../modules/constraints9";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import Constraint9 from "./Constraint9";
import KinmuName from "./names/KinmuName";
import MemberName from "./names/MemberName";
import GridFrame from "./parts/GridFrame";
import lineThroughSx from "./parts/lineThroughSx";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint9IsEnabled: boolean;
  newConstraint9MemberId: number | undefined;
  newConstraint9StartDateName: string;
  newConstraint9StopDateName: string;
  newConstraint9KinmuId: number | undefined;
};

type ErrorMessages = {
  newConstraint9StartDateName: string[];
  newConstraint9StopDateName: string[];
};

// eslint-disable-next-line react/display-name
const Constraints9 = React.memo((): JSX.Element => {
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints9 = useSelector(constraints9.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedMemberById = useSelector(members.selectors.selectEntities);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const selectedTerm = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => terms.selectors.selectById(state, termId)!
  );
  const constraints9InTerm = selectedConstraints9.filter(
    ({ term_id }) => term_id === termId
  );
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const newConstraint9KinmuId =
    kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined;
  const newConstraint9MemberId =
    membersInTerm.length > 0 ? membersInTerm[0].id : undefined;
  const newConstraint9StartDateName = selectedTerm.start_date_name;
  const newConstraint9StopDateName = selectedTerm.stop_date_name;
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    newConstraint9IsEnabled: true,
    newConstraint9KinmuId,
    newConstraint9MemberId,
    newConstraint9StartDateName,
    newConstraint9StopDateName,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.newConstraint9KinmuId = newConstraint9KinmuId;
        state.newConstraint9MemberId = newConstraint9MemberId;
        state.newConstraint9StartDateName = newConstraint9StartDateName;
        state.newConstraint9StopDateName = newConstraint9StopDateName;
      }),
    [
      newConstraint9KinmuId,
      newConstraint9MemberId,
      newConstraint9StartDateName,
      newConstraint9StopDateName,
      updateState,
    ]
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
  const handleChangeNewConstraint9IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint9IsEnabled = event.target.checked;
    });
  };
  const handleChangeNewConstraint9MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint9MemberId = parseInt(event.target.value, 10);
    });
  };
  const validate = (
    newConstraint9StartDateName: string,
    newConstraint9StopDateName: string
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint9StartDateName: [],
      newConstraint9StopDateName: [],
    };
    if (!utils.stringToDate(newConstraint9StartDateName))
      errorMessages.newConstraint9StartDateName.push(
        "開始日の形式が正しくありません"
      );
    if (!utils.stringToDate(newConstraint9StopDateName))
      errorMessages.newConstraint9StopDateName.push(
        "終了日の形式が正しくありません"
      );
    return errorMessages;
  };
  const handleChangeNewConstraint9StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint9StartDateName = event.target.value;
    });
  };
  const handleChangeNewConstraint9StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint9StopDateName = event.target.value;
    });
  };
  const handleChangeNewConstraint9KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint9KinmuId = parseInt(event.target.value, 10);
    });
  };
  const handleClickCreateConstraint9 = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      constraints9.add({
        is_enabled: state.newConstraint9IsEnabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint9KinmuId!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        member_id: state.newConstraint9MemberId!,
        start_date_name: state.newConstraint9StartDateName,
        stop_date_name: state.newConstraint9StopDateName,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          職員の期間に割り当てる勤務
        </Typography>
        <Button size="small" onClick={handleClickOpenCreationDialog}>
          追加
        </Button>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {constraints9InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint9 constraint9={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      {state.newConstraint9MemberId === undefined ||
      state.newConstraint9KinmuId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>職員の期間に割り当てる勤務を追加できません</DialogTitle>
          <DialogContent>
            {state.newConstraint9MemberId === undefined && (
              <DialogContentText>職員がいません</DialogContentText>
            )}
            {state.newConstraint9KinmuId === undefined && (
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
          const newConstraint9Member =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedMemberById[state.newConstraint9MemberId]!;
          const newConstraint9StartDate = utils.stringToDate(
            state.newConstraint9StartDateName
          );
          const termStartDate = utils.stringToDate(
            selectedTerm.start_date_name
          );
          const newConstraint9StartDateIsEnabled =
            !newConstraint9StartDate || !termStartDate
              ? false
              : termStartDate <= newConstraint9StartDate;
          const newConstraint9StopDate = utils.stringToDate(
            state.newConstraint9StopDateName
          );
          const termStopDate = utils.stringToDate(selectedTerm.stop_date_name);
          const newConstraint9StopDateIsEnabled =
            !newConstraint9StopDate || !termStopDate
              ? false
              : newConstraint9StopDate <= termStopDate;
          const newConstraint9Kinmu =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedKinmuById[state.newConstraint9KinmuId]!;
          const relativesAreEnabled =
            newConstraint9Member.is_enabled &&
            newConstraint9StartDateIsEnabled &&
            newConstraint9StopDateIsEnabled &&
            newConstraint9Kinmu.is_enabled;
          const errorMessages = validate(
            state.newConstraint9StartDateName,
            state.newConstraint9StopDateName
          );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>職員の期間に割り当てる勤務の追加</DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint9IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint9IsEnabled}
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
                      value={state.newConstraint9MemberId}
                      onChange={handleChangeNewConstraint9MemberId}
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
                      label="開始日"
                      type="date"
                      value={state.newConstraint9StartDateName}
                      onChange={handleChangeNewConstraint9StartDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint9StartDateIsEnabled &&
                            lineThroughSx),
                        },
                      }}
                      error={
                        errorMessages.newConstraint9StartDateName.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint9StartDateName.map(
                        (message) => (
                          <div key={message}>{message}</div>
                        )
                      )}
                    />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      label="終了日"
                      type="date"
                      value={state.newConstraint9StopDateName}
                      onChange={handleChangeNewConstraint9StopDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint9StopDateIsEnabled &&
                            lineThroughSx),
                        },
                      }}
                      error={
                        errorMessages.newConstraint9StopDateName.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint9StopDateName.map(
                        (message) => (
                          <div key={message}>{message}</div>
                        )
                      )}
                    />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label="勤務"
                      value={state.newConstraint9KinmuId}
                      onChange={handleChangeNewConstraint9KinmuId}
                      fullWidth={true}
                    >
                      {kinmusInTerm.map((kinmu) => (
                        <MenuItem key={kinmu.id} value={kinmu.id}>
                          <KinmuName kinmu={kinmu} />
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                </Grid>
              </DialogContent>
              <DialogActions>
                <Button
                  color="primary"
                  disabled={Object.values(errorMessages).some(
                    (messages) => messages.length > 0
                  )}
                  onClick={handleClickCreateConstraint9}
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

export default Constraints9;
