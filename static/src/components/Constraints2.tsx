import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import classnames from "classnames";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as constraints2 from "../modules/constraints2";
import { RootState } from "../modules/store";
import * as utils from "../utils";
import Constraint2 from "./Constraint2";

type Props = WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint2IsEnabled: boolean;
  newConstraint2StartDateName: string;
  newConstraint2StopDateName: string;
  newConstraint2KinmuId: number;
  newConstraint2GroupId: number;
  newConstraint2MaxNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint2StartDateName: string[];
  newConstraint2StopDateName: string[];
  newConstraint2MaxNumberOfAssignments: string[];
};

function select(state: RootState) {
  return {
    constraints2: state.present.constraints2,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
    terms: state.present.terms,
  };
}

function Constraints2(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const termsInTerm = selected.terms.filter(({ id }) => id === termId);
  const constraints2InTerm = selected.constraints2.filter(
    ({ term_id }) => term_id === termId
  );
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const groupsInTerm = selected.groups.filter(
    ({ term_id }) => term_id === termId
  );
  const todayString = utils.dateToString(new Date());
  const initialState = {
    creationDialogIsOpen: false,
    newConstraint2GroupId: groupsInTerm.length > 0 ? groupsInTerm[0].id : 0,
    newConstraint2IsEnabled: true,
    newConstraint2KinmuId: kinmusInTerm.length > 0 ? kinmusInTerm[0].id : 0,
    newConstraint2MaxNumberOfAssignments:
      constraints2.minOfConstraint2MaxNumberOfAssignments,
    newConstraint2StartDateName: todayString,
    newConstraint2StopDateName: todayString,
  };
  const [state, setState] = React.useState<State>(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setState(initialState), [termId]);
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
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setState((state) => ({ ...state, newConstraint2IsEnabled: checked }));
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
      constraints2.createConstraint2({
        term_id: termId,
        is_enabled: state.newConstraint2IsEnabled,
        start_date_name: state.newConstraint2StartDateName,
        stop_date_name: state.newConstraint2StopDateName,
        kinmu_id: state.newConstraint2KinmuId,
        group_id: state.newConstraint2GroupId,
        max_number_of_assignments: state.newConstraint2MaxNumberOfAssignments,
      })
    );
  };
  return (
    <>
      <div className={props.classes.gridFrame}>
        <Grid container={true} spacing={1}>
          <Grid item={true} xs={12}>
            <Toolbar>
              <Typography
                variant="subtitle1"
                className={props.classes.toolbarTitle}
              >
                期間の勤務にグループから割り当てる職員数の上限
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {constraints2InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint2 constraint2={c} />
            </Grid>
          ))}
        </Grid>
      </div>
      {kinmusInTerm.length === 0 || groupsInTerm.length === 0 ? (
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
            {kinmusInTerm.length === 0 ? (
              <DialogContentText>勤務がありません</DialogContentText>
            ) : null}
            {groupsInTerm.length === 0 ? (
              <DialogContentText>グループがありません</DialogContentText>
            ) : null}
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
          const newConstraint2StartDateIsEnabled = newConstraint2StartDate
            ? termsInTerm.every(({ start_date_name }) => {
                const startDate = utils.stringToDate(start_date_name);
                if (!startDate) {
                  return false;
                }
                return startDate <= newConstraint2StartDate;
              })
            : false;
          const newConstraint2StopDate = utils.stringToDate(
            state.newConstraint2StopDateName
          );
          const newConstraint2StopDateIsEnabled = newConstraint2StopDate
            ? termsInTerm.every(({ stop_date_name }) => {
                const stopDate = utils.stringToDate(stop_date_name);
                if (!stopDate) {
                  return false;
                }
                return stopDate >= newConstraint2StopDate;
              })
            : false;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newConstraint2Kinmu = kinmusInTerm.find(
            ({ id }) => id === state.newConstraint2KinmuId
          )!;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newConstraint2Group = groupsInTerm.find(
            ({ id }) => id === state.newConstraint2GroupId
          )!;
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
                        className: classnames({
                          [props.classes.lineThrough]:
                            !newConstraint2StartDateIsEnabled,
                        }),
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
                        className: classnames({
                          [props.classes.lineThrough]:
                            !newConstraint2StopDateIsEnabled,
                        }),
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
                          {
                            <span
                              className={classnames({
                                [props.classes.lineThrough]: !kinmu.is_enabled,
                              })}
                            >
                              {kinmu.name}
                            </span>
                          }
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
                          {
                            <span
                              className={classnames({
                                [props.classes.lineThrough]: !group.is_enabled,
                              })}
                            >
                              {group.name}
                            </span>
                          }
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

const styles = createStyles({
  gridFrame: {
    padding: 8,
  },
  lineThrough: {
    "&::-webkit-datetime-edit-fields-wrapper": {
      textDecoration: "line-through",
    },
    textDecoration: "line-through",
  },
  toolbarTitle: {
    flex: 1,
  },
});

export default withStyles(styles)(Constraints2);
