import * as React from "react";
import { Trans } from "react-i18next";
import { Link } from "react-router-dom";

import type { Constraint5 } from "../../modules/constraints5";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import KinmuName, { KinmuNameLink } from "../names/KinmuName";

type Constraint5NameLinkProps = {
  constraint5: Constraint5;
};

type Constraint5NameProps = Constraint5NameLinkProps & {
  isInLink?: boolean;
};

// eslint-disable-next-line react/display-name
const Constraint5Name = React.memo(
  (props: Constraint5NameProps): JSX.Element => {
    const selectedKinmu = useAppSelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (state) => kinmus.selectors.selectById(state, props.constraint5.kinmu_id)!
    );
    return (
      <Trans
        i18nKey="<KinmuName />の連続日数を{{連続日数下限}}日以上にする"
        components={{
          KinmuName: props.isInLink ? (
            <KinmuName kinmu={selectedKinmu} />
          ) : (
            <KinmuNameLink kinmu={selectedKinmu} />
          ),
        }}
        values={{
          連続日数下限: props.constraint5.min_number_of_days,
        }}
      />
    );
  }
);

export default Constraint5Name;

// eslint-disable-next-line react/display-name
export const Constraint5NameLink = React.memo(
  (props: Constraint5NameLinkProps): JSX.Element => (
    <Link
      to={`/terms/${props.constraint5.term_id}/constraints5#constraint5-${props.constraint5.id}`}
    >
      <Constraint5Name constraint5={props.constraint5} isInLink />
    </Link>
  )
);
