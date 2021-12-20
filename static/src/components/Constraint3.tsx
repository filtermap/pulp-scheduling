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

import * as constraints3 from "../modules/constraints3";
import { useAppSelector } from "../modules/hooks";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";

import ExpandMoreButton from "./parts/ExpandMoreButton";
import LineThrough from "./parts/LineThrough";

type Props = {
  constraint3: constraints3.Constraint3;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  constraint3MinNumberOfAssignments: string[];
};

function Constraint3(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedMember = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => members.selectors.selectById(state, props.constraint3.member_id)!
  );
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint3.kinmu_id)!
  );
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === props.constraint3.term_id
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.constraint3.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeConstraint3IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints3.update({
        id: props.constraint3.id,
        changes: {
          is_enabled: event.target.checked,
        },
      })
    );
  };
  const handleChangeConstraint3MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints3.update({
        id: props.constraint3.id,
        changes: {
          member_id: parseInt(event.target.value, 10),
        },
      })
    );
  };
  const handleChangeConstraint3KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints3.update({
        id: props.constraint3.id,
        changes: {
          kinmu_id: parseInt(event.target.value, 10),
        },
      })
    );
  };
  const validate = (
    constraint3MinNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      constraint3MinNumberOfAssignments: [],
    };
    if (isNaN(constraint3MinNumberOfAssignments)) {
      errorMessages.constraint3MinNumberOfAssignments.push(
        "割り当て数下限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeConstraint3MinNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints3.update({
        id: props.constraint3.id,
        changes: {
          min_number_of_assignments: parseInt(event.target.value, 10),
        },
      })
    );
  };
  const handleClickOpenDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: true }));
  };
  const handleCloseDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
  };
  const handleClickDeleteConstraint3 = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(constraints3.remove(props.constraint3.id));
  };
  const relativesAreEnabled =
    selectedMember.is_enabled && selectedKinmu.is_enabled;
  const title = (
    <>
      <LineThrough line={!selectedMember.is_enabled}>
        {selectedMember.name}
      </LineThrough>
      に
      <LineThrough line={!selectedKinmu.is_enabled}>
        {selectedKinmu.name}
      </LineThrough>
      を{props.constraint3.min_number_of_assignments}回以上割り当てる
    </>
  );
  const errorMessages = validate(props.constraint3.min_number_of_assignments);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint3.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint3IsEnabled}
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
                  value={props.constraint3.member_id}
                  onChange={handleChangeConstraint3MemberId}
                  fullWidth={true}
                >
                  {membersInTerm.map((member) => (
                    <MenuItem key={member.id} value={member.id}>
                      <LineThrough line={!member.is_enabled}>
                        {member.name}
                      </LineThrough>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  select={true}
                  label="勤務"
                  value={props.constraint3.kinmu_id}
                  onChange={handleChangeConstraint3KinmuId}
                  fullWidth={true}
                >
                  {kinmusInTerm.map((kinmu) => (
                    <MenuItem key={kinmu.id} value={kinmu.id}>
                      <LineThrough line={!kinmu.is_enabled}>
                        {kinmu.name}
                      </LineThrough>
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label="割り当て数下限"
                  type="number"
                  defaultValue={props.constraint3.min_number_of_assignments}
                  onChange={handleChangeConstraint3MinNumberOfAssignments}
                  fullWidth={true}
                  inputProps={{
                    min: constraints3.minOfConstraint3MinNumberOfAssignments,
                  }}
                  error={
                    errorMessages.constraint3MinNumberOfAssignments.length > 0
                  }
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.constraint3MinNumberOfAssignments.map(
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
        <DialogTitle>職員の勤務の割り当て数の下限の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この職員の勤務の割り当て数の下限を削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint3}>
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

export default Constraint3;
