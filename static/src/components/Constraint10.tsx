import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useImmer } from "use-immer";

import * as constraints10 from "../modules/constraints10";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import Constraint10Name from "./names/Constraint10Name";
import KinmuName from "./names/KinmuName";
import MemberName from "./names/MemberName";
import ExpandMoreButton from "./parts/ExpandMoreButton";
import lineThroughSx from "./parts/lineThroughSx";

type Props = {
  constraint10: constraints10.Constraint10;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
  changes: {
    start_date_name: string;
    stop_date_name: string;
  };
};

type ErrorMessages = {
  constraint10StartDateName: string[];
  constraint10StopDateName: string[];
};

const Constraint10 = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedMember = useAppSelector(
    (state) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      members.selectors.selectById(state, props.constraint10.member_id)!
  );
  const selectedTerm = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => terms.selectors.selectById(state, props.constraint10.term_id)!
  );
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint10.kinmu_id)!
  );
  const [state, updateState] = useImmer<State>({
    changes: {
      start_date_name: props.constraint10.start_date_name,
      stop_date_name: props.constraint10.stop_date_name,
    },
    deletionDialogIsOpen: false,
    expanded: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.start_date_name = props.constraint10.start_date_name;
        state.changes.stop_date_name = props.constraint10.stop_date_name;
      }),
    [
      props.constraint10.start_date_name,
      props.constraint10.stop_date_name,
      updateState,
    ]
  );
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === props.constraint10.term_id
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint10.term_id
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeConstraint10IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints10.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.constraint10.id,
      })
    );
  };
  const handleChangeConstraint10MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints10.update({
        changes: {
          member_id: parseInt(event.target.value, 10),
        },
        id: props.constraint10.id,
      })
    );
  };
  const validate = (
    constraint10StartDateName: string,
    constraint10StopDateName: string
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint10StartDateName: [],
      constraint10StopDateName: [],
    };
    if (!utils.stringToDate(constraint10StartDateName))
      errorMessages.constraint10StartDateName.push(
        "開始日の形式が正しくありません"
      );
    if (!utils.stringToDate(constraint10StopDateName))
      errorMessages.constraint10StopDateName.push(
        "終了日の形式が正しくありません"
      );
    return errorMessages;
  };
  const handleChangeConstraint10StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.start_date_name = event.target.value;
    });
  };
  const handleBlurConstraint10StartDateName = () => {
    dispatch(
      constraints10.update({
        changes: {
          start_date_name: state.changes.start_date_name,
        },
        id: props.constraint10.id,
      })
    );
  };
  const handleChangeConstraint10StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.stop_date_name = event.target.value;
    });
  };
  const handleBlurConstraint10StopDateName = () => {
    dispatch(
      constraints10.update({
        changes: {
          stop_date_name: state.changes.stop_date_name,
        },
        id: props.constraint10.id,
      })
    );
  };
  const handleChangeConstraint10KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints10.update({
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
        id: props.constraint10.id,
      })
    );
  };
  const handleClickOpenDeletionDialog = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = true;
    });
  };
  const handleCloseDeletionDialog = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
  };
  const handleClickDeleteConstraint10 = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(constraints10.remove(props.constraint10.id));
  };
  const constraint10StartDate = utils.stringToDate(
    props.constraint10.start_date_name
  );
  const termStartDate = utils.stringToDate(selectedTerm.start_date_name);
  const constraint10StartDateIsEnabled =
    !constraint10StartDate || !termStartDate
      ? false
      : termStartDate <= constraint10StartDate;
  const constraint10StopDate = utils.stringToDate(
    props.constraint10.stop_date_name
  );
  const termStopDate = utils.stringToDate(selectedTerm.stop_date_name);
  const constraint10StopDateIsEnabled =
    !constraint10StopDate || !termStopDate
      ? false
      : constraint10StopDate <= termStopDate;
  const relativesAreEnabled =
    selectedMember.is_enabled &&
    constraint10StartDateIsEnabled &&
    constraint10StopDateIsEnabled &&
    selectedKinmu.is_enabled;
  const title = <Constraint10Name constraint10={props.constraint10} />;
  const errorMessages = validate(
    props.constraint10.start_date_name,
    props.constraint10.stop_date_name
  );
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint10.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint10IsEnabled}
              color="primary"
            />
          }
          action={
            <ExpandMoreButton
              expanded={state.expanded}
              onClick={handleClickExpand}
              aria-expanded={state.expanded}
              size="large"
            />
          }
          title={title}
          titleTypographyProps={{
            variant: "h5",
          }}
        />
        <Collapse in={state.expanded} timeout="auto" unmountOnExit={true}>
          <CardContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <TextField
                  select={true}
                  label="職員"
                  value={props.constraint10.member_id}
                  onChange={handleChangeConstraint10MemberId}
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
                  value={state.changes.start_date_name}
                  onChange={handleChangeConstraint10StartDateName}
                  onBlur={handleBlurConstraint10StartDateName}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    sx: {
                      ...(!constraint10StartDateIsEnabled && lineThroughSx),
                    },
                  }}
                  error={errorMessages.constraint10StartDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint10StartDateName.map(
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
                  value={state.changes.stop_date_name}
                  onChange={handleChangeConstraint10StopDateName}
                  onBlur={handleBlurConstraint10StopDateName}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    sx: {
                      ...(!constraint10StopDateIsEnabled && lineThroughSx),
                    },
                  }}
                  error={errorMessages.constraint10StopDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint10StopDateName.map(
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
                  value={props.constraint10.kinmu_id}
                  onChange={handleChangeConstraint10KinmuId}
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
          </CardContent>
          <CardActions>
            <Button size="small" onClick={handleClickOpenDeletionDialog}>
              削除
            </Button>
          </CardActions>
        </Collapse>
      </Card>
      <Dialog
        onClose={handleCloseDeletionDialog}
        open={state.deletionDialogIsOpen}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>職員の期間に割り当てない勤務の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この職員の期間に割り当てない勤務を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint10}>
            削除
          </Button>
          <Button color="primary" onClick={handleCloseDeletionDialog}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Constraint10;
