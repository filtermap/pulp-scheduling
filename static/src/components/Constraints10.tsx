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
import * as constraints10 from "../modules/constraints10";
import { RootState } from "../modules/store";
import * as utils from "../utils";
import Constraint10 from "./Constraint10";

type Props = WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint10IsEnabled: boolean;
  newConstraint10MemberId: number;
  newConstraint10StartDateName: string;
  newConstraint10StopDateName: string;
  newConstraint10KinmuId: number;
};

type ErrorMessages = {
  newConstraint10StartDateName: string[];
  newConstraint10StopDateName: string[];
};

function select(state: RootState) {
  return {
    constraints10: state.present.constraints10,
    kinmus: state.present.kinmus,
    members: state.present.members,
    terms: state.present.terms,
  };
}

function Constraints10(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const constraints10InTerm = selected.constraints10.filter(
    ({ term_id }) => term_id === termId
  );
  const membersInTerm = selected.members.filter(
    ({ term_id }) => term_id === termId
  );
  const termsInTerm = selected.terms.filter(({ id }) => id === termId);
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const todayString = utils.dateToString(new Date());
  const initialState = {
    creationDialogIsOpen: false,
    newConstraint10IsEnabled: true,
    newConstraint10KinmuId: kinmusInTerm.length > 0 ? kinmusInTerm[0].id : 0,
    newConstraint10MemberId: membersInTerm.length > 0 ? membersInTerm[0].id : 0,
    newConstraint10StartDateName: todayString,
    newConstraint10StopDateName: todayString,
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
  const handleChangeNewConstraint10IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setState((state) => ({ ...state, newConstraint10IsEnabled: checked }));
  };
  const handleChangeNewConstraint10MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint10MemberId: parseInt(event.target.value, 10),
    }));
  };
  const validate = (
    newConstraint10StartDateName: string,
    newConstraint10StopDateName: string
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint10StartDateName: [],
      newConstraint10StopDateName: [],
    };
    if (!utils.stringToDate(newConstraint10StartDateName)) {
      errorMessages.newConstraint10StartDateName.push(
        "開始日の形式が正しくありません"
      );
    }
    if (!utils.stringToDate(newConstraint10StopDateName)) {
      errorMessages.newConstraint10StopDateName.push(
        "終了日の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeNewConstraint10StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint10StartDateName: event.target.value,
    }));
  };
  const handleChangeNewConstraint10StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint10StopDateName: event.target.value,
    }));
  };
  const handleChangeNewConstraint10KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint10KinmuId: parseInt(event.target.value, 10),
    }));
  };
  const handleClickCreateConstraint10 = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      constraints10.createConstraint10({
        term_id: termId,
        is_enabled: state.newConstraint10IsEnabled,
        member_id: state.newConstraint10MemberId,
        start_date_name: state.newConstraint10StartDateName,
        stop_date_name: state.newConstraint10StopDateName,
        kinmu_id: state.newConstraint10KinmuId,
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
                職員の期間に割り当てない勤務
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {constraints10InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint10 constraint10={c} />
            </Grid>
          ))}
        </Grid>
      </div>
      {membersInTerm.length === 0 || kinmusInTerm.length === 0 ? (
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
            {membersInTerm.length === 0 ? (
              <DialogContentText>職員がいません</DialogContentText>
            ) : null}
            {kinmusInTerm.length === 0 ? (
              <DialogContentText>勤務がありません</DialogContentText>
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
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newConstraint10Member = membersInTerm.find(
            ({ id }) => id === state.newConstraint10MemberId
          )!;
          const newConstraint10StartDate = utils.stringToDate(
            state.newConstraint10StartDateName
          );
          const newConstraint10StartDateIsEnabled = newConstraint10StartDate
            ? termsInTerm.every(({ start_date_name }) => {
                const startDate = utils.stringToDate(start_date_name);
                if (!startDate) {
                  return false;
                }
                return startDate <= newConstraint10StartDate;
              })
            : false;
          const newConstraint10StopDate = utils.stringToDate(
            state.newConstraint10StopDateName
          );
          const newConstraint10StopDateIsEnabled = newConstraint10StopDate
            ? termsInTerm.every(({ stop_date_name }) => {
                const stopDate = utils.stringToDate(stop_date_name);
                if (!stopDate) {
                  return false;
                }
                return stopDate >= newConstraint10StopDate;
              })
            : false;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newConstraint10Kinmu = kinmusInTerm.find(
            ({ id }) => id === state.newConstraint10KinmuId
          )!;
          const relativesAreEnabled =
            newConstraint10Member.is_enabled &&
            newConstraint10StartDateIsEnabled &&
            newConstraint10StopDateIsEnabled &&
            newConstraint10Kinmu.is_enabled;
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
                          {
                            <span
                              className={classnames({
                                [props.classes.lineThrough]: !member.is_enabled,
                              })}
                            >
                              {member.name}
                            </span>
                          }
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      label="開始日"
                      type="date"
                      defaultValue={state.newConstraint10StartDateName}
                      onChange={handleChangeNewConstraint10StartDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        className: classnames({
                          [props.classes.lineThrough]:
                            !newConstraint10StartDateIsEnabled,
                        }),
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
                      defaultValue={state.newConstraint10StopDateName}
                      onChange={handleChangeNewConstraint10StopDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        className: classnames({
                          [props.classes.lineThrough]:
                            !newConstraint10StopDateIsEnabled,
                        }),
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

export default withStyles(styles)(Constraints10);
