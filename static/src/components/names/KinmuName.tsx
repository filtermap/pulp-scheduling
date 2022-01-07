import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { Kinmu } from "../../modules/kinmus";
import LineThrough from "../parts/LineThrough";

type Props = { kinmu: Kinmu };

// eslint-disable-next-line react/display-name
const KinmuName = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <LineThrough line={!props.kinmu.is_enabled}>
      {props.kinmu.name || t("（{{arg0}}未入力）", { arg0: t("勤務名") })}
    </LineThrough>
  );
});

export default KinmuName;

// eslint-disable-next-line react/display-name
export const KinmuNameLink = React.memo(
  (props: Props): JSX.Element => (
    <Link to={`/terms/${props.kinmu.term_id}/kinmus#kinmu-${props.kinmu.id}`}>
      <KinmuName kinmu={props.kinmu} />
    </Link>
  )
);
