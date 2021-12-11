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
import IconButton from "@mui/material/IconButton";
import { Theme } from "@mui/material/styles";
import { WithStyles } from "@mui/styles";
import createStyles from "@mui/styles/createStyles";
import withStyles from "@mui/styles/withStyles";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import classnames from "classnames";
import * as React from "react";
import { shallowEqual, useDispatch, useSelector } from "react-redux";
import * as all from "../modules/all";
import * as kinmus from "../modules/kinmus";
import { RootState } from "../modules/store";

type Props = {
  kinmu: kinmus.Kinmu;
} & WithStyles<typeof styles>;

type State = {
  deletionDialogIsOpen: boolean;
  expanded: boolean;
};

type ErrorMessages = {
  kinmuName: string[];
};

function select(state: RootState) {
  return {
    assignments: state.present.assignments,
    constraint0_kinmus: state.present.constraint0_kinmus,
    constraints1: state.present.constraints1,
    constraints10: state.present.constraints10,
    constraints2: state.present.constraints2,
    constraints3: state.present.constraints3,
    constraints4: state.present.constraints4,
    constraints5: state.present.constraints5,
    constraints6: state.present.constraints6,
    constraints7: state.present.constraints7,
    constraints8: state.present.constraints8,
    constraints9: state.present.constraints9,
    groups: state.present.groups,
    kinmus: state.present.kinmus,
    members: state.present.members,
  };
}

function Kinmu(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const kinmuIdsInTerm = new Set(kinmusInTerm.map(({ id }) => id));
  const assignmentsInTerm = selected.assignments.filter(({ kinmu_id }) =>
    kinmuIdsInTerm.has(kinmu_id)
  );
  const constraint0KinmusInTerm = selected.constraint0_kinmus.filter(
    ({ kinmu_id }) => kinmuIdsInTerm.has(kinmu_id)
  );
  const constraints1InTerm = selected.constraints1.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints2InTerm = selected.constraints2.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints3InTerm = selected.constraints3.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints4InTerm = selected.constraints4.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints5InTerm = selected.constraints5.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints6InTerm = selected.constraints6.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints7InTerm = selected.constraints7.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints8InTerm = selected.constraints8.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints9InTerm = selected.constraints9.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints10InTerm = selected.constraints10.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const membersInTerm = selected.members.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const groupsInTerm = selected.groups.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeKinmuIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      kinmus.updateKinmuIsEnabled({
        id: props.kinmu.id,
        is_enabled: event.target.checked,
      })
    );
  };
  const validate = (kinmuName: string): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      kinmuName: [],
    };
    if (kinmuName === "") {
      errorMessages.kinmuName.push("勤務名を入力してください");
    }
    return errorMessages;
  };
  const handleChangeKinmuName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      kinmus.updateKinmuName({
        id: props.kinmu.id,
        name: event.target.value,
      })
    );
  };
  const handleClickOpenDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: true }));
  };
  const handleCloseDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
  };
  const handleClickDeleteKinmu = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(all.deleteKinmu({ id: props.kinmu.id }));
  };
  const kinmuScheduleIds = Array.from(
    new Set(
      assignmentsInTerm
        .filter(({ kinmu_id }) => kinmu_id === props.kinmu.id)
        .map(({ schedule_id }) => schedule_id)
    )
  );
  const kinmuConstraint0Ids = Array.from(
    new Set(
      constraint0KinmusInTerm
        .filter(({ kinmu_id }) => kinmu_id === props.kinmu.id)
        .map(({ constraint0_id }) => constraint0_id)
    )
  );
  const kinmuConstraints1 = constraints1InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints2 = constraints2InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints3 = constraints3InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints4 = constraints4InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints5 = constraints5InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints6 = constraints6InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints7 = constraints7InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints8 = constraints8InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints9 = constraints9InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const kinmuConstraints10 = constraints10InTerm.filter(
    (c) => c.kinmu_id === props.kinmu.id
  );
  const errorMessages = validate(props.kinmu.name);
  return (
    <>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.kinmu.is_enabled}
              onChange={handleChangeKinmuIsEnabled}
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
              size="large"
            >
              <ExpandMoreIcon />
            </IconButton>
          }
          title={props.kinmu.name}
          titleTypographyProps={{
            variant: "h5",
          }}
        />
        <Collapse in={state.expanded} timeout="auto" unmountOnExit={true}>
          <CardContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <TextField
                  label="勤務名"
                  defaultValue={props.kinmu.name}
                  onChange={handleChangeKinmuName}
                  margin="normal"
                  error={errorMessages.kinmuName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.kinmuName.map((message) => (
                    <div key={message}>{message}</div>
                  ))}
                />
              </Grid>
            </Grid>
          </CardContent>
          <CardActions disableSpacing={true}>
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
        <DialogTitle>勤務の削除</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <DialogContentText>この勤務を削除します</DialogContentText>
              <Typography>{props.kinmu.name}</Typography>
            </Grid>
            <Grid item={true} xs={12}>
              {kinmuScheduleIds.length > 0 && (
                <DialogContentText>
                  以下の勤務表も削除されます
                </DialogContentText>
              )}
              {kinmuScheduleIds.map((schedule_id) => (
                <Typography
                  key={schedule_id}
                >{`勤務表${schedule_id}`}</Typography>
              ))}
            </Grid>
            <Grid item={true} xs={12}>
              {(kinmuConstraint0Ids.length > 0 ||
                kinmuConstraints1.length > 0 ||
                kinmuConstraints2.length > 0 ||
                kinmuConstraints3.length > 0 ||
                kinmuConstraints4.length > 0 ||
                kinmuConstraints5.length > 0 ||
                kinmuConstraints6.length > 0 ||
                kinmuConstraints7.length > 0 ||
                kinmuConstraints8.length > 0 ||
                kinmuConstraints9.length > 0 ||
                kinmuConstraints10.length > 0) && (
                <DialogContentText>以下の条件も削除されます</DialogContentText>
              )}
              {kinmuConstraint0Ids.map((c0_id) => (
                <Typography key={`constraint0_${c0_id}`}>
                  {constraint0KinmusInTerm
                    .filter((c0_kinmu) => c0_kinmu.constraint0_id === c0_id)
                    .sort((a, b) => a.sequence_number - b.sequence_number)
                    .map(
                      ({ kinmu_id }) =>
                        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                        kinmusInTerm.find((kinmu) => kinmu.id === kinmu_id)!
                          .name
                    )
                    .join(", ")}
                </Typography>
              ))}
              {kinmuConstraints1.map((c) => (
                <Typography key={`constraint1_${c.id}`}>{`${
                  c.start_date_name
                }から${c.stop_date_name}までの${props.kinmu.name}に${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  groupsInTerm.find((group) => group.id === c.group_id)!.name
                }から${
                  c.min_number_of_assignments
                }人以上の職員を割り当てる`}</Typography>
              ))}
              {kinmuConstraints2.map((c) => (
                <Typography key={`constraint2_${c.id}`}>{`${
                  c.start_date_name
                }から${c.stop_date_name}までの${props.kinmu.name}に${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  groupsInTerm.find((group) => group.id === c.group_id)!.name
                }から${
                  c.max_number_of_assignments
                }人以下の職員を割り当てる`}</Typography>
              ))}
              {kinmuConstraints3.map((c) => (
                <Typography key={`constraint3_${c.id}`}>{`${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  membersInTerm.find((member) => member.id === c.member_id)!
                    .name
                }に${props.kinmu.name}を${
                  c.min_number_of_assignments
                }回以上割り当てる`}</Typography>
              ))}
              {kinmuConstraints4.map((c) => (
                <Typography key={`constraint4_${c.id}`}>{`${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  membersInTerm.find((member) => member.id === c.member_id)!
                    .name
                }に${props.kinmu.name}を${
                  c.max_number_of_assignments
                }回以下割り当てる`}</Typography>
              ))}
              {kinmuConstraints5.map((c) => (
                <Typography
                  key={`constraint5_${c.id}`}
                >{`${props.kinmu.name}の連続日数を${c.min_number_of_days}日以上にする`}</Typography>
              ))}
              {kinmuConstraints6.map((c) => (
                <Typography
                  key={`constraint6_${c.id}`}
                >{`${props.kinmu.name}の連続日数を${c.max_number_of_days}日以下にする`}</Typography>
              ))}
              {kinmuConstraints7.map((c) => (
                <Typography
                  key={`constraint7_${c.id}`}
                >{`${props.kinmu.name}の間隔日数を${c.min_number_of_days}日以上にする`}</Typography>
              ))}
              {kinmuConstraints8.map((c) => (
                <Typography
                  key={`constraint8_${c.id}`}
                >{`${props.kinmu.name}の間隔日数を${c.max_number_of_days}日以下にする`}</Typography>
              ))}
              {kinmuConstraints9.map((c) => (
                <Typography key={`constraint9_${c.id}`}>{`${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  membersInTerm.find((member) => member.id === c.member_id)!
                    .name
                }の${c.start_date_name}から${c.stop_date_name}までに${
                  props.kinmu.name
                }を割り当てる`}</Typography>
              ))}
              {kinmuConstraints10.map((c) => (
                <Typography key={`constraint10_${c.id}`}>{`${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  membersInTerm.find((member) => member.id === c.member_id)!
                    .name
                }の${c.start_date_name}から${c.stop_date_name}までに${
                  props.kinmu.name
                }を割り当てない`}</Typography>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteKinmu}>
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

export default withStyles(styles)(Kinmu);
