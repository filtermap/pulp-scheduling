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

import * as constraints4 from "../modules/constraints4";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";

import Constraint4Name from "./names/Constraint4Name";
import KinmuName from "./names/KinmuName";
import MemberName from "./names/MemberName";
import ExpandMoreButton from "./parts/ExpandMoreButton";

type Props = {
  constraint4: constraints4.Constraint4;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
  changes: {
    max_number_of_assignments: number;
  };
};

type ErrorMessages = {
  constraint4MaxNumberOfAssignments: string[];
};

function Constraint4(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedMember = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => members.selectors.selectById(state, props.constraint4.member_id)!
  );
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint4.kinmu_id)!
  );
  const [state, updateState] = useImmer<State>({
    deletionDialogIsOpen: false,
    expanded: false,
    changes: {
      max_number_of_assignments: props.constraint4.max_number_of_assignments,
    },
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.changes.max_number_of_assignments =
          props.constraint4.max_number_of_assignments;
      }),
    [props.constraint4.max_number_of_assignments, updateState]
  );
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === props.constraint4.term_id
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint4.term_id
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeConstraint4IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints4.update({
        id: props.constraint4.id,
        changes: {
          is_enabled: event.target.checked,
        },
      })
    );
  };
  const handleChangeConstraint4MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints4.update({
        id: props.constraint4.id,
        changes: {
          member_id: parseInt(event.target.value, 10),
        },
      })
    );
  };
  const handleChangeConstraint4KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints4.update({
        id: props.constraint4.id,
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
      })
    );
  };
  const validate = (
    constraint4MaxNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint4MaxNumberOfAssignments: [],
    };
    if (isNaN(constraint4MaxNumberOfAssignments)) {
      errorMessages.constraint4MaxNumberOfAssignments.push(
        "割り当て数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeConstraint4MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.max_number_of_assignments = parseInt(
        event.target.value,
        10
      );
    });
  };
  const handleBlurConstraint4MaxNumberOfAssignments = () => {
    dispatch(
      constraints4.update({
        id: props.constraint4.id,
        changes: {
          max_number_of_assignments: state.changes.max_number_of_assignments,
        },
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
  const handleClickDeleteConstraint4 = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(constraints4.remove(props.constraint4.id));
  };
  const relativesAreEnabled =
    selectedMember.is_enabled && selectedKinmu.is_enabled;
  const title = <Constraint4Name constraint4={props.constraint4} />;
  const errorMessages = validate(props.constraint4.max_number_of_assignments);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint4.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint4IsEnabled}
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
                  value={props.constraint4.member_id}
                  onChange={handleChangeConstraint4MemberId}
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
                  select={true}
                  label="勤務"
                  value={props.constraint4.kinmu_id}
                  onChange={handleChangeConstraint4KinmuId}
                  fullWidth={true}
                >
                  {kinmusInTerm.map((kinmu) => (
                    <MenuItem key={kinmu.id} value={kinmu.id}>
                      <KinmuName kinmu={kinmu} />
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label="割り当て数上限"
                  type="number"
                  value={state.changes.max_number_of_assignments}
                  onChange={handleChangeConstraint4MaxNumberOfAssignments}
                  onBlur={handleBlurConstraint4MaxNumberOfAssignments}
                  fullWidth={true}
                  inputProps={{
                    min: constraints4.minOfConstraint4MaxNumberOfAssignments,
                  }}
                  error={
                    errorMessages.constraint4MaxNumberOfAssignments.length > 0
                  }
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint4MaxNumberOfAssignments.map(
                    (message) => (
                      <div key={message}>{message}</div>
                    )
                  )}
                />
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
        <DialogTitle>職員の勤務の割り当て数の上限の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この職員の勤務の割り当て数の上限を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint4}>
            削除
          </Button>
          <Button color="primary" onClick={handleCloseDeletionDialog}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

export default Constraint4;
