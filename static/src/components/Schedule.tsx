import Box from "@mui/material/Box";
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
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Typography from "@mui/material/Typography";
import * as iconv from "iconv-lite";
import * as React from "react";
import { useTranslation } from "react-i18next";
import { useDispatch, useSelector } from "react-redux";
import { useImmer } from "use-immer";

import * as all from "../modules/all";
import * as assignments from "../modules/assignments";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";
import * as schedules from "../modules/schedules";
import * as utils from "../utils";

import { KinmuNameLink } from "./names/KinmuName";
import { MemberNameLink } from "./names/MemberName";
import ScheduleName from "./names/ScheduleName";
import ExpandMoreButton from "./parts/ExpandMoreButton";
import StickyLeftTableCell from "./parts/StickyLeftTableCell";
import StickyLeftTopTableCell from "./parts/StickyLeftTopTableCell";
import StickyTopTableCell from "./parts/StickyTopTableCell";

type Props = {
  schedule: schedules.Schedule;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

const sortDateNames = (dateNames: string[]): string[] =>
  [...dateNames].sort(
    (a, b) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      utils.stringToDate(a)!.getTime() - utils.stringToDate(b)!.getTime()
  );

// eslint-disable-next-line react/display-name
const Schedule = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const selectedAssignments = useSelector(assignments.selectors.selectAll);
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const [state, updateState] = useImmer<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const scheduleAssignments = selectedAssignments.filter(
    ({ schedule_id }) => schedule_id === props.schedule.id
  );
  const scheduleDateNames = sortDateNames(
    Array.from(new Set(scheduleAssignments.map(({ date_name }) => date_name)))
  );
  const scheduleAssignmentMemberIds = new Set(
    scheduleAssignments.map(({ member_id }) => member_id)
  );
  const scheduleMembers = selectedMembers.filter(({ id }) =>
    scheduleAssignmentMemberIds.has(id)
  );
  const scheduleAssignmentKinmuIds = new Set(
    scheduleAssignments.map(({ kinmu_id }) => kinmu_id)
  );
  const scheduleKinmus = selectedKinmus.filter(({ id }) =>
    scheduleAssignmentKinmuIds.has(id)
  );
  const handleClickExpand = () => {
    updateState((state) => {
      state.expanded = !state.expanded;
    });
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
  const handleClickDeleteSchedule = () => {
    updateState((state) => {
      state.deletionDialogIsOpen = false;
    });
    dispatch(all.removeSchedule(props.schedule.id));
  };
  const handleClickExportToCSV = async () => {
    const response = await utils.sendJSONRPCRequest("download_csv", [
      scheduleAssignments,
      scheduleMembers,
      scheduleKinmus,
    ]);
    if ("error" in response) throw new Error(response.error.message);
    const csv = iconv.encode(response.result as string, "Shift_JIS");
    const a = document.createElement("a");
    a.download = `${t("勤務表{{arg0}}", { arg0: props.schedule.id })}.csv`;
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.click();
  };
  return (
    <>
      <Card>
        <CardHeader
          action={
            <>
              <ExpandMoreButton
                expanded={state.expanded}
                onClick={handleClickExpand}
                aria-expanded={state.expanded}
                size="large"
              />
            </>
          }
          title={<ScheduleName schedule={props.schedule} />}
        />
        <Collapse in={state.expanded} timeout="auto" unmountOnExit={true}>
          <CardContent sx={{ padding: 0 }}>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <Box
                  sx={{ maxHeight: "calc(100vh - 200px)", overflow: "auto" }}
                >
                  <Table>
                    <TableHead>
                      <TableRow>
                        <StickyLeftTopTableCell size="small">
                          \
                        </StickyLeftTopTableCell>
                        {scheduleDateNames.map((date_name) => (
                          <StickyTopTableCell key={date_name} size="small">
                            {date_name}
                          </StickyTopTableCell>
                        ))}
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {scheduleMembers.map((member) => {
                        const assignments = scheduleAssignments.filter(
                          (assignment) => assignment.member_id === member.id
                        );
                        return (
                          <TableRow key={member.id}>
                            <StickyLeftTableCell size="small">
                              <MemberNameLink member={member} />
                            </StickyLeftTableCell>
                            {scheduleDateNames.map((date_name) => (
                              <TableCell size="small" key={date_name}>
                                <KinmuNameLink
                                  kinmu={
                                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                    selectedKinmuById[
                                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                                      assignments.find(
                                        (assignment) =>
                                          assignment.date_name === date_name
                                      )!.kinmu_id
                                    ]!
                                  }
                                />
                              </TableCell>
                            ))}
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </Box>
              </Grid>
            </Grid>
          </CardContent>
          <CardActions disableSpacing={true}>
            <Button size="small" onClick={handleClickOpenDeletionDialog}>
              {t("削除")}
            </Button>
            <Button size="small" onClick={handleClickExportToCSV}>
              {t("CSV出力")}
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
        <DialogTitle>{t("{{arg0}}の削除", { arg0: t("勤務表") })}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            {t("この{{arg0}}を削除します", { arg0: t("勤務表") })}
          </DialogContentText>
          <Typography>
            <ScheduleName schedule={props.schedule} />
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteSchedule}>
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

export default Schedule;
