import * as React from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

import type { Constraint7 } from "../../modules/constraints7";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import KinmuName, { KinmuNameLink } from "../names/KinmuName";

type Constraint7NameLinkProps = {
  constraint7: Constraint7;
};

type Constraint7NameProps = Constraint7NameLinkProps & {
  isInLink?: boolean;
};

// eslint-disable-next-line react/display-name
const Constraint7Name = React.memo(
  (props: Constraint7NameProps): JSX.Element => {
    const selectedKinmu = useAppSelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (state) => kinmus.selectors.selectById(state, props.constraint7.kinmu_id)!
    );
    return (
      <Trans
        i18nKey="<KinmuName />の間隔日数を{{間隔日数下限}}日以上にする"
        components={{
          KinmuName: props.isInLink ? (
            <KinmuName kinmu={selectedKinmu} />
          ) : (
            <KinmuNameLink kinmu={selectedKinmu} />
          ),
        }}
        values={{
          間隔日数下限: props.constraint7.min_number_of_days,
        }}
      />
    );
  }
);

export default Constraint7Name;

// eslint-disable-next-line react/display-name
export const Constraint7NameLink = React.memo(
  (props: Constraint7NameLinkProps): JSX.Element => (
    <Link
      to={`/terms/${props.constraint7.term_id}/constraints7#constraint7-${props.constraint7.id}`}
    >
      <Constraint7Name constraint7={props.constraint7} isInLink />
    </Link>
  )
);
