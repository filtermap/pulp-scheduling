import * as React from "react";

import type { Constraint4 } from "../../modules/constraints4";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import * as members from "../../modules/members";
import KinmuName from "../names/KinmuName";
import MemberName from "../names/MemberName";

type Props = {
  constraint4: Constraint4;
};

const Constraint4Name = (props: Props): JSX.Element => {
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint4.kinmu_id)!
  );
  const selectedMember = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => members.selectors.selectById(state, props.constraint4.member_id)!
  );
  return (
    <>
      <MemberName member={selectedMember} />に
      <KinmuName kinmu={selectedKinmu} />を
      {props.constraint4.max_number_of_assignments}回以下割り当てる
    </>
  );
};

export default Constraint4Name;
