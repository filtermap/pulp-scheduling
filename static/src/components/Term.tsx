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
import { useTranslation } from "react-i18next";
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

// eslint-disable-next-line react/display-name
const Term = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
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
  const handleChangeTermStartDateName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    updateState((state) => {
      state.changes.start_date_name = event.target.value;
    });
  };
  const handleBlurTermStartDateName = () => {
    if (state.changes.start_date_name === props.term.start_date_name) return;
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
    if (state.changes.stop_date_name === props.term.stop_date_name) return;
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
  const termStartDate = utils.stringToDate(props.term.start_date_name);
  const termStartDateIsEnabled = !!termStartDate;
  const termStopDate = utils.stringToDate(props.term.stop_date_name);
  const termStopDateIsEnabled = !!termStopDate;
  const termStartDateAndStopDateAreEnabled =
    (termStartDate && termStopDate && termStartDate <= termStopDate) || false;
  const relativesAreEnabled =
    termStartDateIsEnabled &&
    termStopDateIsEnabled &&
    termStartDateAndStopDateAreEnabled;
  const errorMessages = terms.getErrorMessages(t, { term: props.term });
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.term.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
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
                <TextField
                  label={t("開始日")}
                  type="date"
                  value={state.changes.start_date_name}
                  onChange={handleChangeTermStartDateName}
                  onBlur={handleBlurTermStartDateName}
                  fullWidth={true}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={errorMessages.start_date_name.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.start_date_name.map((message) => (
                    <div key={message}>{message}</div>
                  ))}
                />
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  label={t("終了日")}
                  type="date"
                  value={state.changes.stop_date_name}
                  onChange={handleChangeTermStopDateName}
                  onBlur={handleBlurTermStopDateName}
                  fullWidth={true}
                  margin="normal"
                  InputLabelProps={{
                    shrink: true,
                  }}
                  error={errorMessages.stop_date_name.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.stop_date_name.map((message) => (
                    <div key={message}>{message}</div>
                  ))}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions disableSpacing={true}>
            <Button size="small" onClick={handleClickOpenImportDataDialog}>
              {t("インポート")}
            </Button>
            <Button size="small" onClick={handleClickOpenDeletionDialog}>
              {t("削除")}
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
            {t("他の期間からデータと条件をインポートできません")}
          </DialogTitle>
          <DialogContent>
            {state.selectedTermId === undefined && (
              <DialogContentText>
                {t("有効な他の期間がありません")}
              </DialogContentText>
            )}
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleClickCloseImportDataDialog}>
              {t("閉じる")}
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
          <DialogTitle>{t("他の期間からデータと条件をインポート")}</DialogTitle>
          <DialogContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <DialogContentText>
                  {t("この期間に他の期間からデータと条件をインポートします")}
                </DialogContentText>
                <Typography>
                  <TermName term={props.term} />
                </Typography>
              </Grid>
              <Grid item={true} xs={12}>
                <TextField
                  select={true}
                  label={t("期間")}
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
                  {t("選択した期間から次のデータと条件をインポートします")}
                  <br />- {t("職員")}
                  <br />- {t("勤務")}
                  <br />- {t("グループ")}
                  <br />- {t("すべての条件")}
                  <br />
                </DialogContentText>
              </Grid>
            </Grid>
          </DialogContent>
          <DialogActions>
            <Button color="primary" onClick={handleClickImportData}>
              {t("インポート")}
            </Button>
            <Button color="primary" onClick={handleClickCloseImportDataDialog}>
              {t("閉じる")}
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
        <DialogTitle>{t("{{arg0}}の削除", { arg0: t("期間") })}</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <DialogContentText>
                {t("この{{arg0}}を削除します", { arg0: t("期間") })}
              </DialogContentText>
              <Typography>
                <TermName term={props.term} />
              </Typography>
            </Grid>
            <Grid item={true} xs={12}>
              <DialogContentText>
                {t(
                  "期間中のすべての勤務表、職員、勤務、グループ、条件も削除されます"
                )}
              </DialogContentText>
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteTerm}>
            {t("削除")}
          </Button>
          <Button color="primary" onClick={handleCloseDeletionDialog}>
            {t("閉じる")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
});

export default Term;
