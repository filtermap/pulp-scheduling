import Grid from "@material-ui/core/Grid";
import { WithStyles } from "@material-ui/core/styles";
import createStyles from "@material-ui/core/styles/createStyles";
import withStyles from "@material-ui/core/styles/withStyles";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import * as React from "react";
import { connect } from "react-redux";
import { Dispatch } from "redux";
import { StateWithHistory } from "redux-undo";
import * as all from "../modules/all";
import * as terms from "../modules/terms";
import Term from "./Term";

type Props = {
  dispatch: Dispatch;
  terms: terms.Term[];
} & WithStyles<typeof styles>;

function Terms(props: Props) {
  return (
    <div className={props.classes.gridFrame}>
      <Grid container={true} spacing={8}>
        <Grid item={true} xs={12}>
          <Toolbar>
            <Typography variant="subtitle1">期間</Typography>
          </Toolbar>
        </Grid>
        {props.terms.map((term) => (
          <Grid key={term.id} item={true} xs={12}>
            <Term term={term} />
          </Grid>
        ))}
      </Grid>
    </div>
  );
}

function mapStateToProps(state: StateWithHistory<all.State>) {
  return {
    terms: state.present.terms,
  };
}

const styles = createStyles({
  gridFrame: {
    padding: 8,
  },
});

export default connect(mapStateToProps)(withStyles(styles)(Terms));
