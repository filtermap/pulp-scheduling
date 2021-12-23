import * as React from "react";

import type { Constraint5 } from "../../modules/constraints5";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import KinmuName from "../names/KinmuName";

type Props = {
  constraint5: Constraint5;
};

// eslint-disable-next-line react/display-name
const Constraint5Name = React.memo((props: Props): JSX.Element => {
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint5.kinmu_id)!
  );
  return (
    <>
      <KinmuName kinmu={selectedKinmu} />
      の連続日数を{props.constraint5.min_number_of_days}日以上にする
    </>
  );
});

export default Constraint5Name;
