import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { Member } from "../../modules/members";
import LineThrough from "../parts/LineThrough";

type Props = { member: Member };

// eslint-disable-next-line react/display-name
const MemberName = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <LineThrough line={!props.member.is_enabled}>
      {props.member.name || t("（{{arg0}}未入力）", { arg0: t("職員名") })}
    </LineThrough>
  );
});

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
