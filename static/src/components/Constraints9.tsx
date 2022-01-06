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

import { useHashFragment } from "../hooks/useHashFragment";
import { usePosition } from "../hooks/usePosition";
import { m } from "../messages";
import * as constraints9 from "../modules/constraints9";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import Constraint9 from "./Constraint9";
import KinmuName from "./names/KinmuName";
import MemberName from "./names/MemberName";
import FloatingAddButton from "./parts/FloatingAddButton";
import GridFrame from "./parts/GridFrame";
import lineThroughSx from "./parts/lineThroughSx";

type State = {
  creationDialogIsOpen: boolean;
  newConstraint9IsEnabled: boolean;
  newConstraint9MemberId: number | undefined;
  newConstraint9StartDateName: string | undefined;
  newConstraint9StopDateName: string | undefined;
  newConstraint9KinmuId: number | undefined;
};

type ErrorMessages = {
  newConstraint9StartDateName: string[];
  newConstraint9StopDateName: string[];
};

// eslint-disable-next-line react/display-name
const Constraints9 = React.memo((): JSX.Element => {
  const [position, ref] = usePosition();
  useHashFragment(position?.top);
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints9 = useSelector(constraints9.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedMemberById = useSelector(members.selectors.selectEntities);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const selectedTerm = useAppSelector((state) =>
    terms.selectors.selectById(state, termId)
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
  const newConstraint9StartDateName = selectedTerm?.start_date_name;
  const newConstraint9StopDateName = selectedTerm?.stop_date_name;
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
    newConstraint9StartDateName: string | undefined,
    newConstraint9StopDateName: string | undefined
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint9StartDateName: [],
      newConstraint9StopDateName: [],
    };
    const newConstraint9StartDate =
      newConstraint9StartDateName &&
      utils.stringToDate(newConstraint9StartDateName);
    const newConstraint9StopDate =
      newConstraint9StopDateName &&
      utils.stringToDate(newConstraint9StopDateName);
    if (!newConstraint9StartDate)
      errorMessages.newConstraint9StartDateName.push(
        m["arg0の形式が正しくありません"](m["開始日"])
      );
    if (!newConstraint9StopDate)
      errorMessages.newConstraint9StopDateName.push(
        m["arg0の形式が正しくありません"](m["終了日"])
      );
    if (
      newConstraint9StartDate &&
      newConstraint9StopDate &&
      newConstraint9StartDate > newConstraint9StopDate
    ) {
      errorMessages.newConstraint9StartDateName.push(
        m["arg0にはarg1より過去の日付を入力してください"](
          m["開始日"],
          m["終了日"]
        )
      );
      errorMessages.newConstraint9StopDateName.push(
        m["arg0にはarg1より未来の日付を入力してください"](
          m["終了日"],
          m["開始日"]
        )
      );
    }
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
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        start_date_name: state.newConstraint9StartDateName!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        stop_date_name: state.newConstraint9StopDateName!,
        term_id: termId,
      })
    );
  };
  return (
    <>
      <Toolbar>
        <Typography variant="subtitle1" sx={{ flexGrow: 1 }}>
          {m["職員の期間に割り当てる勤務"]}
        </Typography>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1} ref={ref}>
          {constraints9InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12} id={`constraint9-${c.id}`}>
              <Constraint9 constraint9={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      <FloatingAddButton onClick={handleClickOpenCreationDialog} />
      {state.newConstraint9MemberId === undefined ||
      state.newConstraint9KinmuId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            {m["arg0を追加できません"](m["職員の期間に割り当てる勤務"])}
          </DialogTitle>
          <DialogContent>
            {state.newConstraint9MemberId === undefined && (
              <DialogContentText>{m["職員がいません"]}</DialogContentText>
            )}
            {state.newConstraint9KinmuId === undefined && (
              <DialogContentText>{m["勤務がありません"]}</DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleCloseCreationDialog}>
              {m["閉じる"]}
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        (() => {
          const newConstraint9Member =
            selectedMemberById[state.newConstraint9MemberId];
          const newConstraint9StartDate =
            state.newConstraint9StartDateName &&
            utils.stringToDate(state.newConstraint9StartDateName);
          const termStartDate =
            selectedTerm && utils.stringToDate(selectedTerm.start_date_name);
          const newConstraint9StartDateIsEnabled =
            !newConstraint9StartDate || !termStartDate
              ? false
              : termStartDate <= newConstraint9StartDate;
          const newConstraint9StopDate =
            state.newConstraint9StopDateName &&
            utils.stringToDate(state.newConstraint9StopDateName);
          const termStopDate =
            selectedTerm && utils.stringToDate(selectedTerm.stop_date_name);
          const newConstraint9StopDateIsEnabled =
            !newConstraint9StopDate || !termStopDate
              ? false
              : newConstraint9StopDate <= termStopDate;
          const newConstraint9StartDateAndStopDateAreEnabled =
            (newConstraint9StartDate &&
              newConstraint9StopDate &&
              newConstraint9StartDate <= newConstraint9StopDate) ||
            false;
          const newConstraint9Kinmu =
            selectedKinmuById[state.newConstraint9KinmuId];
          const relativesAreEnabled =
            newConstraint9Member?.is_enabled &&
            newConstraint9StartDateIsEnabled &&
            newConstraint9StopDateIsEnabled &&
            newConstraint9StartDateAndStopDateAreEnabled &&
            newConstraint9Kinmu?.is_enabled;
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
              <DialogTitle>
                {m["arg0の追加"](m["職員の期間に割り当てる勤務"])}
              </DialogTitle>
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
                      label={m["有効"]}
                    />
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label={m["職員"]}
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
                      label={m["開始日"]}
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
                      label={m["終了日"]}
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
                      label={m["勤務"]}
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
                  {m["追加"]}
                </Button>
                <Button color="primary" onClick={handleCloseCreationDialog}>
                  {m["閉じる"]}
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
