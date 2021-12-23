import * as React from "react";

import type { Constraint3 } from "../../modules/constraints3";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import * as members from "../../modules/members";
import KinmuName from "../names/KinmuName";
import MemberName from "../names/MemberName";

type Props = {
  constraint3: Constraint3;
};

// eslint-disable-next-line react/display-name
const Constraint3Name = React.memo((props: Props): JSX.Element => {
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint3.kinmu_id)!
  );
  const selectedMember = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => members.selectors.selectById(state, props.constraint3.member_id)!
  );
  return (
    <>
      <MemberName member={selectedMember} />に
      <KinmuName kinmu={selectedKinmu} />を
      {props.constraint3.min_number_of_assignments}回以上割り当てる
    </>
  );
});

export default Constraint3Name;
