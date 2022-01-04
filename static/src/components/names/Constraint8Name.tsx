import * as React from "react";
import { Link } from "react-router-dom";

import type { Constraint8 } from "../../modules/constraints8";
import { useAppSelector } from "../../modules/hooks";
import * as kinmus from "../../modules/kinmus";
import KinmuName, { KinmuNameLink } from "../names/KinmuName";

type Constraint8NameLinkProps = {
  constraint8: Constraint8;
};

type Constraint8NameProps = Constraint8NameLinkProps & {
  isInLink?: boolean;
};

// eslint-disable-next-line react/display-name
const Constraint8Name = React.memo(
  (props: Constraint8NameProps): JSX.Element => {
    const selectedKinmu = useAppSelector(
      // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
      (state) => kinmus.selectors.selectById(state, props.constraint8.kinmu_id)!
    );
    return (
      <>
        {props.isInLink ? (
          <KinmuName kinmu={selectedKinmu} />
        ) : (
          <KinmuNameLink kinmu={selectedKinmu} />
        )}
        の間隔日数を{props.constraint8.max_number_of_days}日以下にする
      </>
    );
  }
);

export default Constraint8Name;

// eslint-disable-next-line react/display-name
export const Constraint8NameLink = React.memo(
  (props: Constraint8NameLinkProps): JSX.Element => (
    <Link
      to={`/terms/${props.constraint8.term_id}/constraints8#constraint8-${props.constraint8.id}`}
    >
      <Constraint8Name constraint8={props.constraint8} isInLink />
    </Link>
  )
);
