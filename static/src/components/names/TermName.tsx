import * as React from "react";
import { useTranslation } from "react-i18next";

import type { Term } from "../../modules/terms";

type Props = { term: Term };

// eslint-disable-next-line react/display-name
const TermName = React.memo((props: Props): JSX.Element => {
  const { t } = useTranslation();
  return (
    <>
      {props.term.start_date_name ||
        t("（{{arg0}}未入力）", { arg0: t("開始日") })}
      から
      {props.term.stop_date_name ||
        t("（{{arg0}}未入力）", { arg0: t("終了日") })}
      まで
    </>
  );
});

export default TermName;
