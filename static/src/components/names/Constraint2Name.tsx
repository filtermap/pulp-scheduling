import * as React from "react";
import { Link } from "react-router-dom";

import { m } from "../../messages";
import type { Constraint2 } from "../../modules/constraints2";
import * as groups from "../../modules/groups";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import * as terms from "../../modules/terms";
import * as utils from "../../utils";
import GroupName, { GroupNameLink } from "../names/GroupName";
import KinmuName, { KinmuNameLink } from "../names/KinmuName";
import LineThrough from "../parts/LineThrough";

type Constraint2NameLinkProps = {
  constraint2: Constraint2;
};

type Constraint2NameProps = Constraint2NameLinkProps & {
  isInLink?: boolean;
};

// eslint-disable-next-line react/display-name
const Constraint2Name = React.memo(
  (props: Constraint2NameProps): JSX.Element => {
    const selectedTerm = useAppSelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (state) => terms.selectors.selectById(state, props.constraint2.term_id)!
    );
    const selectedKinmu = useAppSelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (state) => kinmus.selectors.selectById(state, props.constraint2.kinmu_id)!
    );
    const selectedGroup = useAppSelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (state) => groups.selectors.selectById(state, props.constraint2.group_id)!
    );
    const constraint2StartDate = utils.stringToDate(
      props.constraint2.start_date_name
    );
    const termStartDate = utils.stringToDate(selectedTerm.start_date_name);
    const constraint2StartDateIsEnabled =
      !constraint2StartDate || !termStartDate
        ? false
        : termStartDate <= constraint2StartDate;
    const constraint2StopDate = utils.stringToDate(
      props.constraint2.stop_date_name
    );
    const termStopDate = utils.stringToDate(selectedTerm.stop_date_name);
    const constraint2StopDateIsEnabled =
      !constraint2StopDate || !termStopDate
        ? false
        : constraint2StopDate <= termStopDate;
    return (
      <>
        <LineThrough line={!constraint2StartDateIsEnabled}>
          {props.constraint2.start_date_name ||
            m["（arg0未入力）"](m["開始日"])}
        </LineThrough>
        から
        <LineThrough line={!constraint2StopDateIsEnabled}>
          {props.constraint2.stop_date_name || m["（arg0未入力）"](m["終了日"])}
        </LineThrough>
        までの
        {props.isInLink ? (
          <KinmuName kinmu={selectedKinmu} />
        ) : (
          <KinmuNameLink kinmu={selectedKinmu} />
        )}
        に
        {props.isInLink ? (
          <GroupName group={selectedGroup} />
        ) : (
          <GroupNameLink group={selectedGroup} />
        )}
        から{props.constraint2.max_number_of_assignments}
        人以下の職員を割り当てる
      </>
    );
  }
);

export default Constraint2Name;

// eslint-disable-next-line react/display-name
export const Constraint2NameLink = React.memo(
  (props: Constraint2NameLinkProps): JSX.Element => (
    <Link
      to={`/terms/${props.constraint2.term_id}/constraints2#constraint2-${props.constraint2.id}`}
    >
      <Constraint2Name constraint2={props.constraint2} isInLink />
    </Link>
  )
);
