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
import MenuItem from "@mui/material/MenuItem";
import Switch from "@mui/material/Switch";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import classnames from "classnames";
import * as React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import * as all from "../modules/all";
import * as constraint0_kinmus from "../modules/constraint0_kinmus";
import * as constraints0 from "../modules/constraints0";
import { RootState } from "../modules/store";
import * as utils from "../utils";

const PREFIX = "Constraint0";

const classes = {
  expand: `${PREFIX}-expand`,
  expandOpen: `${PREFIX}-expandOpen`,
  lineThrough: `${PREFIX}-lineThrough`,
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
  [`& .${classes.lineThrough}`]: {
    "&::-webkit-datetime-edit-fields-wrapper": {
      textDecoration: "line-through",
    },
    textDecoration: "line-through",
  },
}));

type Props = {
  constraint0: constraints0.Constraint0;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

function select(state: RootState) {
  return {
    constraint0_kinmus: state.present.constraint0_kinmus,
    kinmus: state.present.kinmus,
  };
}

function Constraint0(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selected = useSelector(select, shallowEqual);
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const kinmusInTerm = selected.kinmus.filter(
    ({ term_id }) => term_id === props.constraint0.term_id
  );
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeConstraint0IsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      constraints0.updateConstraint0IsEnabled({
        id: props.constraint0.id,
        is_enabled: event.target.checked,
      })
    );
  };
  const handleClickCreateConstraint0Kinmu = (sequence_number: number) => {
    return () => {
      const kinmu_id = kinmusInTerm[0].id;
      dispatch(
        constraint0_kinmus.createConstraint0Kinmu({
          constraint0_id: props.constraint0.id,
          sequence_number,
          kinmu_id,
        })
      );
    };
  };
  const handleChangeConstraint0KinmuKinmuId = (
    constraint0_kinmu_id: number
  ) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        constraint0_kinmus.updateConstraint0KinmuKinmuId({
          id: constraint0_kinmu_id,
          kinmu_id: parseInt(event.target.value, 10),
        })
      );
    };
  };
  const handleClickDeleteConstraint0Kinmu = (constraint0_kinmu_id: number) => {
    return () => {
      dispatch(all.deleteConstraint0Kinmu({ id: constraint0_kinmu_id }));
    };
  };
  const handleClickOpenDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: true }));
  };
  const handleCloseDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
  };
  const handleClickDeleteConstraint0 = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(all.deleteConstraint0({ id: props.constraint0.id }));
  };
  const constraint0Constraint0Kinmus = selected.constraint0_kinmus
    .filter(({ constraint0_id }) => constraint0_id === props.constraint0.id)
    .sort((a, b) => a.sequence_number - b.sequence_number);
  const constraint0Constraint0KinmuKinmus = constraint0Constraint0Kinmus.map(
    ({ kinmu_id }) =>
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      kinmusInTerm.find((kinmu) => kinmu.id === kinmu_id)!
  );
  const relativesAreEnabled = constraint0Constraint0KinmuKinmus.every(
    ({ is_enabled }) => is_enabled
  );
  const title = utils.intersperse(
    constraint0Constraint0KinmuKinmus.map((kinmu) => (
      <span
        key={kinmu.id}
        className={classnames({
          [classes.lineThrough]: !kinmu.is_enabled,
        })}
      >
        {kinmu.name}
      </span>
    )),
    ", "
  );
  return (
    <Root>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.constraint0.is_enabled && relativesAreEnabled}
              disabled={!relativesAreEnabled}
              onChange={handleChangeConstraint0IsEnabled}
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
          title={title}
          titleTypographyProps={{
            variant: "h5",
          }}
        />
        <Collapse in={state.expanded} timeout="auto" unmountOnExit={true}>
          <CardContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <Button
                  size="small"
                  onClick={handleClickCreateConstraint0Kinmu(0)}
                >
                  追加
                </Button>
              </Grid>
              {constraint0Constraint0Kinmus.map((constraint0_kinmu, index) => (
                <React.Fragment key={constraint0_kinmu.id}>
                  <Grid item={true} xs={12}>
                    <TextField
                      select={true}
                      label={`勤務${index + 1}`}
                      value={constraint0_kinmu.kinmu_id}
                      onChange={handleChangeConstraint0KinmuKinmuId(
                        constraint0_kinmu.id
                      )}
                      fullWidth={true}
                    >
                      {kinmusInTerm.map((kinmu) => (
                        <MenuItem key={kinmu.id} value={kinmu.id}>
                          {
                            <span
                              className={classnames({
                                [classes.lineThrough]: !kinmu.is_enabled,
                              })}
                            >
                              {kinmu.name}
                            </span>
                          }
                        </MenuItem>
                      ))}
                    </TextField>
                  </Grid>
                  <Grid item={true} xs={12}>
                    {constraint0Constraint0Kinmus.length > 2 && (
                      <Button
                        size="small"
                        onClick={handleClickDeleteConstraint0Kinmu(
                          constraint0_kinmu.id
                        )}
                      >
                        削除
                      </Button>
                    )}
                  </Grid>
                  <Grid item={true} xs={12}>
                    <Button
                      size="small"
                      onClick={handleClickCreateConstraint0Kinmu(
                        constraint0_kinmu.sequence_number + 1
                      )}
                    >
                      追加
                    </Button>
                  </Grid>
                </React.Fragment>
              ))}
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
        <DialogTitle>連続禁止勤務並びの削除</DialogTitle>
        <DialogContent>
          <DialogContentText>
            この連続禁止勤務並びを削除します
          </DialogContentText>
          <Typography>{title}</Typography>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteConstraint0}>
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

export default Constraint0;
