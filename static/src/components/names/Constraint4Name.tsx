import * as React from "react";
import { Link } from "react-router-dom";

import type { Constraint4 } from "../../modules/constraints4";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import * as members from "../../modules/members";
import KinmuName, { KinmuNameLink } from "../names/KinmuName";
import MemberName, { MemberNameLink } from "../names/MemberName";

type Constraint4NameLinkProps = {
  constraint4: Constraint4;
};

type Constraint4NameProps = Constraint4NameLinkProps & {
  isInLink?: boolean;
};

// eslint-disable-next-line react/display-name
const Constraint4Name = React.memo(
  (props: Constraint4NameProps): JSX.Element => {
    const selectedKinmu = useAppSelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (state) => kinmus.selectors.selectById(state, props.constraint4.kinmu_id)!
    );
    const selectedMember = useAppSelector(
      (state) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        members.selectors.selectById(state, props.constraint4.member_id)!
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
        を{props.constraint4.max_number_of_assignments}回以下割り当てる
      </>
    );
  }
);

export default Constraint4Name;

// eslint-disable-next-line react/display-name
export const Constraint4NameLink = React.memo(
  (props: Constraint4NameLinkProps): JSX.Element => (
    <Link
      to={`/terms/${props.constraint4.term_id}/constraints4#constraint4-${props.constraint4.id}`}
    >
      <Constraint4Name constraint4={props.constraint4} isInLink />
    </Link>
  )
);
