import { TableCell } from "@mui/material";
import { styled } from "@mui/material/styles";
import React from "react";

const StickyLeftTableCell = React.memo(
  styled(TableCell)(({ theme }) => ({
    backgroundColor: theme.palette.background.default,
    left: 0,
    position: "sticky",
  }))
);

export default StickyLeftTableCell;
