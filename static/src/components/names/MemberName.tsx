import * as React from "react";
import { Link } from "react-router-dom";

import { m } from "../../messages";
import type { Member } from "../../modules/members";
import LineThrough from "../parts/LineThrough";

type Props = { member: Member };

// eslint-disable-next-line react/display-name
const MemberName = React.memo(
  (props: Props): JSX.Element => (
    <LineThrough line={!props.member.is_enabled}>
      {props.member.name || m["（arg0未入力）"](m["職員名"])}
    </LineThrough>
  )
);

export default MemberName;

// eslint-disable-next-line react/display-name
export const MemberNameLink = React.memo(
  (props: Props): JSX.Element => (
    <Link
      to={`/terms/${props.member.term_id}/members#member-${props.member.id}`}
    >
      <MemberName member={props.member} />
    </Link>
  )
);
