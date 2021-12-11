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
import MenuItem from "@material-ui/core/MenuItem";
import { Theme, WithStyles } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Switch from "@material-ui/core/Switch";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/Typography";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import classnames from "classnames";
import * as React from "react";
import { useDispatch, useSelector, shallowEqual } from "react-redux";
import { StateWithHistory } from "redux-undo";
import * as all from "../modules/all";
import * as constraint0_kinmus from "../modules/constraint0_kinmus";
import * as constraints0 from "../modules/constraints0";
import * as utils from "../utils";

type Props = {
  constraint0: constraints0.Constraint0;
} & WithStyles<typeof styles>;

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

function selector(state: StateWithHistory<all.State>) {
  return {
    constraint0_kinmus: state.present.constraint0_kinmus,
    kinmus: state.present.kinmus,
  };
}

function Constraint0(props: Props) {
  const dispatch = useDispatch();
  const selected = useSelector(selector, shallowEqual);
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
    _: React.ChangeEvent<HTMLInputElement>,
    checked: boolean
  ) => {
    dispatch(
      constraints0.updateConstraint0IsEnabled(props.constraint0.id, checked)
    );
  };
  const handleClickCreateConstraint0Kinmu = (sequence_number: number) => {
    return () => {
      const kinmu_id = kinmusInTerm[0].id;
      dispatch(
        constraint0_kinmus.createConstraint0Kinmu(
          props.constraint0.id,
          sequence_number,
          kinmu_id
        )
      );
    };
  };
  const handleChangeConstraint0KinmuKinmuId = (
    constraint0_kinmu_id: number
  ) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      dispatch(
        constraint0_kinmus.updateConstraint0KinmuKinmuId(
          constraint0_kinmu_id,
          parseInt(event.target.value, 10)
        )
      );
    };
  };
  const handleClickDeleteConstraint0Kinmu = (constraint0_kinmu_id: number) => {
    return () => {
      dispatch(all.deleteConstraint0Kinmu(constraint0_kinmu_id));
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
    dispatch(all.deleteConstraint0(props.constraint0.id));
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
          [props.classes.lineThrough]: !kinmu.is_enabled,
        })}
      >
        {kinmu.name}
      </span>
    )),
    ", "
  );
  return (
    <>
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
                                [props.classes.lineThrough]: !kinmu.is_enabled,
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
    lineThrough: {
      "&::-webkit-datetime-edit-fields-wrapper": {
        textDecoration: "line-through",
      },
      textDecoration: "line-through",
    },
  });

export default withStyles(styles)(Constraint0);
