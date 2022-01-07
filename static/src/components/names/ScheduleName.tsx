import * as React from "react";
import { useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

import type { Schedule } from "../../modules/schedules";

type Props = { schedule: Schedule };

// eslint-disable-next-line react/display-name
const ScheduleName = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  return <>{t("勤務表{{arg0}}", { arg0: props.schedule.id })}</>;
});

export default ScheduleName;

// eslint-disable-next-line react/display-name
export const ScheduleNameLink = React.memo(
  (props: Props): JSX.Element => (
    <Link
      to={`/terms/${props.schedule.term_id}/schedules#schedule-${props.schedule.id}`}
    >
      <ScheduleName schedule={props.schedule} />
    </Link>
  )
);
