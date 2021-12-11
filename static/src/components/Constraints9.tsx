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
import * as constraints9 from "../modules/constraints9";
import { RootState } from "../modules/store";
import * as utils from "../utils";
import Constraint9 from "./Constraint9";

type Props = WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newConstraint9IsEnabled: boolean;
  newConstraint9MemberId: number;
  newConstraint9StartDateName: string;
  newConstraint9StopDateName: string;
  newConstraint9KinmuId: number;
};

type ErrorMessages = {
  newConstraint9StartDateName: string[];
  newConstraint9StopDateName: string[];
};

function select(state: RootState) {
  return {
    constraints9: state.present.constraints9,
    kinmus: state.present.kinmus,
    members: state.present.members,
    terms: state.present.terms,
  };
}

function Constraints9(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const constraints9InTerm = selected.constraints9.filter(
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
    newConstraint9IsEnabled: true,
    newConstraint9KinmuId: kinmusInTerm.length > 0 ? kinmusInTerm[0].id : 0,
    newConstraint9MemberId: membersInTerm.length > 0 ? membersInTerm[0].id : 0,
    newConstraint9StartDateName: todayString,
    newConstraint9StopDateName: todayString,
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
  const handleChangeNewConstraint9IsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    setState((state) => ({ ...state, newConstraint9IsEnabled: checked }));
  };
  const handleChangeNewConstraint9MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint9MemberId: parseInt(event.target.value, 10),
    }));
  };
  const validate = (
    newConstraint9StartDateName: string,
    newConstraint9StopDateName: string
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint9StartDateName: [],
      newConstraint9StopDateName: [],
    };
    if (!utils.stringToDate(newConstraint9StartDateName)) {
      errorMessages.newConstraint9StartDateName.push(
        "開始日の形式が正しくありません"
      );
    }
    if (!utils.stringToDate(newConstraint9StopDateName)) {
      errorMessages.newConstraint9StopDateName.push(
        "終了日の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeNewConstraint9StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint9StartDateName: event.target.value,
    }));
  };
  const handleChangeNewConstraint9StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint9StopDateName: event.target.value,
    }));
  };
  const handleChangeNewConstraint9KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint9KinmuId: parseInt(event.target.value, 10),
    }));
  };
  const handleClickCreateConstraint9 = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      constraints9.createConstraint9({
        term_id: termId,
        is_enabled: state.newConstraint9IsEnabled,
        member_id: state.newConstraint9MemberId,
        start_date_name: state.newConstraint9StartDateName,
        stop_date_name: state.newConstraint9StopDateName,
        kinmu_id: state.newConstraint9KinmuId,
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
                職員の期間に割り当てる勤務
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {constraints9InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint9 constraint9={c} />
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
          <DialogTitle>職員の期間に割り当てる勤務を追加できません</DialogTitle>
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
          const newConstraint9Member = membersInTerm.find(
            ({ id }) => id === state.newConstraint9MemberId
          )!;
          const newConstraint9StartDate = utils.stringToDate(
            state.newConstraint9StartDateName
          );
          const newConstraint9StartDateIsEnabled = newConstraint9StartDate
            ? termsInTerm.every(({ start_date_name }) => {
                const startDate = utils.stringToDate(start_date_name);
                if (!startDate) {
                  return false;
                }
                return startDate <= newConstraint9StartDate;
              })
            : false;
          const newConstraint9StopDate = utils.stringToDate(
            state.newConstraint9StopDateName
          );
          const newConstraint9StopDateIsEnabled = newConstraint9StopDate
            ? termsInTerm.every(({ stop_date_name }) => {
                const stopDate = utils.stringToDate(stop_date_name);
                if (!stopDate) {
                  return false;
                }
                return stopDate >= newConstraint9StopDate;
              })
            : false;
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          const newConstraint9Kinmu = kinmusInTerm.find(
            ({ id }) => id === state.newConstraint9KinmuId
          )!;
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
                      defaultValue={state.newConstraint9StartDateName}
                      onChange={handleChangeNewConstraint9StartDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        className: classnames({
                          [props.classes.lineThrough]:
                            !newConstraint9StartDateIsEnabled,
                        }),
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
                      defaultValue={state.newConstraint9StopDateName}
                      onChange={handleChangeNewConstraint9StopDateName}
                      fullWidth={true}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{
                        className: classnames({
                          [props.classes.lineThrough]:
                            !newConstraint9StopDateIsEnabled,
                        }),
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

export default withStyles(styles)(Constraints9);
