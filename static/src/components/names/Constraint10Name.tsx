import * as React from "react";
import { Link } from "react-router-dom";

import { m } from "../../messages";
import type { Constraint10 } from "../../modules/constraints10";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import * as members from "../../modules/members";
import * as terms from "../../modules/terms";
import * as utils from "../../utils";
import KinmuName, { KinmuNameLink } from "../names/KinmuName";
import MemberName, { MemberNameLink } from "../names/MemberName";
import LineThrough from "../parts/LineThrough";

type Constraint10NameLinkProps = {
  constraint10: Constraint10;
};

type Constraint10NameProps = Constraint10NameLinkProps & {
  isInLink?: boolean;
};

// eslint-disable-next-line react/display-name
const Constraint10Name = React.memo(
  (props: Constraint10NameProps): JSX.Element => {
    const selectedMember = useAppSelector(
      (state) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        members.selectors.selectById(state, props.constraint10.member_id)!
    );
    const selectedTerm = useAppSelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (state) => terms.selectors.selectById(state, props.constraint10.term_id)!
    );
    const constraint10StartDate = utils.stringToDate(
      props.constraint10.start_date_name
    );
    const termStartDate = utils.stringToDate(selectedTerm.start_date_name);
    const constraint10StartDateIsEnabled =
      !constraint10StartDate || !termStartDate
        ? false
        : termStartDate <= constraint10StartDate;
    const constraint10StopDate = utils.stringToDate(
      props.constraint10.stop_date_name
    );
    const termStopDate = utils.stringToDate(selectedTerm.stop_date_name);
    const constraint10StopDateIsEnabled =
      !constraint10StopDate || !termStopDate
        ? false
        : constraint10StopDate <= termStopDate;
    const selectedKinmu = useAppSelector(
      (state) =>
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        kinmus.selectors.selectById(state, props.constraint10.kinmu_id)!
    );
    return (
      <>
        {props.isInLink ? (
          <MemberName member={selectedMember} />
        ) : (
          <MemberNameLink member={selectedMember} />
        )}
        の
        <LineThrough line={!constraint10StartDateIsEnabled}>
          {props.constraint10.start_date_name ||
            m["（arg0未入力）"](m["開始日"])}
        </LineThrough>
        から
        <LineThrough line={!constraint10StopDateIsEnabled}>
          {props.constraint10.stop_date_name ||
            m["（arg0未入力）"](m["終了日"])}
        </LineThrough>
        までに
        {props.isInLink ? (
          <KinmuName kinmu={selectedKinmu} />
        ) : (
          <KinmuNameLink kinmu={selectedKinmu} />
        )}
        を割り当てない
      </>
    );
  }
);

export default Constraint10Name;

// eslint-disable-next-line react/display-name
export const Constraint10NameLink = React.memo(
  (props: Constraint10NameLinkProps): JSX.Element => (
    <Link
      to={`/terms/${props.constraint10.term_id}/constraints10#constraint10-${props.constraint10.id}`}
    >
      <Constraint10Name constraint10={props.constraint10} isInLink />
    </Link>
  )
);
