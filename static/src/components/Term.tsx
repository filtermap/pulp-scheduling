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
import FormControlLabel from "@mui/material/FormControlLabel";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import { useImmer } from "use-immer";

import * as all from "../modules/all";
import * as terms from "../modules/terms";
import * as utils from "../utils";

import TermName from "./names/TermName";
import ExpandMoreButton from "./parts/ExpandMoreButton";

type Props = {
  term: terms.Term;
};

type State = {
  expanded: boolean;
  selectedTermId: number | undefined;
  importDataDialogIsOpen: boolean;
  deletionDialogIsOpen: boolean;
  changes: {
    start_date_name: string;
    stop_date_name: string;
  };
};

type ErrorMessages = {
  termStartDateName: string[];
  termStopDateName: string[];
};

const Term = (props: Props): JSX.Element => {
  const dispatch = useDispatch();
  const selectedTerms = useSelector(terms.selectors.selectAll);
  const selectableTerms = selectedTerms.filter(
    (term) => term.id !== props.term.id && term.is_enabled
  );
  const selectedTermId =
    selectableTerms.length > 0
      ? selectableTerms[selectableTerms.length - 1].id
      : undefined;
  const [state, updateState] = useImmer<State>({
    changes: {
      start_date_name: props.term.start_date_name,
      stop_date_name: props.term.stop_date_name,
    },
    deletionDialogIsOpen: false,
    expanded: false,
    importDataDialogIsOpen: false,
    selectedTermId,
  });
  React.useEffect(
    () =>
      updateState((state) => {
        state.selectedTermId = selectedTermId;
        state.changes.start_date_name = props.term.start_date_name;
        state.changes.stop_date_name = props.term.stop_date_name;
      }),
    [
      selectedTermId,
      props.term.start_date_name,
      props.term.stop_date_name,
      updateState,
    ]
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
  };
  const handleChangeTermIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      terms.update({
        changes: {
          is_enabled: event.target.checked,
        },
        id: props.term.id,
      })
    );
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
    updateState((state) => {
      state.changes.start_date_name = event.target.value;
    });
  };
  const handleBlurTermStartDateName = () => {
    dispatch(
      terms.update({
        changes: {
          start_date_name: state.changes.start_date_name,
        },
        id: props.term.id,
      })
    );
  };
  const handleChangeTermStopDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.stop_date_name = event.target.value;
    });
  };
  const handleBlurTermStopDateName = () => {
    dispatch(
      terms.update({
        changes: {
          stop_date_name: state.changes.stop_date_name,
        },
        id: props.term.id,
      })
    );
  };
  const handleClickOpenImportDataDialog = () => {
    updateState((state) => {
      state.importDataDialogIsOpen = true;
    });
  };
  const handleClickCloseImportDataDialog = () => {
    updateState((state) => {
      state.importDataDialogIsOpen = false;
    });
  };
  const handleChangeTermId = (event: React.ChangeEvent<HTMLInputElement>) => {
    updateState((state) => {
      state.selectedTermId = parseInt(event.target.value, 10);
    });
  };
  const handleClickImportData = () => {
    updateState((state) => {
      state.importDataDialogIsOpen = false;
    });
    dispatch(
      all.importData({
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        from_term_id: state.selectedTermId!,
        into_term_id: props.term.id,
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
  const handleClickDeleteTerm = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(all.removeTerm(props.term.id));
  };
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
            <ExpandMoreButton
              expanded={state.expanded}
              onClick={handleClickExpand}
              aria-expanded={state.expanded}
              size="large"
            />
          }
          title={<TermName term={props.term} />}
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
                  value={state.changes.start_date_name}
                  onChange={handleChangeTermStartDateName}
                  onBlur={handleBlurTermStartDateName}
                  fullWidth={true}
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
                  value={state.changes.stop_date_name}
                  onChange={handleChangeTermStopDateName}
                  onBlur={handleBlurTermStopDateName}
                  fullWidth={true}
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
      {state.selectedTermId === undefined ? (
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
            {state.selectedTermId === undefined && (
              <DialogContentText>有効な他の期間がありません</DialogContentText>
            )}
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
                <Typography>
                  <TermName term={props.term} />
                </Typography>
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
                      <TermName term={term} />
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
              <Typography>
                <TermName term={props.term} />
              </Typography>
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
};

export default Term;
