import * as React from "react";
import { Link } from "react-router-dom";

import { m } from "../../messages";
import type { Constraint3 } from "../../modules/constraints3";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import * as members from "../../modules/members";
import KinmuName, { KinmuNameLink } from "../names/KinmuName";
import MemberName, { MemberNameLink } from "../names/MemberName";

type Constraint3NameLinkProps = {
  constraint3: Constraint3;
};

type Constraint3NameProps = Constraint3NameLinkProps & {
  isInLink?: boolean;
};

// eslint-disable-next-line react/display-name
const Constraint3Name = React.memo(
  (props: Constraint3NameProps): JSX.Element => {
    const selectedKinmu = useAppSelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (state) => kinmus.selectors.selectById(state, props.constraint3.kinmu_id)!
    );
    const selectedMember = useAppSelector(
      (state) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        members.selectors.selectById(state, props.constraint3.member_id)!
    );
    return (
      <>
        {props.isInLink ? (
          <MemberName member={selectedMember} />
        ) : (
          <MemberNameLink member={selectedMember} />
        )}
        に
        {props.isInLink ? (
          <KinmuName kinmu={selectedKinmu} />
        ) : (
          <KinmuNameLink kinmu={selectedKinmu} />
        )}
        を
        {props.constraint3.min_number_of_assignments ||
          m["（arg0未入力）"](m["割り当て数下限"])}
        回以上割り当てる
      </>
    );
  }
);

export default Constraint3Name;

// eslint-disable-next-line react/display-name
export const Constraint3NameLink = React.memo(
  (props: Constraint3NameLinkProps): JSX.Element => (
    <Link
      to={`/terms/${props.constraint3.term_id}/constraints3#constraint3-${props.constraint3.id}`}
    >
      <Constraint3Name constraint3={props.constraint3} isInLink />
    </Link>
  )
);
