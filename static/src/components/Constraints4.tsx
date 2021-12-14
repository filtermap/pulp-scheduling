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
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import Box from "@mui/material/Box";
import * as constraints4 from "../modules/constraints4";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import Constraint4 from "./Constraint4";
import { lineThroughSx } from "./parts/lineThroughSx";
import GridFrame from "./parts/GridFrame";

const PREFIX = "Constraints4";

const classes = {
  toolbarTitle: `${PREFIX}-toolbarTitle`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")({
  [`& .${classes.toolbarTitle}`]: {
    flex: 1,
  },
});

type State = {
  creationDialogIsOpen: boolean;
  newConstraint4IsEnabled: boolean;
  newConstraint4MemberId: number | undefined;
  newConstraint4KinmuId: number | undefined;
  newConstraint4MaxNumberOfAssignments: number;
};

type ErrorMessages = {
  newConstraint4MaxNumberOfAssignments: string[];
};

function Constraints4(): JSX.Element {
  const { termIdName } = useParams();
  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
  const termId = parseInt(termIdName!, 10);
  const dispatch = useDispatch();
  const selectedConstraints4 = useSelector(constraints4.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedMemberById = useSelector(members.selectors.selectEntities);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const constraints4InTerm = selectedConstraints4.filter(
    ({ term_id }) => term_id === termId
  );
  const membersInTerm = React.useMemo(
    () => selectedMembers.filter(({ term_id }) => term_id === termId),
    [selectedMembers, termId]
  );
  const kinmusInTerm = React.useMemo(
    () => selectedKinmus.filter(({ term_id }) => term_id === termId),
    [selectedKinmus, termId]
  );
  const initialState = React.useMemo(
    () => ({
      creationDialogIsOpen: false,
      newConstraint4IsEnabled: true,
      newConstraint4KinmuId:
        kinmusInTerm.length > 0 ? kinmusInTerm[0].id : undefined,
      newConstraint4MaxNumberOfAssignments:
        constraints4.minOfConstraint4MaxNumberOfAssignments,
      newConstraint4MemberId:
        membersInTerm.length > 0 ? membersInTerm[0].id : undefined,
    }),
    [kinmusInTerm, membersInTerm]
  );
  const [state, setState] = React.useState<State>(initialState);
  React.useEffect(() => setState(initialState), [initialState]);
  const handleClickOpenCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: true }));
  };
  const handleCloseCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
  };
  const handleChangeNewConstraint4IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint4IsEnabled: event.target.checked,
    }));
  };
  const handleChangeNewConstraint4MemberId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint4MemberId: parseInt(event.target.value, 10),
    }));
  };
  const handleChangeNewConstraint4KinmuId = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint4KinmuId: parseInt(event.target.value, 10),
    }));
  };
  const validate = (
    newConstraint4MaxNumberOfAssignments: number
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newConstraint4MaxNumberOfAssignments: [],
    };
    if (isNaN(newConstraint4MaxNumberOfAssignments)) {
      errorMessages.newConstraint4MaxNumberOfAssignments.push(
        "割り当て数上限の形式が正しくありません"
      );
    }
    return errorMessages;
  };
  const handleChangeNewConstraint4MaxNumberOfAssignments = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newConstraint4MaxNumberOfAssignments: parseInt(event.target.value, 10),
    }));
  };
  const handleClickCreateConstraint4 = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      constraints4.add({
        term_id: termId,
        is_enabled: state.newConstraint4IsEnabled,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        member_id: state.newConstraint4MemberId!,
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmu_id: state.newConstraint4KinmuId!,
        max_number_of_assignments: state.newConstraint4MaxNumberOfAssignments,
      })
    );
  };
  return (
    <Root>
      <Toolbar>
        <Typography variant="subtitle1" className={classes.toolbarTitle}>
          職員の勤務の割り当て数の上限
        </Typography>
        <Button size="small" onClick={handleClickOpenCreationDialog}>
          追加
        </Button>
      </Toolbar>
      <GridFrame>
        <Grid container={true} spacing={1}>
          {constraints4InTerm.map((c) => (
            <Grid key={c.id} item={true} xs={12}>
              <Constraint4 constraint4={c} />
            </Grid>
          ))}
        </Grid>
      </GridFrame>
      {state.newConstraint4MemberId === undefined ||
      state.newConstraint4KinmuId === undefined ? (
        <Dialog
          onClose={handleCloseCreationDialog}
          open={state.creationDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            職員の勤務の割り当て数の上限を追加できません
          </DialogTitle>
          <DialogContent>
            {state.newConstraint4MemberId === undefined && (
              <DialogContentText>職員がいません</DialogContentText>
            )}
            {state.newConstraint4KinmuId === undefined && (
              <DialogContentText>勤務がありません</DialogContentText>
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
          const newConstraint4Member =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedMemberById[state.newConstraint4MemberId]!;
          const newConstraint4Kinmu =
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            selectedKinmuById[state.newConstraint4KinmuId]!;
          const relativesAreEnabled =
            newConstraint4Member.is_enabled && newConstraint4Kinmu.is_enabled;
          const errorMessages = validate(
            state.newConstraint4MaxNumberOfAssignments
          );
          return (
            <Dialog
              onClose={handleCloseCreationDialog}
              open={state.creationDialogIsOpen}
              fullWidth={true}
              maxWidth="md"
            >
              <DialogTitle>職員の勤務の割り当て数の上限の追加</DialogTitle>
              <DialogContent>
                <Grid container={true} spacing={1}>
                  <Grid item={true} xs={12}>
                    <FormControlLabel
                      control={
                        <Switch
                          checked={
                            state.newConstraint4IsEnabled && relativesAreEnabled
                          }
                          disabled={!relativesAreEnabled}
                          onChange={handleChangeNewConstraint4IsEnabled}
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
                      value={state.newConstraint4MemberId}
                      onChange={handleChangeNewConstraint4MemberId}
                      fullWidth={true}
                    >
                      {membersInTerm.map((member) => (
                        <MenuItem key={member.id} value={member.id}>
                          <Box
                            component="span"
                            sx={{ ...(!member.is_enabled && lineThroughSx) }}
                          >
                            {member.name}
                          </Box>
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label="勤務"
                      value={state.newConstraint4KinmuId}
                      onChange={handleChangeNewConstraint4KinmuId}
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
                      label="割り当て数上限"
                      type="number"
                      defaultValue={state.newConstraint4MaxNumberOfAssignments}
                      onChange={
                        handleChangeNewConstraint4MaxNumberOfAssignments
                      }
                      fullWidth={true}
                      inputProps={{
                        min: constraints4.minOfConstraint4MaxNumberOfAssignments,
                      }}
                      error={
                        errorMessages.newConstraint4MaxNumberOfAssignments
                          .length > 0
                      }
                      FormHelperTextProps={{
                        // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                        component: "div",
                      }}
                      helperText={errorMessages.newConstraint4MaxNumberOfAssignments.map(
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
                  onClick={handleClickCreateConstraint4}
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

export default Constraints4;
