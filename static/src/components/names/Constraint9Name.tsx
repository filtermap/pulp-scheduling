import * as React from "react";
import { Trans, useTranslation } from "react-i18next";
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
    const { t } = useTranslation();
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
      <Trans
        i18nKey="<MemberName />の<StartDateName>{{開始日}}</StartDateName>から<StopDateName>{{終了日}}</StopDateName>までに<KinmuName />を割り当てる"
        components={{
          KinmuName: props.isInLink ? (
            <KinmuName kinmu={selectedKinmu} />
          ) : (
            <KinmuNameLink kinmu={selectedKinmu} />
          ),
          MemberName: props.isInLink ? (
            <MemberName member={selectedMember} />
          ) : (
            <MemberNameLink member={selectedMember} />
          ),
          StartDateName: <LineThrough line={!constraint9StartDateIsEnabled} />,
          StopDateName: <LineThrough line={!constraint9StopDateIsEnabled} />,
        }}
        values={{
          終了日:
            props.constraint9.stop_date_name ||
            t("（{{arg0}}未入力）", { arg0: t("終了日") }),
          開始日:
            props.constraint9.start_date_name ||
            t("（{{arg0}}未入力）", { arg0: t("開始日") }),
        }}
      />
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
