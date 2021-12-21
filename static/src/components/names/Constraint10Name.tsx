import * as React from "react";

import type { Constraint10 } from "../../modules/constraints10";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import * as members from "../../modules/members";
import * as terms from "../../modules/terms";
import * as utils from "../../utils";
import KinmuName from "../names/KinmuName";
import MemberName from "../names/MemberName";
import LineThrough from "../parts/LineThrough";

type Props = {
  constraint10: Constraint10;
};

const Constraint10Name = (props: Props): JSX.Element => {
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
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint10.kinmu_id)!
  );
  return (
    <>
      <MemberName member={selectedMember} />の
      <LineThrough line={!constraint10StartDateIsEnabled}>
        {props.constraint10.start_date_name}
      </LineThrough>
      から
      <LineThrough line={!constraint10StopDateIsEnabled}>
        {props.constraint10.stop_date_name}
      </LineThrough>
      までに
      <KinmuName kinmu={selectedKinmu} />
      を割り当てない
    </>
  );
};

export default Constraint10Name;
