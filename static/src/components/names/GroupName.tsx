import * as React from "react";

import type { Group } from "../../modules/groups";
import LineThrough from "../parts/LineThrough";

type Props = { group: Group };

const GroupName = (props: Props): JSX.Element => (
  <LineThrough line={!props.group.is_enabled}>{props.group.name}</LineThrough>
);

export default GroupName;
