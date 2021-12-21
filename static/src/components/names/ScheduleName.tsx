import * as React from "react";

import type { Schedule } from "../../modules/schedules";

type Props = { schedule: Schedule };

const ScheduleName = (props: Props): JSX.Element => (
  <>勤務表{props.schedule.id}</>
);

export default ScheduleName;
