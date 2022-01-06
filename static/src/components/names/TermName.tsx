import * as React from "react";

import { m } from "../../messages";
import type { Term } from "../../modules/terms";

type Props = { term: Term };

// eslint-disable-next-line react/display-name
const TermName = React.memo(
  (props: Props): JSX.Element => (
    <>
      {props.term.start_date_name || m["（arg0未入力）"](m["開始日"])}から
      {props.term.stop_date_name || m["（arg0未入力）"](m["終了日"])}まで
    </>
  )
);

export default TermName;
