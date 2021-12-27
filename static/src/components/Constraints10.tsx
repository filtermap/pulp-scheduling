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

import * as constraints10 from "../modules/constraints10";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import Constraint10 from "./Constraint10";
import KinmuName from "./names/KinmuName";
import MemberName from "./names/MemberName";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";
import lineThroughSx from "./parts/lineThroughSx";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint10IsEnabled: boolean;
  newConstraint10MemberId: number | undefined;
  newConstraint10StartDateName: string | undefined;
  newConstraint10StopDateName: string | undefined;
  newConstraint10KinmuId: number | undefined;
};

type ErrorMessages = {
  newConstraint10StartDateName: string[];
  newConstraint10StopDateName: string[];
};

// eslint-disable-next-line react/display-name
const Constraints10 = React.memo((): JSX.Element => {
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints10 = useSelector(constraints10.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedTerm = useAppSelector((state) =>
    terms.selectors.selectById(state, termId)
  );
  const selectedMemberById = useSelector(members.selectors.selectEntities);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const constraints10InTerm = selectedConstraints10.filter(
    ({ term_id }) => term_id === termId
  );
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const newConstraint10KinmuId =
    kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined;
  const newConstraint10MemberId =
    membersInTerm.length > 0 ? membersInTerm[0].id : undefined;
  const newConstraint10StartDateName = selectedTerm?.start_date_name;
  const newConstraint10StopDateName = selectedTerm?.stop_date_name;
  const [state, updateState] = useImmer<State>({
    creationDialogIsOpen: false,
    newConstraint10IsEnabled: true,
    newConstraint10KinmuId,
    newConstraint10MemberId,
    newConstraint10StartDateName,
    newConstraint10StopDateName,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.newConstraint10KinmuId = newConstraint10KinmuId;
        state.newConstraint10MemberId = newConstraint10MemberId;
        state.newConstraint10StartDateName = newConstraint10StartDateName;
        state.newConstraint10StopDateName = newConstraint10StopDateName;
      }),
    [
      newConstraint10KinmuId,
      newConstraint10MemberId,
      newConstraint10StartDateName,
      newConstraint10StopDateName,
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
  const handleChangeNewConstraint10IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint10IsEnabled = event.target.checked;
    });
  };
  const handleChangeNewConstraint10MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint10MemberId = parseInt(event.target.value, 10);
    });
  };
  const validate = (
    newConstraint10StartDateName: string | undefined,
    newConstraint10StopDateName: string | undefined
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint10StartDateName: [],
      newConstraint10StopDateName: [],
    };
    const newConstraint10StartDate =
      newConstraint10StartDateName &&
      utils.stringToDate(newConstraint10StartDateName);
    const newConstraint10StopDate =
      newConstraint10StopDateName &&
      utils.stringToDate(newConstraint10StopDateName);
    if (!newConstraint10StartDate)
      errorMessages.newConstraint10StartDateName.push(
        "開始日の形式が正しくありません"
      );
    if (!newConstraint10StopDate)
      errorMessages.newConstraint10StopDateName.push(
        "終了日の形式が正しくありません"
      );
    if (
      newConstraint10StartDate &&
      newConstraint10StopDate &&
      newConstraint10StartDate > newConstraint10StopDate
    ) {
      errorMessages.newConstraint10StartDateName.push(
        "開始日には終了日より過去の日付を入力してください"
      );
      errorMessages.newConstraint10StopDateName.push(
        "終了日には開始日より未来の日付を入力してください"
      );
    }
    return errorMessages;
  };
  const handleChangeNewConstraint10StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint10StartDateName = event.target.value;
    });
  };
  const handleChangeNewConstraint10StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint10StopDateName = event.target.value;
    });
  };
  const handleChangeNewConstraint10KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.newConstraint10KinmuId = parseInt(event.target.value, 10);
    });
  };
  const handleClickCreateConstraint10 = () => {
    updateState((state) => {
      state.creationDialogIsOpen = false;
    });
    dispatch(
      constraints10.add({
        is_enabled: state.newConstraint10IsEnabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint10KinmuId!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        member_id: state.newConstraint10MemberId!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        start_date_name: state.newConstraint10StartDateName!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        stop_date_name: state.newConstraint10StopDateName!,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          職員の期間に割り当てない勤務
        </Typography>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {constraints10InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint10 constraint10={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      <FloatingAddButton onClick={handleClickOpenCreationDialog} />
      {state.newConstraint10MemberId === undefined ||
      state.newConstraint10KinmuId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            職員の期間に割り当てない勤務を追加できません
          </DialogTitle>
          <DialogContent>
            {state.newConstraint10MemberId === undefined && (
              <DialogContentText>職員がいません</DialogContentText>
            )}
            {state.newConstraint10KinmuId === undefined && (
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
          const newConstraint10Member =
            selectedMemberById[state.newConstraint10MemberId];
          const newConstraint10StartDate =
            state.newConstraint10StartDateName &&
            utils.stringToDate(state.newConstraint10StartDateName);
          const termStartDate =
            selectedTerm && utils.stringToDate(selectedTerm.start_date_name);
          const newConstraint10StartDateIsEnabled =
            !newConstraint10StartDate || !termStartDate
              ? false
              : termStartDate <= newConstraint10StartDate;
          const newConstraint10StopDate =
            state.newConstraint10StopDateName &&
            utils.stringToDate(state.newConstraint10StopDateName);
          const termStopDate =
            selectedTerm && utils.stringToDate(selectedTerm.stop_date_name);
          const newConstraint10StopDateIsEnabled =
            !newConstraint10StopDate || !termStopDate
              ? false
              : newConstraint10StopDate <= termStopDate;
          const newConstraint10StartDateAndStopDateAreEnabled =
            (newConstraint10StartDate &&
              newConstraint10StopDate &&
              newConstraint10StartDate <= newConstraint10StopDate) ||
            false;
          const newConstraint10Kinmu =
            selectedKinmuById[state.newConstraint10KinmuId];
          const relativesAreEnabled =
            newConstraint10Member?.is_enabled &&
            newConstraint10StartDateIsEnabled &&
            newConstraint10StopDateIsEnabled &&
            newConstraint10StartDateAndStopDateAreEnabled &&
            newConstraint10Kinmu?.is_enabled;
          const errorMessages = validate(
            state.newConstraint10StartDateName,
            state.newConstraint10StopDateName
          );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>職員の期間に割り当てない勤務の追加</DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint10IsEnabled &&
                            relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint10IsEnabled}
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
                      value={state.newConstraint10MemberId}
                      onChange={handleChangeNewConstraint10MemberId}
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
                      value={state.newConstraint10StartDateName}
                      onChange={handleChangeNewConstraint10StartDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint10StartDateIsEnabled &&
                            lineThroughSx),
                        },
                      }}
                      error={
                        errorMessages.newConstraint10StartDateName.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint10StartDateName.map(
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
                      value={state.newConstraint10StopDateName}
                      onChange={handleChangeNewConstraint10StopDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint10StopDateIsEnabled &&
                            lineThroughSx),
                        },
                      }}
                      error={
                        errorMessages.newConstraint10StopDateName.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint10StopDateName.map(
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
                      value={state.newConstraint10KinmuId}
                      onChange={handleChangeNewConstraint10KinmuId}
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
                  onClick={handleClickCreateConstraint10}
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

export default Constraints10;
