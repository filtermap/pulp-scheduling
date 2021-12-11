import Button from "@mui/material/Button";
import { styled } from "@mui/material/styles";
import Card from "@mui/material/Card";
import CardActions from "@mui/material/CardActions";
import CardContent from "@mui/material/CardContent";
import CardHeader from "@mui/material/CardHeader";
import Checkbox from "@mui/material/Checkbox";
import Collapse from "@mui/material/Collapse";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import FormControl from "@mui/material/FormControl";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormGroup from "@mui/material/FormGroup";
import FormLabel from "@mui/material/FormLabel";
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
import * as group_members from "../modules/group_members";
import * as groups from "../modules/groups";
import * as constraints1 from "../modules/constraints1";
import * as constraints2 from "../modules/constraints2";
import * as kinmus from "../modules/kinmus";
import * as members from "../modules/members";

const PREFIX = "Group";

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
  group: groups.Group;
};

type State = {
  expanded: boolean;
  deletionDialogIsOpen: boolean;
};

type ErrorMessages = {
  groupName: string[];
};

function Group(props: Props): JSX.Element {
  const dispatch = useDispatch();
  const selectedMembers = useSelector(members.selectors.selectAll);
  const selectedGroupMembers = useSelector(group_members.selectors.selectAll);
  const selectedConstraints1 = useSelector(constraints1.selectors.selectAll);
  const selectedConstraints2 = useSelector(constraints2.selectors.selectAll);
  const selectedKinmus = useSelector(kinmus.selectors.selectAll);
  const membersInTerm = selectedMembers.filter(
    ({ term_id }) => term_id === props.group.term_id
  );
  const memberIdsInTerm = new Set(membersInTerm.map(({ id }) => id));
  const groupMembersInTerm = selectedGroupMembers.filter(({ member_id }) =>
    memberIdsInTerm.has(member_id)
  );
  const constraints1InTerm = selectedConstraints1.filter(
    ({ term_id }) => term_id === props.group.term_id
  );
  const constraints2InTerm = selectedConstraints2.filter(
    ({ term_id }) => term_id === props.group.term_id
  );
  const kinmusInTerm = selectedKinmus.filter(
    ({ term_id }) => term_id === props.group.term_id
  );
  const [state, setState] = React.useState<State>({
    deletionDialogIsOpen: false,
    expanded: false,
  });
  const handleClickExpand = () => {
    setState((state) => ({ ...state, expanded: !state.expanded }));
  };
  const handleChangeGroupIsEnabled = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      groups.update({
        id: props.group.id,
        changes: {
          is_enabled: event.target.checked,
        },
      })
    );
  };
  const validate = (groupName: string): ErrorMessages => {
    const errorMessages: ErrorMessages = {
      groupName: [],
    };
    if (groupName === "") {
      errorMessages.groupName.push("グループ名を入力してください");
    }
    return errorMessages;
  };
  const handleChangeGroupName = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    dispatch(
      groups.update({
        id: props.group.id,
        changes: {
          name: event.target.value,
        },
      })
    );
  };
  const handleChangeGroupMember = (memberId: number) => {
    return (event: React.ChangeEvent<HTMLInputElement>) => {
      if (event.target.checked) {
        dispatch(
          group_members.add({
            group_id: props.group.id,
            member_id: memberId,
          })
        );
        return;
      }
      dispatch(
        group_members.remove({
          group_id: props.group.id,
          member_id: memberId,
        })
      );
    };
  };
  const handleClickOpenDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: true }));
  };
  const handleCloseDeletionDialog = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
  };
  const handleClickDeleteGroup = () => {
    setState((state) => ({ ...state, deletionDialogIsOpen: false }));
    dispatch(all.deleteGroup(props.group.id));
  };
  const groupConstraints1 = constraints1InTerm.filter(
    (c) => c.group_id === props.group.id
  );
  const groupConstraints2 = constraints2InTerm.filter(
    (c) => c.group_id === props.group.id
  );
  const errorMessages = validate(props.group.name);
  return (
    <Root>
      <Card>
        <CardHeader
          avatar={
            <Switch
              checked={props.group.is_enabled}
              onChange={handleChangeGroupIsEnabled}
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
          title={props.group.name}
          titleTypographyProps={{
            variant: "h5",
          }}
          subheader={groupMembersInTerm
            .filter((group_member) => group_member.group_id === props.group.id)
            .map(
              (group_member) =>
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                membersInTerm.find(
                  (member) => member.id === group_member.member_id
                )!.name
            )
            .join(", ")}
          subheaderTypographyProps={{
            variant: "body2",
          }}
        />
        <Collapse in={state.expanded} timeout="auto" unmountOnExit={true}>
          <CardContent>
            <Grid container={true} spacing={1}>
              <Grid item={true} xs={12}>
                <TextField
                  label="グループ名"
                  defaultValue={props.group.name}
                  onChange={handleChangeGroupName}
                  fullWidth={true}
                  error={errorMessages.groupName.length > 0}
                  FormHelperTextProps={{
                    // @ts-ignore: https://github.com/mui-org/material-ui/issues/20360
                    component: "div",
                  }}
                  helperText={errorMessages.groupName.map((message) => (
                    <div key={message}>{message}</div>
                  ))}
                />
              </Grid>
              <Grid item={true} xs={12}>
                <FormControl fullWidth={true}>
                  <FormLabel>グループに所属する職員</FormLabel>
                  <FormGroup>
                    {membersInTerm.map((member) => (
                      <FormControlLabel
                        key={member.id}
                        label={member.name}
                        control={
                          <Checkbox
                            checked={groupMembersInTerm.some(
                              (group_member) =>
                                group_member.group_id === props.group.id &&
                                group_member.member_id === member.id
                            )}
                            onChange={handleChangeGroupMember(member.id)}
                            color="primary"
                          />
                        }
                      />
                    ))}
                  </FormGroup>
                </FormControl>
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
        <DialogTitle>グループの削除</DialogTitle>
        <DialogContent>
          <Grid container={true} spacing={1}>
            <Grid item={true} xs={12}>
              <DialogContentText>このグループを削除します</DialogContentText>
              <Typography>{props.group.name}</Typography>
              <Typography variant="caption">
                {groupMembersInTerm
                  .filter(
                    (group_member) => group_member.group_id === props.group.id
                  )
                  .map(
                    (group_member) =>
                      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                      membersInTerm.find(
                        (member) => member.id === group_member.member_id
                      )!.name
                  )
                  .join(", ")}
              </Typography>
            </Grid>
            <Grid item={true} xs={12}>
              {(groupConstraints1.length > 0 ||
                groupConstraints2.length > 0) && (
                <DialogContentText>以下の条件も削除されます</DialogContentText>
              )}
              {groupConstraints1.map((c) => (
                <Typography key={`constraint1_${c.id}`}>{`${
                  c.start_date_name
                }から${c.stop_date_name}までの${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  kinmusInTerm.find(({ id }) => id === c.kinmu_id)!.name
                }に${props.group.name}から${
                  c.min_number_of_assignments
                }人以上の職員を割り当てる`}</Typography>
              ))}
              {groupConstraints2.map((c) => (
                <Typography key={`constraint2_${c.id}`}>{`${
                  c.start_date_name
                }から${c.stop_date_name}までの${
                  // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                  kinmusInTerm.find(({ id }) => id === c.kinmu_id)!.name
                }に${props.group.name}から${
                  c.max_number_of_assignments
                }人以下の職員を割り当てる`}</Typography>
              ))}
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button color="primary" onClick={handleClickDeleteGroup}>
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

export default Group;
