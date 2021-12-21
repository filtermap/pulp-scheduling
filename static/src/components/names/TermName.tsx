import * as React from "react";

import type { Term } from "../../modules/terms";

type Props = { term: Term };

const TermName = (props: Props): JSX.Element => (
  <>
    {props.term.start_date_name}から{props.term.stop_date_name}まで
  </>
);

export default TermName;
