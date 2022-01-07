import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { Group } from "../../modules/groups";
import LineThrough from "../parts/LineThrough";

type Props = { group: Group };

// eslint-disable-next-line react/display-name
const GroupName = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <LineThrough line={!props.group.is_enabled}>
      {props.group.name || t("（{{arg0}}未入力）", { arg0: t("グループ名") })}
    </LineThrough>
  );
});

export default GroupName;

// eslint-disable-next-line react/display-name
export const GroupNameLink = React.memo(
  (props: Props): JSX.Element => (
    <Link to={`/terms/${props.group.term_id}/groups#group-${props.group.id}`}>
      <GroupName group={props.group} />
    </Link>
  )
);
