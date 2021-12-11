import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router";
import * as kinmus from "../modules/kinmus";
import { RootState } from "../modules/store";
import Kinmu from "./Kinmu";

type Props = WithStyles<typeof styles>;

type State = {
  creationDialogIsOpen: boolean;
  newKinmuIsEnabled: boolean;
  newKinmuName: string;
};

type ErrorMessages = {
  newKinmuName: string[];
};

function select(state: RootState) {
  return {
    kinmus: state.present.kinmus,
  };
}

function Kinmus(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const { termIdName } = useParams();
  if (!termIdName) throw new Error("!termIdName");
  const termId = parseInt(termIdName, 10);
  const initialState = {
    creationDialogIsOpen: false,
    newKinmuIsEnabled: true,
    newKinmuName: "",
  };
  const [state, setState] = React.useState<State>(initialState);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  React.useEffect(() => setState(initialState), [termId]);
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === termId
  );
  const handleClickOpenCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: true }));
  };
  const handleCloseCreationDialog = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
  };
  const handleChangeNewKinmuIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({
      ...state,
      newKinmuIsEnabled: event.target.checked,
    }));
  };
  const validate = (newKinmuName: string): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      newKinmuName: [],
    };
    if (newKinmuName === "") {
      errorMessages.newKinmuName.push("勤務名を入力してください");
    }
    return errorMessages;
  };
  const handleChangeNewKinmuName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setState((state) => ({ ...state, newKinmuName: event.target.value }));
  };
  const handleClickCreateKinmu = () => {
    setState((state) => ({ ...state, creationDialogIsOpen: false }));
    dispatch(
      kinmus.createKinmu({
        term_id: termId,
        is_enabled: state.newKinmuIsEnabled,
        name: state.newKinmuName,
      })
    );
  };
  const errorMessages = validate(state.newKinmuName);
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
                勤務
              </Typography>
              <Button size="small" onClick={handleClickOpenCreationDialog}>
                追加
              </Button>
            </Toolbar>
          </Grid>
          {kinmusInTerm.map((kinmu) => (
            <Grid key={kinmu.id} item={true} xs={12}>
              <Kinmu kinmu={kinmu} />
            </Grid>
          ))}
        </Grid>
      </div>
      <Dialog
        onClose={handleCloseCreationDialog}
        open={state.creationDialogIsOpen}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>勤務の追加</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <FormControlLabel
                control={
                  <Switch
                    checked={state.newKinmuIsEnabled}
                    onChange={handleChangeNewKinmuIsEnabled}
                    color="primary"
                  />
                }
                label="有効"
              />
            </Grid>
            <Grid item={true} xs={12}>
              <TextField
                label="勤務名"
                defaultValue={state.newKinmuName}
                onChange={handleChangeNewKinmuName}
                fullWidth={true}
                error={errorMessages.newKinmuName.length > 0}
                FormHelperTextProps={{
                  // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                  component: "div",
                }}
                helperText={errorMessages.newKinmuName.map((message) => (
                  <div key={message}>{message}</div>
                ))}
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
            onClick={handleClickCreateKinmu}
          >
            追加
          </Button>
          <Button color="primary" onClick={handleCloseCreationDialog}>
            閉じる
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}

const styles = createStyles({
  gridFrame: {
    padding: 8,
  },
  toolbarTitle: {
    flex: 1,
  },
});

export default withStyles(styles)(Kinmus);
