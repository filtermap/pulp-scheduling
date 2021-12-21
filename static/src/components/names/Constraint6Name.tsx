import * as React from "react";

import type { Constraint6 } from "../../modules/constraints6";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import KinmuName from "../names/KinmuName";

type Props = {
  constraint6: Constraint6;
};

const Constraint6Name = (props: Props): JSX.Element => {
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint6.kinmu_id)!
  );
  return (
    <>
      <KinmuName kinmu={selectedKinmu} />
      の連続日数を{props.constraint6.max_number_of_days}日以下にする
    </>
  );
};

export default Constraint6Name;
