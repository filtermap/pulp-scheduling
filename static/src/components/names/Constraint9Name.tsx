import * as React from "react";
import { Link } from "react-router-dom";

import type { Constraint9 } from "../../modules/constraints9";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import * as members from "../../modules/members";
import * as terms from "../../modules/terms";
import * as utils from "../../utils";
import KinmuName, { KinmuNameLink } from "../names/KinmuName";
import MemberName, { MemberNameLink } from "../names/MemberName";
import LineThrough from "../parts/LineThrough";

type Constraint9NameLinkProps = {
  constraint9: Constraint9;
};

type Constraint9NameProps = Constraint9NameLinkProps & {
  isInLink?: boolean;
};

// eslint-disable-next-line react/display-name
const Constraint9Name = React.memo(
  (props: Constraint9NameProps): JSX.Element => {
    const selectedMember = useAppSelector(
      (state) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        members.selectors.selectById(state, props.constraint9.member_id)!
    );
    const selectedTerm = useAppSelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (state) => terms.selectors.selectById(state, props.constraint9.term_id)!
    );
    const constraint9StartDate = utils.stringToDate(
      props.constraint9.start_date_name
    );
    const termStartDate = utils.stringToDate(selectedTerm.start_date_name);
    const constraint9StartDateIsEnabled =
      !constraint9StartDate || !termStartDate
        ? false
        : termStartDate <= constraint9StartDate;
    const constraint9StopDate = utils.stringToDate(
      props.constraint9.stop_date_name
    );
    const termStopDate = utils.stringToDate(selectedTerm.stop_date_name);
    const constraint9StopDateIsEnabled =
      !constraint9StopDate || !termStopDate
        ? false
        : constraint9StopDate <= termStopDate;
    const selectedKinmu = useAppSelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (state) => kinmus.selectors.selectById(state, props.constraint9.kinmu_id)!
    );
    return (
      <>
        {props.isInLink ? (
          <MemberName member={selectedMember} />
        ) : (
          <MemberNameLink member={selectedMember} />
        )}
        の
        <LineThrough line={!constraint9StartDateIsEnabled}>
          {props.constraint9.start_date_name}
        </LineThrough>
        から
        <LineThrough line={!constraint9StopDateIsEnabled}>
          {props.constraint9.stop_date_name}
        </LineThrough>
        までに
        {props.isInLink ? (
          <KinmuName kinmu={selectedKinmu} />
        ) : (
          <KinmuNameLink kinmu={selectedKinmu} />
        )}
        を割り当てる
      </>
    );
  }
);

export default Constraint9Name;

// eslint-disable-next-line react-memo/require-memo
export const Constraint9NameLink = (
  props: Constraint9NameLinkProps
): JSX.Element => (
  <Link
    to={`/terms/${props.constraint9.term_id}/constraints9#constraint9-${props.constraint9.id}`}
  >
    <Constraint9Name constraint9={props.constraint9} isInLink />
  </Link>
);
