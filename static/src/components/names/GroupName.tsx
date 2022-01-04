import * as React from "react";
import { Link } from "react-router-dom";

import type { Group } from "../../modules/groups";
import LineThrough from "../parts/LineThrough";

type Props = { group: Group };

// eslint-disable-next-line react/display-name
const GroupName = React.memo(
  (props: Props): JSX.Element => (
    <LineThrough line={!props.group.is_enabled}>{props.group.name}</LineThrough>
  )
);

export default GroupName;

// eslint-disable-next-line react/display-name
export const GroupNameLink = React.memo(
  (props: Props): JSX.Element => (
    <Link to={`/terms/${props.group.term_id}/groups#group-${props.group.id}`}>
      <GroupName group={props.group} />
    </Link>
  )
);
