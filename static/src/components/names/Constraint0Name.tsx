import * as React from "react";
import { useSelector } from "react-redux";

import * as constraint0_kinmus from "../../modules/constraint0_kinmus";
import type { Constraint0 } from "../../modules/constraints0";
import * as kinmus from "../../modules/kinmus";
import * as utils from "../../utils";
import KinmuName from "../names/KinmuName";

type Props = {
  constraint0: Constraint0;
};

const Constraint0Name = (props: Props): JSX.Element => {
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
        constraint0Constraint0Kinmus.map(({ id, kinmu_id }) => {
          // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
          return <KinmuName key={id} kinmu={selectedKinmuById[kinmu_id]!} />;
        }),
        ", "
      )}
    </>
  );
};

export default Constraint0Name;
