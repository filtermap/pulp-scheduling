import * as React from "react";

import type { Schedule } from "../../modules/schedules";

type Props = { schedule: Schedule };

// eslint-disable-next-line react/display-name
const ScheduleName = React.memo(
  (props: Props): JSX.Element => <>勤務表{props.schedule.id}</>
);

export default ScheduleName;
