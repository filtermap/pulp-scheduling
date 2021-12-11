import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardActions from "@material-ui/core/CardActions";
import CardContent from "@material-ui/core/CardContent";
import CardHeader from "@material-ui/core/CardHeader";
import Collapse from "@material-ui/core/Collapse";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Grid from "@material-ui/core/Grid";
import IconButton from "@material-ui/core/IconButton";
import { Theme, WithStyles } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Table from "@material-ui/core/Table";
import TableBody from "@material-ui/core/TableBody";
import TableCell from "@material-ui/core/TableCell";
import TableHead from "@material-ui/core/TableHead";
import TableRow from "@material-ui/core/TableRow";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classnames from "classnames";
import * as iconv from "iconv-lite";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import { StateWithHistory } from "redux-undo";
import * as all from "../modules/all";
import * as schedules from "../modules/schedules";
import * as utils from "../utils";

type Props = {
  schedule: schedules.Schedule;
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

function sortDateNames(dateNames: string[]): string[] {
  return [...dateNames].sort(
    (a, b) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      utils.stringToDate(a)!.getTime() - utils.stringToDate(b)!.getTime()
  );
}

function selector(state: StateWithHistory<all.State>) {
  return {
    assignments: state.present.assignments,
    kinmus: state.present.kinmus,
    members: state.present.members,
  };
}

function Schedule(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(selector, shallowEqual);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const assignmentsInTerm = selected.assignments.filter(
    ({ schedule_id }) => schedule_id === props.schedule.id
  );
  const membersInTerm = selected.members.filter(
    ({ term_id }) => term_id === props.schedule.term_id
  );
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === props.schedule.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleClickOpenDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: true }));
  };
  const handleCloseDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
  };
  const handleClickDeleteSchedule = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(all.deleteSchedule(props.schedule.id));
  };
  const handleClickExportToCSV = async () => {
    const assignments_by_schedule_id = assignmentsInTerm.filter(
      (assignment) => assignment.schedule_id === props.schedule.id
    );
    const csv = iconv.encode(
      (
        await utils.sendJSONRPCRequest("download_csv", [
          assignments_by_schedule_id,
          membersInTerm,
          kinmusInTerm,
        ])
      ).result,
      "Shift_JIS"
    );
    const a = document.createElement("a");
    a.download = `勤務表${props.schedule.id}.csv`;
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.click();
  };
  const schedule_assignments = assignmentsInTerm.filter(
    (assignment) => assignment.schedule_id === props.schedule.id
  );
  const schedule_date_names = sortDateNames(
    Array.from(new Set(schedule_assignments.map(({ date_name }) => date_name)))
  );
  const schedule_member_ids = Array.from(
    new Set(schedule_assignments.map(({ member_id }) => member_id))
  );
  const schedule_members = membersInTerm.filter(({ id }) =>
    schedule_member_ids.includes(id)
  );
  const schedule_kinmu_ids = new Set(
    schedule_assignments.map(({ kinmu_id }) => kinmu_id)
  );
  const schedule_kinmus = kinmusInTerm.filter(({ id }) =>
    schedule_kinmu_ids.has(id)
  );
  return (
    <>
      <Card>
        <CardHeader
          action={
            <>
              <IconButton
                className={classnames(props.classes.expand, {
                  [props.classes.expandOpen]: state.expanded,
                })}
                onClick={handleClickExpand}
                aria-expanded={state.expanded}
              >
                <ExpandMoreIcon />
              </IconButton>
            </>
          }
          title={`勤務表${props.schedule.id}`}
        />
        <Collapse in={state.expanded} timeout="auto" unmountOnExit={true}>
          <CardContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <div className={props.classes.tableWrapper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          size="small"
                          className={props.classes.leftTopHeaderCell}
                        >
                          \
                        </TableCell>
                        {schedule_date_names.map((date_name) => (
                          <TableCell
                            key={date_name}
                            size="small"
                            className={props.classes.topHeaderCell}
                          >
                            {date_name}
                          </TableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {schedule_members.map((member) => {
                        const schedule_member_assignments =
                          schedule_assignments.filter(
                            (assignment) => assignment.member_id === member.id
                          );
                        return (
                          <TableRow key={member.id}>
                            <TableCell
                              size="small"
                              className={props.classes.leftHeaderCell}
                            >
                              {member.name}
                            </TableCell>
                            {schedule_date_names.map((date_name) => (
                              <TableCell size="small" key={date_name}>
                                {
                                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                  schedule_kinmus.find(
                                    (kinmu) =>
                                      kinmu.id ===
                                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                      schedule_member_assignments.find(
                                        (assignment) =>
                                          assignment.date_name === date_name
                                      )!.kinmu_id
                                  )!.name
                                }
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </div>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions disableSpacing={true}>
            <Button size="small" onClick={handleClickOpenDeletionDialog}>
              削除
            </Button>
            <Button size="small" onClick={handleClickExportToCSV}>
              CSV出力
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
        <DialogTitle>勤務表の削除</DialogTitle>
        <DialogContent>
          <DialogContentText>この勤務表を削除します</DialogContentText>
          <Typography>{`勤務表${props.schedule.id}`}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteSchedule}>
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
    leftHeaderCell: {
      background: "white",
      left: 0,
      position: "sticky",
    },
    leftTopHeaderCell: {
      background: "white",
      left: 0,
      position: "sticky",
      top: 0,
      zIndex: 2,
    },
    tableWrapper: {
      maxHeight: "calc(100vh - 200px)",
      overflow: "auto",
    },
    topHeaderCell: {
      background: "white",
      position: "sticky",
      top: 0,
      zIndex: 1,
    },
  });

export default withStyles(styles)(Schedule);
