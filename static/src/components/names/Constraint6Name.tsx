import * as React from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

import type { Constraint6 } from "../../modules/constraints6";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import KinmuName, { KinmuNameLink } from "../names/KinmuName";

type Constraint6NameLinkProps = {
  constraint6: Constraint6;
};

type Constraint6NameProps = Constraint6NameLinkProps & {
  isInLink?: boolean;
};

// eslint-disable-next-line react/display-name
const Constraint6Name = React.memo(
  (props: Constraint6NameProps): JSX.Element => {
    const selectedKinmu = useAppSelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (state) => kinmus.selectors.selectById(state, props.constraint6.kinmu_id)!
    );
    return (
      <Trans
        i18nKey="<KinmuName />の連続日数を{{連続日数上限}}日以下にする"
        components={{
          KinmuName: props.isInLink ? (
            <KinmuName kinmu={selectedKinmu} />
          ) : (
            <KinmuNameLink kinmu={selectedKinmu} />
          ),
        }}
        values={{
          連続日数上限: props.constraint6.max_number_of_days,
        }}
      />
    );
  }
);

export default Constraint6Name;

// eslint-disable-next-line react/display-name
export const Constraint6NameLink = React.memo(
  (props: Constraint6NameLinkProps): JSX.Element => (
    <Link
      to={`/terms/${props.constraint6.term_id}/constraints6#constraint6-${props.constraint6.id}`}
    >
      <Constraint6Name constraint6={props.constraint6} isInLink />
    </Link>
  )
);
