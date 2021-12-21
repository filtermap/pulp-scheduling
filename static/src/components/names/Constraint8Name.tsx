import * as React from "react";

import type { Constraint8 } from "../../modules/constraints8";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import KinmuName from "../names/KinmuName";

type Props = {
  constraint8: Constraint8;
};

const Constraint8Name = (props: Props): JSX.Element => {
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint8.kinmu_id)!
  );
  return (
    <>
      <KinmuName kinmu={selectedKinmu} />
      の間隔日数を{props.constraint8.max_number_of_days}日以下にする
    </>
  );
};

export default Constraint8Name;
