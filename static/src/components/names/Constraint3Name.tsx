import * as React from "react";
import { Trans, useTranslation } from "react-i18next";
import { Link } from "react-router-dom";

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
    const { t } = useTranslation();
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
      <Trans
        i18nKey="<MemberName />に<KinmuName />を{{割り当て数下限}}回以上割り当てる"
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
        }}
        values={{
          割り当て数下限:
            props.constraint3.min_number_of_assignments ||
            t("（{{arg0}}未入力）", { arg0: t("割り当て数下限") }),
        }}
      />
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
