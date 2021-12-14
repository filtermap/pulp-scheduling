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
import Box from "@mui/material/Box";
import * as utils from "../utils";
import * as constraints1 from "../modules/constraints1";
import * as groups from "../modules/groups";
import * as kinmus from "../modules/kinmus";
import * as terms from "../modules/terms";
import { useAppSelector } from "../modules/hooks";
import Constraint1 from "./Constraint1";
import { lineThroughSx } from "./parts/lineThroughSx";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint1IsEnabled: boolean;
  newConstraint1StartDateName: string;
  newConstraint1StopDateName: string;
  newConstraint1KinmuId: number | undefined;
  newConstraint1GroupId: number | undefined;
  newConstraint1MinNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint1StartDateName: string[];
  newConstraint1StopDateName: string[];
  newConstraint1MinNumberOfAssignments: string[];
};

function Constraints1(): JSX.Element {
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints1 = useSelector(constraints1.selectors.selectAll);
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedTerm = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => terms.selectors.selectById(state, termId)!
  );
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const selectedGroupById = useSelector(groups.selectors.selectEntities);
  const constraints1InTerm = selectedConstraints1.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = React.useMemo(
    () => selectedKinmus.filter(({ term_id }) => term_id === termId),
    [selectedKinmus, termId]
  );
  const groupsInTerm = React.useMemo(
    () => selectedGroups.filter(({ term_id }) => term_id === termId),
    [selectedGroups, termId]
  );
  const todayString = utils.dateToString(new Date());
  const initialState = React.useMemo(
    () => ({
      creationDialogIsOpen: false,
      newConstraint1GroupId:
        groupsInTerm.length > 0 ? groupsInTerm[0].id : undefined,
      newConstraint1IsEnabled: true,
      newConstraint1KinmuId:
        kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined,
      newConstraint1MinNumberOfAssignments:
        constraints1.minOfConstraint1MinNumberOfAssignments,
      newConstraint1StartDateName: todayString,
      newConstraint1StopDateName: todayString,
    }),
    [groupsInTerm, kinmusInTerm, todayString]
  );
  const [state, setState] = React.useState<State>(initialState);
  React.useEffect(() => setState(initialState), [initialState]);
  const handleClickOpenCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: true }));
  };
  const handleCloseCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
  };
  const handleChangeNewConstraint1IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint1IsEnabled: event.target.checked,
    }));
  };
  const validate = (
    newConstraint1StartDateName: string,
    newConstraint1StopDateName: string,
    newConstraint1MinNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint1MinNumberOfAssignments: [],
      newConstraint1StartDateName: [],
      newConstraint1StopDateName: [],
    };
    if (!utils.stringToDate(newConstraint1StartDateName)) {
      errorMessages.newConstraint1StartDateName.push(
        "開始日の形式が正しくありません"
      );
    }
    if (!utils.stringToDate(newConstraint1StopDateName)) {
      errorMessages.newConstraint1StopDateName.push(
        "終了日の形式が正しくありません"
      );
    }
    if (isNaN(newConstraint1MinNumberOfAssignments)) {
      errorMessages.newConstraint1MinNumberOfAssignments.push(
        "割り当て職員数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeNewConstraint1StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint1StartDateName: event.target.value,
    }));
  };
  const handleChangeNewConstraint1StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint1StopDateName: event.target.value,
    }));
  };
  const handleChangeNewConstraint1KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint1KinmuId: parseInt(event.target.value, 10),
    }));
  };
  const handleChangeNewConstraint1GroupId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint1GroupId: parseInt(event.target.value, 10),
    }));
  };
  const handleChangeNewConstraint1MinNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint1MinNumberOfAssignments: parseInt(event.target.value, 10),
    }));
  };
  const handleClickCreateConstraint1 = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      constraints1.add({
        term_id: termId,
        is_enabled: state.newConstraint1IsEnabled,
        start_date_name: state.newConstraint1StartDateName,
        stop_date_name: state.newConstraint1StopDateName,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint1KinmuId!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        group_id: state.newConstraint1GroupId!,
        min_number_of_assignments: state.newConstraint1MinNumberOfAssignments,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          期間の勤務にグループから割り当てる職員数の下限
        </Typography>
        <Button size="small" onClick={handleClickOpenCreationDialog}>
          追加
        </Button>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {constraints1InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint1 constraint1={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      {state.newConstraint1KinmuId === undefined ||
      state.newConstraint1GroupId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            期間の勤務にグループから割り当てる職員数の下限を追加できません
          </DialogTitle>
          <DialogContent>
            {state.newConstraint1KinmuId === undefined && (
              <DialogContentText>勤務がありません</DialogContentText>
            )}
            {state.newConstraint1GroupId === undefined && (
              <DialogContentText>グループがありません</DialogContentText>
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
          const newConstraint1StartDate = utils.stringToDate(
            state.newConstraint1StartDateName
          );
          const termStartDate = utils.stringToDate(
            selectedTerm.start_date_name
          );
          const newConstraint1StartDateIsEnabled =
            !newConstraint1StartDate || !termStartDate
              ? false
              : termStartDate <= newConstraint1StartDate;
          const newConstraint1StopDate = utils.stringToDate(
            state.newConstraint1StopDateName
          );
          const termStopDate = utils.stringToDate(selectedTerm.stop_date_name);
          const newConstraint1StopDateIsEnabled =
            !newConstraint1StopDate || !termStopDate
              ? false
              : newConstraint1StopDate <= termStopDate;
          const newConstraint1Kinmu =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedKinmuById[state.newConstraint1KinmuId]!;
          const newConstraint1Group =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedGroupById[state.newConstraint1GroupId]!;
          const relativesAreEnabled =
            newConstraint1StartDateIsEnabled &&
            newConstraint1StopDateIsEnabled &&
            newConstraint1Kinmu.is_enabled &&
            newConstraint1Group.is_enabled;
          const errorMessages = validate(
            state.newConstraint1StartDateName,
            state.newConstraint1StopDateName,
            state.newConstraint1MinNumberOfAssignments
          );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>
                期間の勤務にグループから割り当てる職員数の下限の追加
              </DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint1IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint1IsEnabled}
                          color="primary"
                        />
                      }
                      label="有効"
                    />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      label="開始日"
                      type="date"
                      defaultValue={state.newConstraint1StartDateName}
                      onChange={handleChangeNewConstraint1StartDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint1StartDateIsEnabled &&
                            lineThroughSx),
                        },
                      }}
                      error={
                        errorMessages.newConstraint1StartDateName.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint1StartDateName.map(
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
                      defaultValue={state.newConstraint1StopDateName}
                      onChange={handleChangeNewConstraint1StopDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint1StopDateIsEnabled &&
                            lineThroughSx),
                        },
                      }}
                      error={
                        errorMessages.newConstraint1StopDateName.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint1StopDateName.map(
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
                      value={state.newConstraint1KinmuId}
                      onChange={handleChangeNewConstraint1KinmuId}
                      fullWidth={true}
                    >
                      {kinmusInTerm.map((kinmu) => (
                        <MenuItem key={kinmu.id} value={kinmu.id}>
                          <Box
                            component="span"
                            sx={{ ...(!kinmu.is_enabled && lineThroughSx) }}
                          >
                            {kinmu.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label="グループ"
                      value={state.newConstraint1GroupId}
                      onChange={handleChangeNewConstraint1GroupId}
                      fullWidth={true}
                    >
                      {groupsInTerm.map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                          <Box
                            component="span"
                            sx={{ ...(!group.is_enabled && lineThroughSx) }}
                          >
                            {group.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      label="割り当て職員数下限"
                      type="number"
                      defaultValue={state.newConstraint1MinNumberOfAssignments}
                      onChange={
                        handleChangeNewConstraint1MinNumberOfAssignments
                      }
                      fullWidth={true}
                      inputProps={{
                        min: constraints1.minOfConstraint1MinNumberOfAssignments,
                      }}
                      error={
                        errorMessages.newConstraint1MinNumberOfAssignments
                          .length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint1MinNumberOfAssignments.map(
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
                  onClick={handleClickCreateConstraint1}
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
}

export default Constraints1;
