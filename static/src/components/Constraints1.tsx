import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
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
import classnames from "classnames";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as constraints1 from "../modules/constraints1";
import { RootState } from "../modules/store";
import * as utils from "../utils";
import Constraint1 from "./Constraint1";

const PREFIX = "Constraints1";

const classes = {
  gridFrame: `${PREFIX}-gridFrame`,
  lineThrough: `${PREFIX}-lineThrough`,
  toolbarTitle: `${PREFIX}-toolbarTitle`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")({
  [`& .${classes.gridFrame}`]: {
    padding: 8,
  },
  [`& .${classes.lineThrough}`]: {
    "&::-webkit-datetime-edit-fields-wrapper": {
      textDecoration: "line-through",
    },
    textDecoration: "line-through",
  },
  [`& .${classes.toolbarTitle}`]: {
    flex: 1,
  },
});

type State = {
  creationDialogIsOpen: boolean;
  newConstraint1IsEnabled: boolean;
  newConstraint1StartDateName: string;
  newConstraint1StopDateName: string;
  newConstraint1KinmuId: number;
  newConstraint1GroupId: number;
  newConstraint1MinNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint1StartDateName: string[];
  newConstraint1StopDateName: string[];
  newConstraint1MinNumberOfAssignments: string[];
};

function select(state: RootState) {
  return {
    constraints1: state.present.constraints1,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
    terms: state.present.terms,
  };
}

function Constraints1(): JSX.Element {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const termsInTerm = selected.terms.filter(({ id }) => id === termId);
  const constraints1InTerm = selected.constraints1.filter(
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
    newConstraint1GroupId: groupsInTerm.length > 0 ? groupsInTerm[0].id : 0,
    newConstraint1IsEnabled: true,
    newConstraint1KinmuId: kinmusInTerm.length > 0 ? kinmusInTerm[0].id : 0,
    newConstraint1MinNumberOfAssignments:
      constraints1.minOfConstraint1MinNumberOfAssignments,
    newConstraint1StartDateName: todayString,
    newConstraint1StopDateName: todayString,
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
      constraints1.createConstraint1({
        term_id: termId,
        is_enabled: state.newConstraint1IsEnabled,
        start_date_name: state.newConstraint1StartDateName,
        stop_date_name: state.newConstraint1StopDateName,
        kinmu_id: state.newConstraint1KinmuId,
        group_id: state.newConstraint1GroupId,
        min_number_of_assignments: state.newConstraint1MinNumberOfAssignments,
      })
    );
  };
  return (
    <Root>
      <div className={classes.gridFrame}>
        <Grid container={true} spacing={1}>
          <Grid item={true} xs={12}>
            <Toolbar>
              <Typography variant="subtitle1" className={classes.toolbarTitle}>
                期間の勤務にグループから割り当てる職員数の下限
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {constraints1InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint1 constraint1={c} />
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
            期間の勤務にグループから割り当てる職員数の下限を追加できません
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
          const newConstraint1StartDate = utils.stringToDate(
            state.newConstraint1StartDateName
          );
          const newConstraint1StartDateIsEnabled = newConstraint1StartDate
            ? termsInTerm.every(({ start_date_name }) => {
                const startDate = utils.stringToDate(start_date_name);
                if (!startDate) {
                  return false;
                }
                return startDate <= newConstraint1StartDate;
              })
            : false;
          const newConstraint1StopDate = utils.stringToDate(
            state.newConstraint1StopDateName
          );
          const newConstraint1StopDateIsEnabled = newConstraint1StopDate
            ? termsInTerm.every(({ stop_date_name }) => {
                const stopDate = utils.stringToDate(stop_date_name);
                if (!stopDate) {
                  return false;
                }
                return stopDate >= newConstraint1StopDate;
              })
            : false;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newConstraint1Kinmu = kinmusInTerm.find(
            ({ id }) => id === state.newConstraint1KinmuId
          )!;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newConstraint1Group = groupsInTerm.find(
            ({ id }) => id === state.newConstraint1GroupId
          )!;
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
                        className: classnames({
                          [classes.lineThrough]:
                            !newConstraint1StartDateIsEnabled,
                        }),
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
                        className: classnames({
                          [classes.lineThrough]:
                            !newConstraint1StopDateIsEnabled,
                        }),
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
                          {
                            <span
                              className={classnames({
                                [classes.lineThrough]: !kinmu.is_enabled,
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
                      value={state.newConstraint1GroupId}
                      onChange={handleChangeNewConstraint1GroupId}
                      fullWidth={true}
                    >
                      {groupsInTerm.map((group) => (
                        <MenuItem key={group.id} value={group.id}>
                          {
                            <span
                              className={classnames({
                                [classes.lineThrough]: !group.is_enabled,
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
    </Root>
  );
}

export default Constraints1;
