import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import * as React from "react";

import lineThroughSx from "./lineThroughSx";

type Props = BoxProps & { line: boolean };

const LineThrough = React.memo(
  styled((props: Props) => {
    const { line, ...other } = props;
    return <Box component="span" {...other} />;
  })(({ line }) => ({ ...(line && lineThroughSx) }))
);

export default LineThrough;
