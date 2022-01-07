import * as React from "react";
import { Link } from "react-router-dom";

import { m } from "../../messages";
import type { Schedule } from "../../modules/schedules";

type Props = { schedule: Schedule };

// eslint-disable-next-line react/display-name
const ScheduleName = React.memo(
  (props: Props): JSX.Element => <>{m["勤務表arg0"](props.schedule.id)}</>
);

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
