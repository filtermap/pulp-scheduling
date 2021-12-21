import * as React from "react";

import type { Member } from "../../modules/members";
import LineThrough from "../parts/LineThrough";

type Props = { member: Member };

const MemberName = (props: Props): JSX.Element => (
  <LineThrough line={!props.member.is_enabled}>{props.member.name}</LineThrough>
);

export default MemberName;
