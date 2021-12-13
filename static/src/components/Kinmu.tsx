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
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import classnames from "classnames";
import * as React from "react";
import { useDispatch, useSelector } from "react-redux";
import * as all from "../modules/all";
import * as kinmus from "../modules/kinmus";
import * as assignments from "../modules/assignments";
import * as constraint0_kinmus from "../modules/constraint0_kinmus";
import * as constraints1 from "../modules/constraints1";
import * as constraints10 from "../modules/constraints10";
import * as constraints2 from "../modules/constraints2";
import * as constraints3 from "../modules/constraints3";
import * as constraints4 from "../modules/constraints4";
import * as constraints5 from "../modules/constraints5";
import * as constraints6 from "../modules/constraints6";
import * as constraints7 from "../modules/constraints7";
import * as constraints8 from "../modules/constraints8";
import * as constraints9 from "../modules/constraints9";
import * as groups from "../modules/groups";
import * as members from "../modules/members";

const PREFIX = "Kinmu";

const classes = {
  expand: `${PREFIX}-expand`,
  expandOpen: `${PREFIX}-expandOpen`,
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
}));

type Props = {
  kinmu: kinmus.Kinmu;
};

type State = {
  deletionDialogIsOpen: boolean;
  expanded: boolean;
};

type ErrorMessages = {
  kinmuName: string[];
};

function Kinmu(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selectedAssignments = useSelector(assignments.selectors.selectAll);
  const selectedConstraint0Kinmus = useSelector(
    constraint0_kinmus.selectors.selectAll
  );
  const selectedConstraints1 = useSelector(constraints1.selectors.selectAll);
  const selectedConstraints10 = useSelector(constraints10.selectors.selectAll);
  const selectedConstraints2 = useSelector(constraints2.selectors.selectAll);
  const selectedConstraints3 = useSelector(constraints3.selectors.selectAll);
  const selectedConstraints4 = useSelector(constraints4.selectors.selectAll);
  const selectedConstraints5 = useSelector(constraints5.selectors.selectAll);
  const selectedConstraints6 = useSelector(constraints6.selectors.selectAll);
  const selectedConstraints7 = useSelector(constraints7.selectors.selectAll);
  const selectedConstraints8 = useSelector(constraints8.selectors.selectAll);
  const selectedConstraints9 = useSelector(constraints9.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
  const selectedGroupById = useSelector(groups.selectors.selectEntities);
  const selectedMemberById = useSelector(members.selectors.selectEntities);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const kinmuIdsInTerm = new Set(kinmusInTerm.map(({ id }) => id));
  const assignmentsInTerm = selectedAssignments.filter(({ kinmu_id }) =>
    kinmuIdsInTerm.has(kinmu_id)
  );
  const constraint0KinmusInTerm = selectedConstraint0Kinmus.filter(
    ({ kinmu_id }) => kinmuIdsInTerm.has(kinmu_id)
  );
  const constraints1InTerm = selectedConstraints1.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints2InTerm = selectedConstraints2.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints3InTerm = selectedConstraints3.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints4InTerm = selectedConstraints4.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints5InTerm = selectedConstraints5.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints6InTerm = selectedConstraints6.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints7InTerm = selectedConstraints7.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints8InTerm = selectedConstraints8.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints9InTerm = selectedConstraints9.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const constraints10InTerm = selectedConstraints10.filter(
    ({ term_id }) => term_id === props.kinmu.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeKinmuIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      kinmus.update({
        id: props.kinmu.id,
        changes: {
          is_enabled: event.target.checked,
        },
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
      kinmus.update({
        id: props.kinmu.id,
        changes: {
          name: event.target.value,
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
  const handleClickDeleteKinmu = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(all.removeKinmu(props.kinmu.id));
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
    <Root>
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
              className={classnames(classes.expand, {
                [classes.expandOpen]: state.expanded,
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
                    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                    .map(({ kinmu_id }) => selectedKinmuById[kinmu_id]!.name)
                    .join(", ")}
                </Typography>
              ))}
              {kinmuConstraints1.map((c) => (
                <Typography key={`constraint1_${c.id}`}>{`${
                  c.start_date_name
                }から${c.stop_date_name}までの${props.kinmu.name}に${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  selectedGroupById[c.group_id]!.name
                }から${
                  c.min_number_of_assignments
                }人以上の職員を割り当てる`}</Typography>
              ))}
              {kinmuConstraints2.map((c) => (
                <Typography key={`constraint2_${c.id}`}>{`${
                  c.start_date_name
                }から${c.stop_date_name}までの${props.kinmu.name}に${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  selectedGroupById[c.group_id]!.name
                }から${
                  c.max_number_of_assignments
                }人以下の職員を割り当てる`}</Typography>
              ))}
              {kinmuConstraints3.map((c) => (
                <Typography key={`constraint3_${c.id}`}>{`${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  selectedMemberById[c.member_id]!.name
                }に${props.kinmu.name}を${
                  c.min_number_of_assignments
                }回以上割り当てる`}</Typography>
              ))}
              {kinmuConstraints4.map((c) => (
                <Typography key={`constraint4_${c.id}`}>{`${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  selectedMemberById[c.member_id]!.name
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
                  selectedMemberById[c.member_id]!.name
                }の${c.start_date_name}から${c.stop_date_name}までに${
                  props.kinmu.name
                }を割り当てる`}</Typography>
              ))}
              {kinmuConstraints10.map((c) => (
                <Typography key={`constraint10_${c.id}`}>{`${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  selectedMemberById[c.member_id]!.name
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
    </Root>
  );
}

export default Kinmu;
