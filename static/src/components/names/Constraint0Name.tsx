import * as React from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

import * as constraint0_kinmus from "../../modules/constraint0_kinmus";
import type { Constraint0 } from "../../modules/constraints0";
import * as kinmus from "../../modules/kinmus";
import * as utils from "../../utils";
import KinmuName, { KinmuNameLink } from "../names/KinmuName";

type Constraint0NameLinkProps = {
  constraint0: Constraint0;
};

type Constraint0NameProps = Constraint0NameLinkProps & {
  isInLink?: boolean;
};

// eslint-disable-next-line react/display-name
const Constraint0Name = React.memo(
  (props: Constraint0NameProps): JSX.Element => {
    const selectedConstraint0Kinmus = useSelector(
      constraint0_kinmus.selectors.selectAll
    );
    const selectedKinmuById = useSelector(kinmus.selectors.selectEntities);
    const constraint0Constraint0Kinmus = selectedConstraint0Kinmus
      .filter(({ constraint0_id }) => constraint0_id === props.constraint0.id)
      .sort((a, b) => a.sequence_number - b.sequence_number);
    return (
      <>
        {utils.intersperse(
          constraint0Constraint0Kinmus.map(({ id, kinmu_id }) =>
            props.isInLink ? (
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              <KinmuName key={id} kinmu={selectedKinmuById[kinmu_id]!} />
            ) : (
              // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
              <KinmuNameLink key={id} kinmu={selectedKinmuById[kinmu_id]!} />
            )
          ),
          ", "
        )}
      </>
    );
  }
);

export default Constraint0Name;

// eslint-disable-next-line react/display-name
export const Constraint0NameLink = React.memo(
  (props: Constraint0NameLinkProps): JSX.Element => (
    <Link
      to={`/terms/${props.constraint0.term_id}/constraints0#constraint0-${props.constraint0.id}`}
    >
      <Constraint0Name constraint0={props.constraint0} isInLink />
    </Link>
  )
);
