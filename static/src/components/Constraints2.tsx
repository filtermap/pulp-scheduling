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
import * as constraints2 from "../modules/constraints2";
import * as groups from "../modules/groups";
import * as kinmus from "../modules/kinmus";
import * as terms from "../modules/terms";
import { useAppSelector } from "../modules/hooks";
import Constraint2 from "./Constraint2";
import { lineThroughSx } from "./parts/lineThroughSx";
import GridFrame from "./parts/GridFrame";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint2IsEnabled: boolean;
  newConstraint2StartDateName: string;
  newConstraint2StopDateName: string;
  newConstraint2KinmuId: number | undefined;
  newConstraint2GroupId: number | undefined;
  newConstraint2MaxNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint2StartDateName: string[];
  newConstraint2StopDateName: string[];
  newConstraint2MaxNumberOfAssignments: string[];
};

function Constraints2(): JSX.Element {
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints2 = useSelector(constraints2.selectors.selectAll);
  const selectedGroups = useSelector(groups.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedTerm = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => terms.selectors.selectById(state, termId)!
  );
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const selectedGroupById = useSelector(groups.selectors.selectEntities);
  const constraints2InTerm = React.useMemo(
    () => selectedConstraints2.filter(({ term_id }) => term_id === termId),
    [selectedConstraints2, termId]
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const groupsInTerm = selectedGroups.filter(
    ({ term_id }) => term_id === termId
  );
  const todayString = utils.dateToString(new Date());
  const initialState = React.useMemo(
    () => ({
      creationDialogIsOpen: false,
      newConstraint2GroupId:
        groupsInTerm.length > 0 ? groupsInTerm[0].id : undefined,
      newConstraint2IsEnabled: true,
      newConstraint2KinmuId:
        kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined,
      newConstraint2MaxNumberOfAssignments:
        constraints2.minOfConstraint2MaxNumberOfAssignments,
      newConstraint2StartDateName: todayString,
      newConstraint2StopDateName: todayString,
    }),
    [groupsInTerm, kinmusInTerm, todayString]
  );
  const [state, setState] = React.useState<State>(initialState);
  // React.useEffect(() => setState(initialState), [initialState]);
  const handleClickOpenCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: true }));
  };
  const handleCloseCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
  };
  const validate = (
    newConstraint2StartDateName: string,
    newConstraint2StopDateName: string,
    newConstraint2MaxNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint2MaxNumberOfAssignments: [],
      newConstraint2StartDateName: [],
      newConstraint2StopDateName: [],
    };
    if (!utils.stringToDate(newConstraint2StartDateName)) {
      errorMessages.newConstraint2StartDateName.push(
        "開始日の形式が正しくありません"
      );
    }
    if (!utils.stringToDate(newConstraint2StopDateName)) {
      errorMessages.newConstraint2StopDateName.push(
        "終了日の形式が正しくありません"
      );
    }
    if (isNaN(newConstraint2MaxNumberOfAssignments)) {
      errorMessages.newConstraint2MaxNumberOfAssignments.push(
        "割り当て職員数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeNewConstraint2IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint2IsEnabled: event.target.checked,
    }));
  };
  const handleChangeNewConstraint2StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint2StartDateName: event.target.value,
    }));
  };
  const handleChangeNewConstraint2StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint2StopDateName: event.target.value,
    }));
  };
  const handleChangeNewConstraint2KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint2KinmuId: parseInt(event.target.value, 10),
    }));
  };
  const handleChangeNewConstraint2GroupId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint2GroupId: parseInt(event.target.value, 10),
    }));
  };
  const handleChangeNewConstraint2MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint2MaxNumberOfAssignments: parseInt(event.target.value, 10),
    }));
  };
  const handleClickCreateConstraint2 = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      constraints2.add({
        term_id: termId,
        is_enabled: state.newConstraint2IsEnabled,
        start_date_name: state.newConstraint2StartDateName,
        stop_date_name: state.newConstraint2StopDateName,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint2KinmuId!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        group_id: state.newConstraint2GroupId!,
        max_number_of_assignments: state.newConstraint2MaxNumberOfAssignments,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          期間の勤務にグループから割り当てる職員数の上限
        </Typography>
        <Button size="small" onClick={handleClickOpenCreationDialog}>
          追加
        </Button>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {constraints2InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint2 constraint2={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      {state.newConstraint2KinmuId === undefined ||
      state.newConstraint2GroupId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            期間の勤務にグループから割り当てる職員数の上限を追加できません
          </DialogTitle>
          <DialogContent>
            {state.newConstraint2KinmuId === undefined && (
              <DialogContentText>勤務がありません</DialogContentText>
            )}
            {state.newConstraint2GroupId === undefined && (
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
          const newConstraint2StartDate = utils.stringToDate(
            state.newConstraint2StartDateName
          );
          const termStartDate = utils.stringToDate(
            selectedTerm.start_date_name
          );
          const newConstraint2StartDateIsEnabled =
            !newConstraint2StartDate || !termStartDate
              ? false
              : termStartDate <= newConstraint2StartDate;
          const newConstraint2StopDate = utils.stringToDate(
            state.newConstraint2StopDateName
          );
          const termStopDate = utils.stringToDate(selectedTerm.stop_date_name);
          const newConstraint2StopDateIsEnabled =
            !newConstraint2StopDate || !termStopDate
              ? false
              : newConstraint2StopDate <= termStopDate;
          const newConstraint2Kinmu =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedKinmuById[state.newConstraint2KinmuId]!;
          const newConstraint2Group =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedGroupById[state.newConstraint2GroupId]!;
          const relativesAreEnabled =
            newConstraint2StartDateIsEnabled &&
            newConstraint2StopDateIsEnabled &&
            newConstraint2Kinmu.is_enabled &&
            newConstraint2Group.is_enabled;
          const errorMessages = validate(
            state.newConstraint2StartDateName,
            state.newConstraint2StopDateName,
            state.newConstraint2MaxNumberOfAssignments
          );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>
                期間の勤務にグループから割り当てる職員数の上限の追加
              </DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint2IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint2IsEnabled}
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
                      defaultValue={state.newConstraint2StartDateName}
                      onChange={handleChangeNewConstraint2StartDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint2StartDateIsEnabled &&
                            lineThroughSx),
                        },
                      }}
                      error={
                        errorMessages.newConstraint2StartDateName.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint2StartDateName.map(
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
                      defaultValue={state.newConstraint2StopDateName}
                      onChange={handleChangeNewConstraint2StopDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        sx: {
                          ...(!newConstraint2StopDateIsEnabled &&
                            lineThroughSx),
                        },
                      }}
                      error={
                        errorMessages.newConstraint2StopDateName.length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint2StopDateName.map(
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
                      value={state.newConstraint2KinmuId}
                      onChange={handleChangeNewConstraint2KinmuId}
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
                      value={state.newConstraint2GroupId}
                      onChange={handleChangeNewConstraint2GroupId}
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
                      label="割り当て職員数上限"
                      type="number"
                      defaultValue={state.newConstraint2MaxNumberOfAssignments}
                      onChange={
                        handleChangeNewConstraint2MaxNumberOfAssignments
                      }
                      fullWidth={true}
                      inputProps={{
                        min: constraints2.minOfConstraint2MaxNumberOfAssignments,
                      }}
                      error={
                        errorMessages.newConstraint2MaxNumberOfAssignments
                          .length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint2MaxNumberOfAssignments.map(
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
                  onClick={handleClickCreateConstraint2}
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

export default Constraints2;
