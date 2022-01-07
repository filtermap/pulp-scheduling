import * as React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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
    const { t } = useTranslation();
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
      <Trans
        i18nKey="<StartDateName>{{開始日}}</StartDateName>から<StopDateName>{{終了日}}</StopDateName>までの<KinmuName />に<GroupName />から{{割り当て職員数上限}}人以下の職員を割り当てる"
        components={{
          GroupName: props.isInLink ? (
            <GroupName group={selectedGroup} />
          ) : (
            <GroupNameLink group={selectedGroup} />
          ),
          KinmuName: props.isInLink ? (
            <KinmuName kinmu={selectedKinmu} />
          ) : (
            <KinmuNameLink kinmu={selectedKinmu} />
          ),
          StartDateName: <LineThrough line={!constraint2StartDateIsEnabled} />,
          StopDateName: <LineThrough line={!constraint2StopDateIsEnabled} />,
        }}
        values={{
          割り当て職員数上限: props.constraint2.max_number_of_assignments,
          終了日:
            props.constraint2.stop_date_name ||
            t("（{{arg0}}未入力）", { arg0: t("終了日") }),
          開始日:
            props.constraint2.start_date_name ||
            t("（{{arg0}}未入力）", { arg0: t("開始日") }),
        }}
      />
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
