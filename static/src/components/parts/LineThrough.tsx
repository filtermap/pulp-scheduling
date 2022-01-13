import Box, { BoxProps } from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import * as React from "react";

type Props = BoxProps & { line: boolean };

const LineThrough = React.memo(
  styled((props: Props) => {
    const { line, ...other } = props;
    return <Box component="span" {...other} />;
  })(({ line }) => ({
    ...(line && {
      "&::-webkit-datetime-edit-fields-wrapper": {
        textDecoration: "line-through",
      },
      textDecoration: "line-through",
    }),
  }))
);

export default LineThrough;
