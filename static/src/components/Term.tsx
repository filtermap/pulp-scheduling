import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { Theme, WithStyles } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import TextField from "@material-ui/core/TextField";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classnames from "classnames";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import CardActions from "@material-ui/core/CardActions";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import Typography from "@material-ui/core/Typography";
import DialogActions from "@material-ui/core/DialogActions";
import { StateWithHistory } from "redux-undo";
import MenuItem from "@material-ui/core/MenuItem";
import Switch from "@material-ui/core/Switch";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import * as all from "../modules/all";
import * as utils from "../utils";
import * as terms from "../modules/terms";

type Props = {
  term: terms.Term;
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  selectedTermId: number;
  importDataDialogIsOpen: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  termStartDateName: string[];
  termStopDateName: string[];
};

function selector(state: StateWithHistory<all.State>) {
  return {
    terms: state.present.terms,
  };
}

function Term(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(selector, shallowEqual);
  const selectableTerms = selected.terms.filter(
    ({ id, is_enabled }) => is_enabled && id !== props.term.id
  );
  const initialSelectedTermId = Math.max(
    0,
    ...selectableTerms.map(({ id }) => id)
  );
  const initialState = React.useMemo(
    () => ({
      importDataDialogIsOpen: false,
      selectedTermId: initialSelectedTermId,
      deletionDialogIsOpen: false,
      expanded: false,
    }),
    [initialSelectedTermId]
  );
  const [state, setState] = React.useState<State>(initialState);
  React.useEffect(() => setState(initialState), [initialState]);
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeTermIsEnabled = (
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    dispatch(terms.updateTermIsEnabled(props.term.id, checked));
  };
  const validate = (
    termStartDateName: string,
    termStopDateName: string
  ): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      termStartDateName: [],
      termStopDateName: [],
    };
    if (!utils.stringToDate(termStartDateName)) {
      errorMessages.termStartDateName.push("開始日の形式が正しくありません");
    }
    if (!utils.stringToDate(termStopDateName)) {
      errorMessages.termStopDateName.push("終了日の形式が正しくありません");
    }
    return errorMessages;
  };
  const handleChangeTermStartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(terms.updateTermStartDateName(props.term.id, event.target.value));
  };
  const handleChangeTermStopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(terms.updateTermStopDateName(props.term.id, event.target.value));
  };
  const handleClickOpenImportDataDialog = () => {
    setState((state) => ({ ...state, importDataDialogIsOpen: true }));
  };
  const handleClickCloseImportDataDialog = () => {
    setState((state) => ({ ...state, importDataDialogIsOpen: false }));
  };
  const handleChangeTermId = (event: React.ChangeEvent<HTMLInputElement>) => {
    setState((state) => ({
      ...state,
      selectedTermId: parseInt(event.target.value, 10),
    }));
  };
  const handleClickImportData = () => {
    setState((state) => ({ ...state, importDataDialogIsOpen: false }));
    dispatch(all.importData(state.selectedTermId, props.term.id));
  };
  const handleClickOpenDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: true }));
  };
  const handleCloseDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
  };
  const handleClickDeleteTerm = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(all.deleteTerm(props.term.id));
  };
  const title = `${props.term.start_date_name}から${props.term.stop_date_name}まで`;
  const errorMessages = validate(
    props.term.start_date_name,
    props.term.stop_date_name
  );
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.term.is_enabled}
              onChange={handleChangeTermIsEnabled}
              color="primary"
            />
          }
          action={
            <IconButton
              className={classnames(props.classes.expand, {
                [props.classes.expandOpen]: state.expanded,
              })}
              onClick={handleClickExpand}
              aria-expanded={state.expanded}
            >
              <ExpandMoreIcon />
            </IconButton>
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
                <FormControlLabel
                  control={
                    <Switch
                      checked={props.term.is_enabled}
                      onChange={handleChangeTermIsEnabled}
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
                  defaultValue={props.term.start_date_name}
                  onChange={handleChangeTermStartDateName}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={errorMessages.termStartDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.termStartDateName.map((message) => (
                    <div key={message}>{message}</div>
                  ))}
                />
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label="終了日"
                  type="date"
                  defaultValue={props.term.stop_date_name}
                  onChange={handleChangeTermStopDateName}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={errorMessages.termStopDateName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.termStopDateName.map((message) => (
                    <div key={message}>{message}</div>
                  ))}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions disableSpacing={true}>
            <Button size="small" onClick={handleClickOpenImportDataDialog}>
              インポート
            </Button>
            <Button size="small" onClick={handleClickOpenDeletionDialog}>
              削除
            </Button>
          </CardActions>
        </Collapse>
      </Card>
      {selectableTerms.length === 0 ? (
        <Dialog
          onClose={handleClickCloseImportDataDialog}
          open={state.importDataDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>
            他の期間からデータと条件をインポートできません
          </DialogTitle>
          <DialogContent>
            <DialogContentText>有効な他の期間がありません</DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleClickCloseImportDataDialog}>
              閉じる
            </Button>
          </DialogActions>
        </Dialog>
      ) : (
        <Dialog
          onClose={handleClickCloseImportDataDialog}
          open={state.importDataDialogIsOpen}
          fullWidth={true}
          maxWidth="md"
        >
          <DialogTitle>他の期間からデータと条件をインポート</DialogTitle>
          <DialogContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <DialogContentText>
                  この期間に他の期間からデータと条件をインポートします
                </DialogContentText>
                <Typography>{title}</Typography>
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  select={true}
                  label="期間"
                  value={state.selectedTermId}
                  onChange={handleChangeTermId}
                  fullWidth={true}
                >
                  {selectableTerms.map((term) => (
                    <MenuItem key={term.id} value={term.id}>
                      {
                        <span>
                          {`${term.start_date_name}から${term.stop_date_name}まで`}
                        </span>
                      }
                    </MenuItem>
                  ))}
                </TextField>
              </Grid>
              <Grid item={true} xs={12}>
                <DialogContentText>
                  選択した期間から次のデータと条件をインポートします
                  <br />
                  - 職員
                  <br />
                  - 勤務
                  <br />
                  - グループ
                  <br />
                  - すべての条件
                  <br />
                </DialogContentText>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleClickImportData}>
              インポート
            </Button>
            <Button color="primary" onClick={handleClickCloseImportDataDialog}>
              閉じる
            </Button>
          </DialogActions>
        </Dialog>
      )}
      <Dialog
        onClose={handleCloseDeletionDialog}
        open={state.deletionDialogIsOpen}
        fullWidth={true}
        maxWidth="md"
      >
        <DialogTitle>期間の削除</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <DialogContentText>この期間を削除します</DialogContentText>
              <Typography>{title}</Typography>
            </Grid>
            <Grid item={true} xs={12}>
              <DialogContentText>
                期間中のすべての勤務表、職員、勤務、グループ、条件も削除されます
              </DialogContentText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteTerm}>
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

const styles = (theme: Theme) =>
  createStyles({
    expand: {
      transform: "rotate(0deg)",
      transition: theme.transitions.create("transform", {
        duration: theme.transitions.duration.shortest,
      }),
    },
    expandOpen: {
      transform: "rotate(180deg)",
    },
  });

export default withStyles(styles)(Term);
