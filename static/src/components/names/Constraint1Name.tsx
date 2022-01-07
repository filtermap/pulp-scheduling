import * as React from "react";
import { useTranslation, Trans } from "react-i18next";
import { Link } from "react-router-dom";

import type { Constraint1 } from "../../modules/constraints1";
import * as groups from "../../modules/groups";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import * as terms from "../../modules/terms";
import * as utils from "../../utils";
import GroupName, { GroupNameLink } from "../names/GroupName";
import KinmuName, { KinmuNameLink } from "../names/KinmuName";
import LineThrough from "../parts/LineThrough";

type Constraint1NameLinkProps = {
  constraint1: Constraint1;
};

type Constraint1NameProps = Constraint1NameLinkProps & {
  isInLink?: boolean;
};

// eslint-disable-next-line react/display-name
const Constraint1Name = React.memo(
  (props: Constraint1NameProps): JSX.Element => {
    const { t } = useTranslation();
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
      <Trans
        i18nKey="<StartDateName>{{開始日}}</StartDateName>から<StopDateName>{{終了日}}</StopDateName>まで<KinmuName />に<GroupName />から{{割り当て職員数下限}}人以上の職員を割り当てる"
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
          StartDateName: <LineThrough line={!constraint1StartDateIsEnabled} />,
          StopDateName: <LineThrough line={!constraint1StopDateIsEnabled} />,
        }}
        values={{
          割り当て職員数下限: props.constraint1.min_number_of_assignments,
          終了日:
            props.constraint1.stop_date_name ||
            t("（{{arg0}}未入力）", { arg0: t("終了日") }),
          開始日:
            props.constraint1.start_date_name ||
            t("（{{arg0}}未入力）", { arg0: t("開始日") }),
        }}
      />
    );
  }
);

export default Constraint1Name;

// eslint-disable-next-line react/display-name
export const Constraint1NameLink = React.memo(
  (props: Constraint1NameLinkProps): JSX.Element => (
    <Link
      to={`/terms/${props.constraint1.term_id}/constraints1#constraint1-${props.constraint1.id}`}
    >
      <Constraint1Name constraint1={props.constraint1} isInLink />
    </Link>
  )
);
