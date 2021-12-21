import * as React from "react";

import type { Kinmu } from "../../modules/kinmus";
import LineThrough from "../parts/LineThrough";

type Props = { kinmu: Kinmu };

const KinmuName = (props: Props): JSX.Element => (
  <LineThrough line={!props.kinmu.is_enabled}>{props.kinmu.name}</LineThrough>
);

export default KinmuName;
