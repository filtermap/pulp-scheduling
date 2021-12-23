import * as React from "react";

import type { Kinmu } from "../../modules/kinmus";
import LineThrough from "../parts/LineThrough";

type Props = { kinmu: Kinmu };

// eslint-disable-next-line react/display-name
const KinmuName = React.memo(
  (props: Props): JSX.Element => (
    <LineThrough line={!props.kinmu.is_enabled}>{props.kinmu.name}</LineThrough>
  )
);

export default KinmuName;
