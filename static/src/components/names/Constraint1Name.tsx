import * as React from "react";

import type { Constraint1 } from "../../modules/constraints1";
import * as groups from "../../modules/groups";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import * as terms from "../../modules/terms";
import * as utils from "../../utils";
import GroupName from "../names/GroupName";
import KinmuName from "../names/KinmuName";
import LineThrough from "../parts/LineThrough";

type Props = {
  constraint1: Constraint1;
};

// eslint-disable-next-line react/display-name
const Constraint1Name = React.memo((props: Props): JSX.Element => {
  const selectedTerm = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => terms.selectors.selectById(state, props.constraint1.term_id)!
  );
  const selectedKinmu = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => kinmus.selectors.selectById(state, props.constraint1.kinmu_id)!
  );
  const selectedGroup = useAppSelector(
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    (state) => groups.selectors.selectById(state, props.constraint1.group_id)!
  );
  const constraint1StartDate = utils.stringToDate(
    props.constraint1.start_date_name
  );
  const termStartDate = utils.stringToDate(selectedTerm.start_date_name);
  const constraint1StartDateIsEnabled =
    !constraint1StartDate || !termStartDate
      ? false
      : termStartDate <= constraint1StartDate;
  const constraint1StopDate = utils.stringToDate(
    props.constraint1.stop_date_name
  );
  const termStopDate = utils.stringToDate(selectedTerm.stop_date_name);
  const constraint1StopDateIsEnabled =
    !constraint1StopDate || !termStopDate
      ? false
      : constraint1StopDate <= termStopDate;
  return (
    <>
      <LineThrough line={!constraint1StartDateIsEnabled}>
        {props.constraint1.start_date_name}
      </LineThrough>
      から
      <LineThrough line={!constraint1StopDateIsEnabled}>
        {props.constraint1.stop_date_name}
      </LineThrough>
      までの
      <KinmuName kinmu={selectedKinmu} />に
      <GroupName group={selectedGroup} />
      から{props.constraint1.min_number_of_assignments}人以上の職員を割り当てる
    </>
  );
});

export default Constraint1Name;
