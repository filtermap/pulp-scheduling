import * as React from "react";

import type { Constraint7 } from "../../modules/constraints7";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import KinmuName from "../names/KinmuName";

type Props = {
  constraint7: Constraint7;
};

// eslint-disable-next-line react/display-name
const Constraint7Name = React.memo((props: Props): JSX.Element => {
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint7.kinmu_id)!
  );
  return (
    <>
      <KinmuName kinmu={selectedKinmu} />
      の間隔日数を{props.constraint7.min_number_of_days}日以上にする
    </>
  );
});

export default Constraint7Name;
