import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
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
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import classnames from "classnames";
import * as iconv from "iconv-lite";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as all from "../modules/all";
import * as schedules from "../modules/schedules";
import * as utils from "../utils";
import * as assignments from "../modules/assignments";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";

const PREFIX = "Schedule";

const classes = {
  expand: `${PREFIX}-expand`,
  expandOpen: `${PREFIX}-expandOpen`,
  leftHeaderCell: `${PREFIX}-leftHeaderCell`,
  leftTopHeaderCell: `${PREFIX}-leftTopHeaderCell`,
  tableWrapper: `${PREFIX}-tableWrapper`,
  topHeaderCell: `${PREFIX}-topHeaderCell`,
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled("div")(({ theme }) => ({
  [`& .${classes.expand}`]: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest,
    }),
  },
  [`& .${classes.expandOpen}`]: {
    transform: "rotate(180deg)",
  },
  [`& .${classes.leftHeaderCell}`]: {
    background: "white",
    left: 0,
    position: "sticky",
  },
  [`& .${classes.leftTopHeaderCell}`]: {
    background: "white",
    left: 0,
    position: "sticky",
    top: 0,
    zIndex: 2,
  },
  [`& .${classes.tableWrapper}`]: {
    maxHeight: "calc(100vh - 200px)",
    overflow: "auto",
  },
  [`& .${classes.topHeaderCell}`]: {
    background: "white",
    position: "sticky",
    top: 0,
    zIndex: 1,
  },
}));

type Props = {
  schedule: schedules.Schedule;
};

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

function Schedule(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selectedAssignments = useSelector(assignments.selectors.selectAll);
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const assignmentsInTerm = selectedAssignments.filter(
    ({ schedule_id }) => schedule_id === props.schedule.id
  );
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === props.schedule.term_id
  );
  const kinmusInTerm = selectedKinmus.filter(
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
    dispatch(all.removeSchedule(props.schedule.id));
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
    <Root>
      <Card>
        <CardHeader
          action={
            <>
              <IconButton
                className={classnames(classes.expand, {
                  [classes.expandOpen]: state.expanded,
                })}
                onClick={handleClickExpand}
                aria-expanded={state.expanded}
                size="large"
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
                <div className={classes.tableWrapper}>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell
                          size="small"
                          className={classes.leftTopHeaderCell}
                        >
                          \
                        </TableCell>
                        {schedule_date_names.map((date_name) => (
                          <TableCell
                            key={date_name}
                            size="small"
                            className={classes.topHeaderCell}
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
                              className={classes.leftHeaderCell}
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
    </Root>
  );
}

export default Schedule;
