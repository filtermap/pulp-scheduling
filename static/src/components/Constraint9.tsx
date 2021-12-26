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

import * as constraints9 from "../modules/constraints9";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import Constraint9Name from "./names/Constraint9Name";
import KinmuName from "./names/KinmuName";
import MemberName from "./names/MemberName";
import ExpandMoreButton from "./parts/ExpandMoreButton";
import lineThroughSx from "./parts/lineThroughSx";

type Props = {
  constraint9: constraints9.Constraint9;
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
  constraint9StartDateName: string[];
  constraint9StopDateName: string[];
};

// eslint-disable-next-line react/display-name
const Constraint9 = React.memo((props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedMember = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => members.selectors.selectById(state, props.constraint9.member_id)!
  );
  const selectedTerm = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => terms.selectors.selectById(state, props.constraint9.term_id)!
  );
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint9.kinmu_id)!
  );
  const [state, updateState] = useImmer<State>({
    changes: {
      start_date_name: props.constraint9.start_date_name,
      stop_date_name: props.constraint9.stop_date_name,
    },
    deletionDialogIsOpen: false,
    expanded: false,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.start_date_name = props.constraint9.start_date_name;
        state.changes.stop_date_name = props.constraint9.stop_date_name;
      }),
    [
      props.constraint9.start_date_name,
      props.constraint9.stop_date_name,
      updateState,
    ]
  );
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === props.constraint9.term_id
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint9.term_id
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeConstraint9IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints9.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.constraint9.id,
      })
    );
  };
  const handleChangeConstraint9MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints9.update({
        changes: {
          member_id: parseInt(event.target.value, 10),
        },
        id: props.constraint9.id,
      })
    );
  };
  const validate = (
    constraint9StartDateName: string,
    constraint9StopDateName: string
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint9StartDateName: [],
      constraint9StopDateName: [],
    };
    if (!utils.stringToDate(constraint9StartDateName))
      errorMessages.constraint9StartDateName.push(
        "開始日の形式が正しくありません"
      );
    if (!utils.stringToDate(constraint9StopDateName))
      errorMessages.constraint9StopDateName.push(
        "終了日の形式が正しくありません"
      );
    return errorMessages;
  };
  const handleChangeConstraint9StartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.start_date_name = event.target.value;
    });
  };
  const handleBlurConstraint9StartDateName = () => {
    if (state.changes.start_date_name === props.constraint9.start_date_name)
      return;
    dispatch(
      constraints9.update({
        changes: {
          start_date_name: state.changes.start_date_name,
        },
        id: props.constraint9.id,
      })
    );
  };
  const handleChangeConstraint9StopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.stop_date_name = event.target.value;
    });
  };
  const handleBlurConstraint9StopDateName = () => {
    if (state.changes.stop_date_name === props.constraint9.stop_date_name)
      return;
    dispatch(
      constraints9.update({
        changes: {
          stop_date_name: state.changes.stop_date_name,
        },
        id: props.constraint9.id,
      })
    );
  };
  const handleChangeConstraint9KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints9.update({
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
        id: props.constraint9.id,
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
  const handleClickDeleteConstraint9 = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(constraints9.remove(props.constraint9.id));
  };
  const constraint9StartDate = utils.stringToDate(
    props.constraint9.start_date_name
  );
  const termStartDate = utils.stringToDate(selectedTerm.start_date_name);
  const constraint9StartDateIsEnabled =
    !constraint9StartDate || !termStartDate
      ? false
      : termStartDate <= constraint9StartDate;
  const constraint9StopDate = utils.stringToDate(
    props.constraint9.stop_date_name
  );
  const termStopDate = utils.stringToDate(selectedTerm.stop_date_name);
  const constraint9StopDateIsEnabled =
    !constraint9StopDate || !termStopDate
      ? false
      : constraint9StopDate <= termStopDate;
  const relativesAreEnabled =
    selectedMember.is_enabled &&
    constraint9StartDateIsEnabled &&
    constraint9StopDateIsEnabled &&
    selectedKinmu.is_enabled;
  const title = <Constraint9Name constraint9={props.constraint9} />;
  const errorMessages = validate(
    props.constraint9.start_date_name,
    props.constraint9.stop_date_name
  );
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint9.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint9IsEnabled}
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
                  value={props.constraint9.member_id}
                  onChange={handleChangeConstraint9MemberId}
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
                  onChange={handleChangeConstraint9StartDateName}
                  onBlur={handleBlurConstraint9StartDateName}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    sx: {
                      ...(!constraint9StartDateIsEnabled && lineThroughSx),
                    },
                  }}
                  error={errorMessages.constraint9StartDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint9StartDateName.map(
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
                  onChange={handleChangeConstraint9StopDateName}
                  onBlur={handleBlurConstraint9StopDateName}
                  fullWidth={true}
                  InputLabelProps={{
                    shrink: true,
                  }}
                  inputProps={{
                    sx: { ...(!constraint9StopDateIsEnabled && lineThroughSx) },
                  }}
                  error={errorMessages.constraint9StopDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint9StopDateName.map(
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
                  value={props.constraint9.kinmu_id}
                  onChange={handleChangeConstraint9KinmuId}
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
          <CardActions disableSpacing={true}>
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
        <DialogTitle>職員の期間に割り当てる勤務の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この職員の期間に割り当てる勤務を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint9}>
            削除
          </Button>
          <Button color="primary" onClick={handleCloseDeletionDialog}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Constraint9;
